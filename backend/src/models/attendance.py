# backend/src/models/attendance.py
from sqlmodel import SQLModel, Field
from typing import List, Optional
from datetime import datetime
from sqlalchemy import JSON, Column


class AttendanceRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(..., description="출석이 발생한 그룹 ID")
    schedule_id: Optional[int] = Field(
        default=None,
        foreign_key="schedule.id",
    ) # 일정 종료 시 함께 종료되도록 연결
    attendee_user_ids: List[int] = Field(default_factory=list, sa_column=Column(JSON))
    check_type: str = Field(..., description="출석체크 방식 (photo/manual)")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # QR 코드 관련 필드
    qrcode_token: Optional[str] = Field(default=None, description="QR 고유 토큰")
    qrcode_created_at: Optional[datetime] = Field(
        default=None, description="QR 생성 시간"
    )
    qrcode_used: bool = Field(default=False, description="QR 사용 여부")
    is_closed: bool = Field(
        default=False, description="출석 세션 종료 여부 (QR 재생성 차단용)"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
