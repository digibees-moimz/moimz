from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Photo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    user_id: Optional[int] = Field(default=None, foreign_key="useraccount.id")  # 업로드한 사용자
    file_name: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    face_processed: bool = False  # 얼굴 분류 완료 여부 얼굴 분석 로직 적용되면 True로 바뀜

