# src/routers/diary.py

from fastapi import APIRouter, status
from src.models.diary import Diary
from src.schemas.diary import DiaryCreate, DiaryRead
from sqlmodel import Session, select
from src.core.database import engine

router = APIRouter(prefix="/diaries", tags=["Diary"])

@router.post(
    "",
    response_model=DiaryRead,
    status_code=status.HTTP_201_CREATED,
    summary="일기 저장장",
    description="AI가 생성한 모임 일기를 저장합니다.",
)
def save_diary(data: DiaryCreate):
    with Session(engine) as session:
        diary = Diary(**data.dict())
        session.add(diary)
        session.commit()
        session.refresh(diary)
        return diary

@router.get(
    "/group/{group_id}",
    response_model=list[DiaryRead],
    summary="해당 모임 일기 목록 조회",
    description="특정 그룹의 모든 AI 모임 일기 목록을 조회합니다.",
)
def get_group_diaries(group_id: int):
    with Session(engine) as session:
        diaries = session.execute(
            select(Diary).where(Diary.group_id == group_id)
        ).scalars().all()
        return diaries
