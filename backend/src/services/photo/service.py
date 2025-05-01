import os
import cv2
import pickle
import numpy as np
from sqlmodel import Session, select
from typing import List
from src.models.photo import Photo, Face, FaceRepresentative, Face
from src.services.face.engine import face_engine  # 얼굴 탐지 + 임베딩
from src.constants import BASE_DIR


MIN_FACE_WIDTH = 60
MIN_FACE_HEIGHT = 60
RECENT_FACE_LIMIT = 20  # 최근 N개의 벡터로 대표 벡터 계산
MATCH_THRESHOLD = 0.45  # 유사도 임계값 (이보다 낮으면 새로운 인물로 간주)


def is_face_large_enough(bbox) -> bool:
    x1, y1, x2, y2 = bbox
    return (x2 - x1) >= MIN_FACE_WIDTH and (y2 - y1) >= MIN_FACE_HEIGHT


def process_faces_for_photo(photo_id: int) -> int:
    with Session() as session:
        photo = session.get(Photo, photo_id)
        if not photo:
            return 0

        # 이미지 로드
        abs_path = os.path.join(
            BASE_DIR, "media", photo.file_name
        )  # 상대경로 → 절대경로
        img = cv2.imread(abs_path)
        if img is None:
            return 0

        # 얼굴 탐지
        faces = face_engine.get_faces(img)
        saved_count = 0

        for face in faces:
            bbox = list(map(int, face.bbox))  # [x1, y1, x2, y2]
            embedding = face_engine.get_embedding(face)
            too_small = not is_face_large_enough(bbox)

            top, right, bottom, left = bbox[1], bbox[2], bbox[3], bbox[0]
            location = [top, right, bottom, left]

            user_id = find_most_similar_user(session, embedding)

            face_obj = Face(
                photo_id=photo_id,
                location=location,
                user_id=user_id,  # 초기에는 unknown
                encoding=pickle.dumps(embedding),
                too_small=too_small,
            )
            session.add(face_obj)
            saved_count += 1

        photo.face_processed = True
        session.add(photo)
        session.commit()

        return saved_count


# 대표 벡터 갱신 함수 (최근 N개의 벡터를 평균)
def update_face_representative(session: Session, user_id: int):
    faces = session.exec(
        select(Face)
        .where(Face.user_id == user_id)
        .order_by(Face.id.desc())
        .limit(RECENT_FACE_LIMIT)
    ).all()

    if not faces:
        return False

    vectors = []
    for face in faces:
        try:
            vec = pickle.loads(face.encoding)
            if vec.shape == (512,):
                vectors.append(vec)
        except Exception as e:
            print(f"[Warning] Encoding decode failed: {e}")
            continue

    if not vectors:
        return False

    # medoid 방식으로 대표 벡터 지정
    mat = np.vstack(vectors)
    dists = np.linalg.norm(mat[:, None] - mat, axis=2)
    medoid_idx = np.argmin(np.sum(dists, axis=1))
    rep_vec = mat[medoid_idx]

    # 저장 (없으면 새로, 있으면 덮어쓰기)
    existing = session.get(FaceRepresentative, user_id)
    if not existing:
        rep = FaceRepresentative(user_id=user_id, vector=pickle.dumps(rep_vec))
        session.add(rep)
    else:
        existing.vector = pickle.dumps(rep_vec)
        session.add(existing)

    session.commit()
    return True


# 대표 벡터들과 유사도 비교하여 가장 유사한 user_id 반환
def find_most_similar_user(session: Session, embedding: np.ndarray) -> int:
    reps = session.exec(select(FaceRepresentative)).all()

    best_user_id = 0
    best_sim = -1.0

    for rep in reps:
        try:
            vec = pickle.loads(rep.vector)
            sim = face_engine.cosine_similarity(vec, embedding)
            if sim > best_sim:
                best_sim = sim
                best_user_id = rep.user_id
        except:
            continue

    if best_sim >= MATCH_THRESHOLD:
        return best_user_id
    return 0  # unknown
