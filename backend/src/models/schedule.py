# src/models/schedule.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Schedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: int = Field(foreign_key="user.id")
    title: str
    date: datetime
    location: Optional[str] = None
    is_done: bool = False
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # 양방향 관계 설정
    comments: List["ScheduleComment"] = Relationship(back_populates="schedule")
    group: Optional["Group"] = Relationship(back_populates="schedules")
    user: Optional["User"] = Relationship(back_populates="schedules")

class ScheduleComment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_id: int = Field(foreign_key="schedule.id")
    user_id: int = Field(foreign_key="user.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # 양방향 관계 설정
    schedule: Optional["Schedule"] = Relationship(back_populates="comments")
    user: Optional["User"] = Relationship(back_populates="schedule_comments")