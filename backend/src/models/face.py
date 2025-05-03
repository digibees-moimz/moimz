# src/models/face.py

from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional, List


class FaceVideo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    video_path: str  # 원본 영상 경로
    frame_dir: str  # 프레임 저장 경로
    vector_dir: str  # 벡터 파일 저장 경로
    status: str = "processing"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    embeddings: List["FaceEncoding"] = Relationship(back_populates="video")


class FaceEncoding(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    video_id: int = Field(foreign_key="facevideo.id")
    embedding: bytes  # numpy ndarray → bytes 직렬화
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    video: Optional[FaceVideo] = Relationship(back_populates="embeddings")
