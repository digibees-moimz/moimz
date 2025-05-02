from fastapi import APIRouter, status, HTTPException, Depends
from typing import List
from sqlmodel import Session, select
from src.core.database import engine, get_session
from src.models.group import Group, Member
from src.schemas.group import GroupCreate, GroupRead, GroupJoin, GroupUpdate, GroupLeave
from src.models.group_account import GroupAccount
from src.models.user import User
import random

router = APIRouter(prefix="/groups", tags=["Groups"])


def generate_account_number() -> str:
    yyy = f"{random.randint(0, 999):03d}"
    zz = f"{random.randint(0, 99):02d}"
    zzzzzz = f"{random.randint(0, 999999):06d}"
    c = str(random.randint(0, 9))
    return f"{yyy}-{zz}-{zzzzzz}-{c}"

@router.post(
    "",
    response_model=GroupRead,
    status_code=status.HTTP_201_CREATED,
    summary="모임 생성",
    description="새로운 모임을 생성하고, 동시에 해당 모임 전용 그룹 계좌도 생성합니다.",
)
def create_group(group_in: GroupCreate):
    with Session(engine) as session:
        new_group = Group(**group_in.dict())
        session.add(new_group)
        session.commit()
        session.refresh(new_group)

        # 모임 계좌 생성 로직 추가
        group_account = GroupAccount(
            group_id=new_group.id, 
            account_number=generate_account_number()
            )
        session.add(group_account)
        session.commit()

        return {
            "id": new_group.id,
            "name": new_group.name,
            "category": new_group.category,
            "description": new_group.description,
            "image_url": new_group.image_url,
        }


@router.get(
    "",
    response_model=list[GroupRead],
    summary="전체 모임 조회",
    description="전체 모임(Group) 목록을 조회합니다.",
)
def get_groups():
    with Session(engine) as session:
        return session.exec(select(Group)).all()


@router.patch(
    "/{group_id}",
    response_model=GroupRead,
    summary="모임 정보 수정",
    description="모임 이름, 설명, 카테고리, 대표 이미지를 수정합니다.",
)
def update_group(group_id: int, group_in: GroupUpdate):
    with Session(engine) as session:
        group = session.get(Group, group_id)
        if not group:
            raise HTTPException(status_code=404, detail="해당 모임이 존재하지 않습니다")

        update_data = group_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(group, key, value)

        session.add(group)
        session.commit()
        session.refresh(group)

        return group


@router.post(
    "/members",
    summary="모임 가입",
    description="사용자가 특정 모임에 멤버로 가입합니다.",
)
def join_group(member_in: GroupJoin):
    with Session(engine) as session:
        # 존재하지 않는 유저 검사
        user = session.exec(select(User).where(User.id == member_in.user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="존재하지 않는 유저입니다.")

        # 그룹 존재 여부
        group = session.exec(
            select(Group).where(Group.id == member_in.group_id)
        ).first()
        if not group:
            raise HTTPException(status_code=404, detail="존재하지 않는 모임입니다.")

        # 중복 가입 검사
        existing = session.exec(
            select(Member).where(
                (Member.user_id == member_in.user_id)
                & (Member.group_id == member_in.group_id)
            )
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="이미 가입한 모임입니다.")

        # ✅ 가입 처리
        member = Member(**member_in.dict())
        session.add(member)
        session.commit()
        return {"message": "모임에 가입되었습니다"}


@router.delete(
    "/members",
    summary="모임 탈퇴",
    description="사용자가 특정 모임에서 탈퇴합니다.",
)
def leave_group(data: GroupLeave):
    with Session(engine) as session:
        member = session.exec(
            select(Member).where(
                (Member.user_id == data.user_id) & (Member.group_id == data.group_id)
            )
        ).first()

        if not member:
            raise HTTPException(status_code=404, detail="가입된 모임이 없습니다.")

        session.delete(member)
        session.commit()
        return {"message": "모임에서 탈퇴되었습니다"}


@router.get(
    "/{group_id}/members",
    summary="특정 모임 멤버 조회",
    description="특정 그룹에 소속된 멤버들의 목록을 조회합니다.",
)
def get_group_members(group_id: int):
    with Session(engine) as session:
        results = session.exec(select(Member).where(Member.group_id == group_id)).all()
        return results


@router.get(
    "/{group_id}/members/id",
    response_model=List[int],
    summary="특정 모임 멤버 ID 목록 조회",
)
def get_group_member_ids(group_id: int, session: Session = Depends(get_session)):
    stmt = select(Member).where(Member.group_id == group_id)
    members = session.execute(stmt).scalars().all()
    if not members:
        raise HTTPException(404, detail="해당 그룹에 멤버가 없습니다.")
    # user_id만 뽑아서 반환
    return [m.user_id for m in members]
