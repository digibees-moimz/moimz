from fastapi import APIRouter, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.group import Group, Member
from src.schemas.group import GroupCreate, GroupRead, MemberCreate
from src.models.group_account import GroupAccount

router = APIRouter(prefix="/groups", tags=["Groups"])

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
        group_account = GroupAccount(group_id=new_group.id, balance=0)
        session.add(group_account)
        session.commit()

        return {
            "id": new_group.id,
            "name": new_group.name,
            "category": new_group.category,
            "description": new_group.description,
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

@router.post(
    "/members",
    summary="모임 가입",
    description="사용자가 특정 모임에 멤버로 가입합니다.",
)
def join_group(member_in: MemberCreate):
    with Session(engine) as session:
        member = Member(**member_in.dict())
        session.add(member)
        session.commit()
        return {"message": "모임에 가입되었습니다"}

@router.get(
    "/{group_id}/members",
    summary="특정 모임 멤버 조회",
    description="특정 그룹에 소속된 멤버들의 목록을 조회합니다.",
)
def get_group_members(group_id: int):
    with Session(engine) as session:
        results = session.exec(select(Member).where(Member.group_id == group_id)).all()
        return results
