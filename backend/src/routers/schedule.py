# src/routers/schedule.py
from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from src.core.database import get_session
from src.models.schedule import Schedule
from src.schemas.schedule import ScheduleCreate, ScheduleRead, ScheduleUpdate

router = APIRouter(prefix="/schedules", tags=["Schedules"])

def get_schedule_or_404(session: Session, schedule_id: int) -> Schedule:
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        raise HTTPException(404, detail="일정이 존재하지 않습니다.")
    return schedule

@router.post(
    "",
    response_model=ScheduleRead,
    status_code=status.HTTP_201_CREATED,
    summary="일정 생성",
    description="모임 일정을 생성합니다.",
)
def create_schedule(schedule_in: ScheduleCreate, session: Session = Depends(get_session)):
    schedule = Schedule(**schedule_in.dict())
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return schedule

@router.get(
    "/group/{group_id}",
    response_model=list[ScheduleRead],
    summary="해당 그룹 모든 일정 조회",
    description="특정 그룹의 모든 모임 일정을 조회합니다.",
)
def get_schedules_by_group(group_id: int, session: Session = Depends(get_session)):
    return session.execute(select(Schedule).where(Schedule.group_id == group_id)).scalars().all()

@router.get(
    "/{schedule_id}",
    response_model=ScheduleRead,
    summary="단일 일정 상세 조회",
    description="단일 모임 일정의 상세 정보를 조회합니다.",
)
def get_schedule(schedule_id: int, session: Session = Depends(get_session)):
    return get_schedule_or_404(session, schedule_id)

@router.patch(
    "/{schedule_id}",
    response_model=ScheduleRead,
    summary="일정 수정",
    description="모임 일정의 정보를 수정합니다.",
)
def update_schedule(schedule_id: int, schedule_in: ScheduleUpdate, session: Session = Depends(get_session)):
    schedule = get_schedule_or_404(session, schedule_id)
    for k, v in schedule_in.dict(exclude_unset=True).items():
        setattr(schedule, k, v)
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return schedule

@router.delete(
    "/{schedule_id}",
    summary="일정 삭제",
    description="모임 일정을 삭제합니다.",
)
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = get_schedule_or_404(session, schedule_id)
    session.delete(schedule)
    session.commit()
    return {"message": "일정이 삭제되었습니다."}

@router.patch(
    "/{schedule_id}/done",
    status_code=status.HTTP_200_OK,
    summary="일정 완료 처리",
    description="특정 일정을 완료 상태로 표시합니다.",
)
def mark_schedule_done(schedule_id: int, session: Session = Depends(get_session)):
    schedule = get_schedule_or_404(session, schedule_id)
    schedule.is_done = True
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return {"message": "일정을 완료 처리했습니다.", "schedule_id": schedule.id}
