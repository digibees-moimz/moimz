# src/models/diary.py

from sqlalchemy import Text
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
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

    title: str = Field(sa_column=Column(Text))  # 길이 제한 없도록
    diary_text: str = Field(sa_column=Column(Text))  # 긴 본문 처리
    summary: Optional[str] = Field(default=None, sa_column=Column(Text))  # 요약도 안전하게
    hashtags: Optional[str] = Field(default=None, sa_column=Column(Text))  # 해시태그도 여유롭게

    image_path: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # 양방향 관계 설정
    group: Optional["Group"] = Relationship(back_populates="diaries")
    user: Optional["User"] = Relationship(back_populates="diaries")
    schedule: Optional["Schedule"] = Relationship(
        back_populates="diary",
        sa_relationship_kwargs={"foreign_keys": "Diary.schedule_id"}
    )