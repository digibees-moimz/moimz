from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class FaceVideoCreate(BaseModel):
    video_path: str
    frame_dir: str
    vector_dir: str


# 각 얼굴 벡터 단위 정보
class FaceEncodingRead(BaseModel):
    id: int
    embedding: bytes  # raw 벡터 데이터 (직렬화된 numpy)
    created_at: datetime

    class Config:
        orm_mode = True


# 영상 + 벡터 정보 응답
class FaceVideoRead(BaseModel):
    id: int
    user_id: int
    video_path: str
    frame_dir: str
    vector_dir: str
    created_at: datetime
    embeddings: Optional[List[FaceEncodingRead]] = []

    class Config:
        orm_mode = True
