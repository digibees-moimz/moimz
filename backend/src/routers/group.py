from fastapi import APIRouter
from sqlmodel import Session, select
from src.core.database import engine
from src.models.group import Group, Member
from src.schemas.group import GroupCreate, GroupRead, MemberCreate

router = APIRouter()

@router.post("/groups", response_model=GroupRead)
def create_group(group_in: GroupCreate):
    with Session(engine) as session:
        group = Group(**group_in.dict())
        session.add(group)
        session.commit()
        session.refresh(group)
        return group

@router.get("/groups", response_model=list[GroupRead])
def get_groups():
    with Session(engine) as session:
        return session.exec(select(Group)).all()

@router.post("/members")
def join_group(member_in: MemberCreate):
    with Session(engine) as session:
        member = Member(**member_in.dict())
        session.add(member)
        session.commit()
        return {"message": "모임에 가입되었습니다"}

@router.get("/groups/{group_id}/members")
def get_group_members(group_id: int):
    with Session(engine) as session:
        results = session.exec(select(Member).where(Member.group_id == group_id)).all()
        return results
