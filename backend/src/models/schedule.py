# src/models/schedule.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Schedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")  # 그룹 연결
    user_id: int = Field(foreign_key="user.id")  # 추가
    title: str                     # 모임 제목 (ex: 강남 BBQ)
    date: datetime                 # 모임 일시
    location: Optional[str] = None # 장소
    is_done: bool = False          # 완료 여부
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
