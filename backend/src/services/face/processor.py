import os
import pickle
from datetime import datetime, timezone
from sqlmodel import Session

from src.constants import BASE_DIR
from src.models.face import FaceEncoding, FaceVideo
from .engine import face_engine
from .utils import extract_frames_from_video, augment_image


# 저장된 영상에서 프레임 추출 → 벡터 추출 → DB 저장
def process_video_and_save_encodings(
    session: Session, face_video: FaceVideo
) -> list[FaceEncoding]:
    full_path = os.path.join(BASE_DIR, face_video.video_path)
    with open(full_path, "rb") as f:
        video_bytes = f.read()

    # 프레임 추출
    frames = extract_frames_from_video(video_bytes)
    if not frames:
        return []

    results = []

    # 데이터 증강 및 벡터 추출
    for frame in frames:
        for img in augment_image(frame):
            faces = face_engine.get_faces(img)
            if len(faces) == 1:
                emb = face_engine.get_embedding(faces[0])
                encoding = FaceEncoding(
                    video_id=face_video.id,
                    embedding=pickle.dumps(emb),
                    created_at=datetime.now(timezone.utc),
                )
                session.add(encoding)
                results.append(encoding)

    session.commit()
    return results
