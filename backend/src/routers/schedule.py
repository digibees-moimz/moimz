from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.schedule import Schedule
from src.schemas.schedule import ScheduleCreate, ScheduleRead, ScheduleUpdate

router = APIRouter(prefix="/schedules", tags=["Schedules"])

@router.post(
    "",
    response_model=ScheduleRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create Schedule",
    description="모임 일정을 생성합니다."
)
def create_schedule(schedule_in: ScheduleCreate):
    with Session(engine) as session:
        schedule = Schedule(**schedule_in.dict())
        session.add(schedule)
        session.commit()
        session.refresh(schedule)
        return schedule

@router.get(
    "/group/{group_id}",
    response_model=list[ScheduleRead],
    summary="Get Group Schedules",
    description="특정 그룹의 모든 모임 일정을 조회합니다."
)
def get_schedules_by_group(group_id: int):
    with Session(engine) as session:
        schedules = session.exec(select(Schedule).where(Schedule.group_id == group_id)).all()
        return schedules

@router.get(
    "/{schedule_id}",
    response_model=ScheduleRead,
    summary="Get Schedule Detail",
    description="단일 모임 일정의 상세 정보를 조회합니다."
)
def get_schedule(schedule_id: int):
    with Session(engine) as session:
        schedule = session.get(Schedule, schedule_id)
        if not schedule:
            raise HTTPException(404, detail="일정이 존재하지 않습니다.")
        return schedule

@router.patch(
    "/{schedule_id}",
    response_model=ScheduleRead,
    summary="Update Schedule",
    description="모임 일정의 정보를 수정합니다."
)
def update_schedule(schedule_id: int, schedule_in: ScheduleUpdate):
    with Session(engine) as session:
        schedule = session.get(Schedule, schedule_id)
        if not schedule:
            raise HTTPException(404, detail="일정이 존재하지 않습니다.")

        update_data = schedule_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(schedule, key, value)

        session.add(schedule)
        session.commit()
        session.refresh(schedule)
        return schedule

@router.delete(
    "/{schedule_id}",
    summary="Delete Schedule",
    description="모임 일정을 삭제합니다."
)
def delete_schedule(schedule_id: int):
    with Session(engine) as session:
        schedule = session.get(Schedule, schedule_id)
        if not schedule:
            raise HTTPException(404, detail="일정이 존재하지 않습니다.")

        session.delete(schedule)
        session.commit()
        return {"message": "일정이 삭제되었습니다."}