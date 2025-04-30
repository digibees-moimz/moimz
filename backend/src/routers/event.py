from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.schemas.event import EventCreate, EventRead
from src.models.event import Event  # 서비스 대신 직접 사용

router = APIRouter(prefix="/events", tags=["Events"])

@router.post(
    "",
    response_model=EventRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create Event",
    description="새로운 모임 일정을 생성합니다.",
)
def create_event_api(event_data: EventCreate):
    with Session(engine) as session:
        new_event = Event(**event_data.dict())
        session.add(new_event)
        session.commit()
        session.refresh(new_event)
        return new_event

@router.get(
    "/group/{group_id}",
    response_model=list[EventRead],
    summary="Get Group Events",
    description="특정 그룹에 속한 모든 일정 목록을 조회합니다.",
)
def get_events_api(group_id: int):
    with Session(engine) as session:
        events = session.exec(
            select(Event).where(Event.group_id == group_id)
        ).all()
        return events

@router.patch(
    "/{event_id}",
    response_model=EventRead,
    summary="Update Event",
    description="지정한 ID의 일정을 수정합니다. 수정할 필드만 전달하면 부분 업데이트가 가능합니다.",
)
def update_event_api(event_id: int, update_data: dict):
    with Session(engine) as session:
        event = session.get(Event, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        for key, value in update_data.items():
            setattr(event, key, value)
        session.commit()
        session.refresh(event)
        return event

@router.delete(
    "/{event_id}",
    summary="Delete Event",
    description="지정한 ID의 일정을 삭제합니다.",
)
def delete_event_api(event_id: int):
    with Session(engine) as session:
        event = session.get(Event, event_id)
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        session.delete(event)
        session.commit()
        return {"ok": True}
