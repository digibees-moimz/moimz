# FastAPI & SQLModel
from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy import func, case
# DB 연결
from src.core.database import engine
# Models
from src.models.user import User, UserAccount
from src.models.group import Group, Member
from src.models.group_account import GroupAccount, GroupTransaction, LockIn
# Schemas
from src.schemas.user import UserCreate, UserRead, UserDetail
from src.schemas.account import LockInSummary
from src.schemas.group import UserGroupSummary
# ORM 옵션 (only used in get_user_detail)
from sqlalchemy.orm import selectinload, aliased
# 유틸
from collections import defaultdict

router = APIRouter(prefix="/users", tags=["Users"])

@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    summary="유저 생성",
    description="이메일 중복 검사를 통해 새로운 유저를 생성하고, 계좌도 자동으로 연결합니다.",
)
def create_user(user_in: UserCreate):
    with Session(engine) as session:
        # 이메일 중복 체크
        dup = session.exec(select(User).where(User.email == user_in.email)).first()
        if dup:
            raise HTTPException(400, detail="Email already registered")

        # 1. 유저 생성
        user = User(
            name=user_in.name,
            email=user_in.email,
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # 2. 계좌 생성 (자동 연결)
        account = UserAccount(
            user_id=user.id,
            account_name=user_in.account_name,
            account_number=user_in.account_number,
            balance=0.0,
        )
        session.add(account)
        session.commit()

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }


@router.get(
    "",
    response_model=list[UserRead],
    summary="전체 유저 조회",
    description="전체 사용자 목록을 조회합니다.",
)
def get_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return users

@router.get(
    "/{user_id}",
    response_model=UserDetail,
    summary="특정 유저 상세조회",
    description="특정 사용자(user_id)의 상세 정보와 계좌 목록을 조회합니다.",
)
def get_user_detail(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        account = session.exec(
            select(UserAccount)
            .where(UserAccount.user_id == user_id)
            .options(selectinload(UserAccount.lockins))
        ).first()

        if not account:
            raise HTTPException(404, "Account not found")

        # group_id 기준으로 금액 합산
        grouped = defaultdict(float)
        for li in account.lockins:
            grouped[li.group_id] += li.amount

        lockins_summary = [
            LockInSummary(group_id=gid, amount=amt)
            for gid, amt in grouped.items()
            if amt > 0  # 잔액이 0 이하인 건 제외 (원하면 제거 조건 없애도 됨)
        ]

        total_locked = sum(grouped.values())

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "account": {
                "id": account.id,
                "user_id": account.user_id,
                "account_name": account.account_name,
                "account_number": account.account_number,
                "balance": account.balance,
                "locked_balance": total_locked,
                "lockins": lockins_summary,
            },
        }

@router.get("/{user_id}/groups", response_model=list[UserGroupSummary])
def get_user_groups(user_id: int):
    with Session(engine) as session:

        user_account = session.exec(
            select(UserAccount).where(UserAccount.user_id == user_id)
        ).first()
        if not user_account:
            raise HTTPException(404, "유저 계좌 없음")

        member_group_ids = session.exec(
            select(Member.group_id).where(Member.user_id == user_id)
        ).all()
        if not member_group_ids:
            return []

        member_cnt_subq = (
            select(func.count())
            .where(Member.group_id == Group.id)          # Group.id 를 외부에서 참조
            .correlate(Group)
            .scalar_subquery()
        )

        balance_subq = (
            select(func.coalesce(func.sum(GroupTransaction.amount), 0))
            .join(GroupAccount, GroupAccount.id == GroupTransaction.group_account_id)
            .where(GroupAccount.group_id == Group.id)
            .correlate(Group)
            .scalar_subquery()
        )

        locked_subq = (
            select(func.coalesce(func.sum(GroupTransaction.amount), 0))
            .join(GroupAccount, GroupAccount.id == GroupTransaction.group_account_id)
            .where(
                GroupAccount.group_id == Group.id,
                GroupTransaction.user_account_id == user_account.id,
            )
            .correlate(Group)
            .scalar_subquery()
        )

        stmt = (
            select(
                Group.id,
                Group.name,
                Group.category,
                Group.image_url,
                member_cnt_subq.label("member_count"),
                balance_subq.label("group_balance"),
                locked_subq.label("locked_amount"),
            )
            .where(Group.id.in_(member_group_ids))
        )

        rows = session.exec(stmt).all()

        return [
            UserGroupSummary(
                id=row.id,
                name=row.name,
                category=row.category,
                image_url=row.image_url,
                group_balance=row.group_balance,
                locked_amount=row.locked_amount,
                member_count=row.member_count,
            )
            for row in rows
        ]