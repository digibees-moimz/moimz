from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    title: str
    description: Optional[str] = None
    event_datetime: datetime
    location: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
