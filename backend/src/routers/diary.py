# src/routers/diary.py

from fastapi import APIRouter, status, Depends, HTTPException
from sqlmodel import Session, select
import traceback
from src.models.diary import Diary
from src.schemas.diary import DiaryCreate, DiaryRead
from src.core.database import engine, get_session
from src.services.diary.service import (
    get_attendees_from_attendance,
    auto_generate_diary,
)


router = APIRouter(prefix="/diaries", tags=["Diary"])


@router.post(
    "",
    response_model=DiaryRead,
    status_code=status.HTTP_201_CREATED,
    summary="일기 저장",
    description="AI가 생성한 모임 일기를 저장합니다.",
)
def save_diary(data: DiaryCreate):
    with Session(engine) as session:
        diary = Diary(**data.dict())
        session.add(diary)
        session.commit()
        session.refresh(diary)
        return diary


@router.post(
    "/auto-generate",
    response_model=DiaryRead,
    summary="AI 자동 생성 일기",
    description="일정과 출석 정보를 기반으로 Claude를 사용해 일기를 자동 생성합니다.",
)
def generate_diary_auto(
    group_id: int,
    schedule_id: int,
    attendance_id: int,
    user_id: int,
    session: Session = Depends(get_session),
):
    try:
        diary = auto_generate_diary(
            session=session,
            group_id=group_id,
            attendance_id=attendance_id,
            schedule_id=schedule_id,
            user_id=user_id,
        )
        attendees = get_attendees_from_attendance(session, attendance_id)
        return DiaryRead(**diary.dict(), attendees=attendees)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))


@router.get(
    "/group/{group_id}",
    response_model=list[DiaryRead],
    summary="해당 모임 일기 목록 조회",
    description="특정 그룹의 모든 AI 모임 일기 목록을 조회합니다.",
)
def get_group_diaries(group_id: int):
    with Session(engine) as session:
        diaries = (
            session.execute(select(Diary).where(Diary.group_id == group_id))
            .scalars()
            .all()
        )
        result = []
        for diary in diaries:
            attendees = []
            if diary.attendance_id:
                attendees = get_attendees_from_attendance(session, diary.attendance_id)

            result.append(DiaryRead(**diary.dict(), attendees=attendees))

        return result
