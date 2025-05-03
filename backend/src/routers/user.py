# src/routers/user.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session, select, exists
from sqlalchemy import func, case
from src.core.database import engine, get_session
from src.models.user import User, UserAccount
from src.models.group import Group, Member
from src.models.group_account import GroupAccount, GroupTransaction, LockIn
from src.schemas.user import UserCreate, UserRead, UserDetail
from src.schemas.account import LockInSummary
from src.schemas.group import UserGroupSummary

router = APIRouter(prefix="/users", tags=["Users"])


# ──────────────────────────────── 유저 생성
@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="유저 생성",
    description="이메일 중복 검사를 통해 새로운 유저를 생성하고 계좌를 자동 연결합니다.",
)
def create_user(dto: UserCreate):
    with Session(engine) as s:
        if s.execute(select(exists().where(User.email == dto.email))).scalar_one():
            raise HTTPException(400, "Email already registered")

        user = User(name=dto.name, email=dto.email)
        s.add(user)
        s.flush()

        s.add(
            UserAccount(
                user_id=user.id,
                account_name=dto.account_name,
                account_number=dto.account_number,
                balance=0.0,
            )
        )
        s.commit()
        return UserRead.model_validate(user, from_attributes=True)


# ──────────────────────────────── 전체 유저 조회
@router.get(
    "",
    response_model=List[UserRead],
    summary="전체 유저 조회",
    description="전체 사용자 목록을 조회합니다.",
)
def get_users(session: Session = Depends(get_session)):
    rows = session.execute(select(User)).scalars().all()
    return [UserRead.model_validate(r, from_attributes=True) for r in rows]


# ──────────────────────────────── 특정 유저 상세
@router.get(
    "/{user_id}",
    response_model=UserDetail,
    summary="특정 유저 상세조회",
    description="특정 사용자(user_id)의 상세 정보와 계좌 목록을 조회합니다.",
)
def get_user_detail(user_id: int):
    with Session(engine) as s:
        user = s.get(User, user_id)
        if not user:
            raise HTTPException(404, "User not found")

        ua = s.execute(select(UserAccount).where(UserAccount.user_id == user_id)).scalars().first()
        if not ua:
            raise HTTPException(404, "Account not found")

        rows = s.execute(
            select(LockIn.group_account_id, func.sum(LockIn.amount))
            .where(LockIn.user_account_id == ua.id)
            .group_by(LockIn.group_account_id)
        ).all()
        locked_map = {ga_id: amt for ga_id, amt in rows}
        total_locked = sum(locked_map.values())

        return UserDetail(
            id=user.id,
            name=user.name,
            email=user.email,
            account=dict(
                id=ua.id,
                user_id=ua.user_id,
                account_name=ua.account_name,
                account_number=ua.account_number,
                balance=ua.balance,
                locked_balance=total_locked,
                lockins=[
                LockInSummary(group_account_id=ga_id, amount=amt)
                for ga_id, amt in locked_map.items()
                    if amt > 0
                ],
            ),
        )


# ──────────────────────────────── 유저가 속한 모임 목록
@router.get(
    "/{user_id}/groups",
    response_model=List[UserGroupSummary],
    summary="유저의 모임 목록 조회",
    description="특정 유저가 속한 모든 모임 정보를 요약해서 반환합니다.",
)
def get_user_groups(user_id: int):
    with Session(engine) as s:
        ua = s.execute(select(UserAccount).where(UserAccount.user_id == user_id)).scalars().first()
        if not ua:
            raise HTTPException(404, "유저 계좌 없음")

        GA = GroupAccount
        GT = GroupTransaction
        
        # 멤버 카운트를 위한 서브쿼리
        member_count_subq = (
            select(func.count(Member.id))
            .where(Member.group_id == Group.id)
            .correlate(Group)
            .scalar_subquery()
        )
        
        stmt = (
            select(
                Group.id,
                Group.name,
                Group.category,
                Group.image_url,
                GA.account_number,
                member_count_subq.label("member_count"),  # 서브쿼리로 정확한 멤버 수 계산
                func.coalesce(func.sum(GT.amount), 0).label("group_balance"),
                func.coalesce(
                    func.sum(
                        case(
                            (GT.user_account_id == ua.id, GT.amount),
                            else_=0,
                        )
                    ),
                    0,
                ).label("locked_amount"),
            )
            .join(Member, Member.group_id == Group.id)
            .join(GA, GA.group_id == Group.id)
            .outerjoin(GT, GT.group_account_id == GA.id)
            .where(Member.user_id == user_id)
            .group_by(Group.id, GA.account_number)
        )

        rows = s.execute(stmt).all()
        return [
            UserGroupSummary(
                id=r.id,
                name=r.name,
                category=r.category,
                image_url=r.image_url,
                account_number=r.account_number,
                group_balance=r.group_balance,
                locked_amount=r.locked_amount,
                member_count=r.member_count,
            )
            for r in rows
        ]