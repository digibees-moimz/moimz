import os
import pickle
from datetime import datetime, timezone
from sqlmodel import Session

from src.constants import BASE_DIR
from src.models.face import FaceEncoding, FaceVideo
from .engine import face_engine
from src.core.database import engine
from .utils import extract_frames_from_video, augment_image


# 저장된 영상에서 프레임 추출 → 벡터 추출 → DB 저장
def process_video_and_save_encodings(video_id: int) -> list[FaceEncoding]:
    results: list[FaceEncoding] = []

    # 1) 세션을 열고 모든 DB 작업을 이 안에서!
    with Session(engine) as session:
        # 얼굴 영상 메타 조회
        face_video = session.get(FaceVideo, video_id)
        if not face_video:
            return results

        # 2) 벡터 저장 디렉토리 준비
        vector_root = os.path.join(BASE_DIR, face_video.vector_dir)
        os.makedirs(vector_root, exist_ok=True)

        # 3) 프레임 추출
        video_bytes = open(os.path.join(BASE_DIR, face_video.video_path), "rb").read()
        frames = extract_frames_from_video(video_bytes, interval=10)

        # 4) 데이터 증강
        for frame in frames:
            for img in augment_image(frame):
                faces = face_engine.get_faces(img)
                if len(faces) != 1:
                    continue

                # 5) embedding 생성
                emb_arr = face_engine.get_embedding(faces[0])
                pickled = pickle.dumps(emb_arr)

                # 6) DB에 저장
                enc = FaceEncoding(
                    user_id=face_video.user_id,
                    video_id=face_video.id,
                    embedding=pickled,
                    created_at=datetime.now(timezone.utc),
                )
                session.add(enc)
                session.flush()  # enc.id 할당
                results.append(enc)

                # 7) 파일로도 저장
                file_path = os.path.join(vector_root, f"{enc.id}.pkl")
                with open(file_path, "wb") as f:
                    f.write(pickled)

        # 8) 모든 임베딩 커밋 & 상태 업데이트
        session.commit()
        face_video.status = "done"
        session.add(face_video)
        session.commit()

    return results
