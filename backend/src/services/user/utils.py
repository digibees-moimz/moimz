import os
import pickle
from typing import List
from sqlalchemy.orm import Session
from sqlmodel import select

from src.constants import BASE_DIR
from src.models.face import FaceVideo


def load_user_raw_vectors(user_id: int, session: Session) -> List[List[float]]:
    # 1) 처리 완료된 영상 목록 조회
    stmt = select(FaceVideo).where(
        FaceVideo.user_id == user_id, FaceVideo.status == "done"
    )
    videos = session.execute(stmt).scalars().all()

    all_vecs = []
    for fv in videos:
        vec_dir = os.path.join(BASE_DIR, fv.vector_dir)
        # 모든 .pkl 파일 로드
        for fn in os.listdir(vec_dir):
            if not fn.endswith(".pkl"):
                continue
            path = os.path.join(vec_dir, fn)
            with open(path, "rb") as f:
                data = pickle.load(f)

            if isinstance(data, list):
                for arr in data:
                    all_vecs.append(arr.tolist())
            else:
                all_vecs.append(data.tolist())

    return all_vecs
