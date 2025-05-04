# backend/src/models/attendance.py
from sqlmodel import SQLModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy import JSON, Column


class AttendanceRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(..., description="출석이 발생한 그룹 ID")
    attendee_user_ids: List[int] = Field(default_factory=list, sa_column=Column(JSON))
    check_type: str = Field(..., description="출석 체크 방식 (photo/manual)")
    created_at: datetime = Field(default_factory=datetime.utcnow)
