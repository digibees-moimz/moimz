# backend/src/services/face.py
import os
import uuid
from fastapi import UploadFile
from sqlmodel import Session
from datetime import datetime, timezone

from src.models.face import FaceVideo
from src.constants import BASE_DIR

# 저장 위치
VIDEO_ROOT = os.path.join(BASE_DIR, "src", "data", "users", "faces", "raw")


# 1. 영상 저장 + DB 기록
def create_face_video(session: Session, user_id: int, file: UploadFile) -> FaceVideo:
    os.makedirs(VIDEO_ROOT, exist_ok=True)

    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    video_path = os.path.join(VIDEO_ROOT, unique_name)

    with open(video_path, "wb") as f:
        f.write(file.file.read())

    # 상대 경로만 저장 (클라이언트용)
    relative_path = os.path.relpath(video_path, BASE_DIR)

    face_video = FaceVideo(
        user_id=user_id,
        video_path=relative_path,
        frame_dir="",  # 추출 후 업데이트 가능
        vector_dir="",  # 증강/벡터 후 업데이트 가능
        created_at=datetime.now(timezone.utc),
    )

    session.add(face_video)
    session.commit()
    session.refresh(face_video)
    return face_video
