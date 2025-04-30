from sqlmodel import Session, select
from src.models.event import Event
from src.schemas.event import EventCreate

def create_event(db: Session, event_data: EventCreate) -> Event:
    new_event = Event(**event_data.dict())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

def get_group_events(db: Session, group_id: int):
    return db.exec(select(Event).where(Event.group_id == group_id)).all()

def update_event(db: Session, event_id: int, update_data: dict):
    event = db.get(Event, event_id)
    if event:
        for key, value in update_data.items():
            setattr(event, key, value)
        db.commit()
        db.refresh(event)
    return event

def delete_event(db: Session, event_id: int):
    event = db.get(Event, event_id)
    if event:
        db.delete(event)
        db.commit()
    return event
