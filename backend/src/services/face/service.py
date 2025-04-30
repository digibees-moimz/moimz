import os
import uuid

from fastapi import UploadFile
from sqlmodel import Session
from datetime import datetime, timezone

from src.constants import BASE_DIR
from src.models.face import FaceVideo
from .processor import process_video_and_save_encodings

# 저장 위치
VIDEO_ROOT = os.path.join(BASE_DIR, "media", "users", "faces", "raw")
os.makedirs(VIDEO_ROOT, exist_ok=True)


# 1. 영상 저장 + DB 기록
def create_face_video(session: Session, user_id: int, file: UploadFile) -> FaceVideo:
    ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    video_path = os.path.join(VIDEO_ROOT, unique_name)

    with open(video_path, "wb") as f:
        f.write(file.file.read())

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


# 2. 저장된 영상에서 프레임 추출 → 벡터 추출 → DB 저장
def register_face_video(session: Session, face_video: FaceVideo):
    return process_video_and_save_encodings(session, face_video)
