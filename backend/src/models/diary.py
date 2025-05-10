# src/models/diary.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime


class Diary(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: int = Field(foreign_key="user.id")
    schedule_id: Optional[int] = Field(default=None, foreign_key="schedule.id")
    attendance_id: Optional[int] = Field(
        default=None, foreign_key="attendancerecord.id"
    )

    diary_text: str
    image_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # 양방향 관계 설정
    group: Optional["Group"] = Relationship(back_populates="diaries")
    user: Optional["User"] = Relationship(back_populates="diaries")
