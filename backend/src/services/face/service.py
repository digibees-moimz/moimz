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
    # 1) UUID로 영상 파일명 결정
    ext = file.filename.split(".")[-1]
    vid_uuid = uuid.uuid4().hex
    unique_name = f"{vid_uuid}.{ext}"
    video_path = os.path.join(VIDEO_ROOT, unique_name)

    with open(video_path, "wb") as f:
        f.write(file.file.read())

    # 2) 프레임·벡터 저장용 디렉토리 생성
    base_rel = os.path.join("media", "users", "faces", str(user_id), vid_uuid)
    frame_dir = os.path.join(BASE_DIR, base_rel, "frames")
    vector_dir = os.path.join(BASE_DIR, base_rel, "vectors")
    os.makedirs(frame_dir, exist_ok=True)
    os.makedirs(vector_dir, exist_ok=True)

    face_video = FaceVideo(
        user_id=user_id,
        video_path=os.path.relpath(video_path, BASE_DIR),
        frame_dir=os.path.relpath(frame_dir, BASE_DIR),
        vector_dir=os.path.relpath(vector_dir, BASE_DIR),
        created_at=datetime.now(timezone.utc),
    )

    session.add(face_video)
    session.commit()
    session.refresh(face_video)
    return face_video


# 2. 저장된 영상에서 프레임 추출 → 벡터 추출 → DB 저장
def register_face_video(video_id: int):
    return process_video_and_save_encodings(video_id)
