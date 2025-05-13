import os
import cv2
import pickle
import numpy as np
from sqlmodel import Session, select
from src.core.database import engine
from src.models.photo import Photo, Face, FaceRepresentative, PersonInfo
from src.models.user import User
from src.services.face.engine import face_engine  # 얼굴 탐지 + 임베딩
from src.constants import BASE_DIR
from src.services.photo.utils import (
    generate_unique_filename,
    get_group_photo_path,
    get_group_photo_relpath,
)


MIN_FACE_WIDTH = 60
MIN_FACE_HEIGHT = 60
RECENT_FACE_LIMIT = 20  # 최근 N개의 벡터로 대표 벡터 계산
MATCH_THRESHOLD = 0.45  # 유사도 임계값 (이보다 낮으면 새로운 인물로 간주)


def is_face_large_enough(bbox) -> bool:
    x1, y1, x2, y2 = bbox
    return (x2 - x1) >= MIN_FACE_WIDTH and (y2 - y1) >= MIN_FACE_HEIGHT


def process_faces_for_photo(session: Session, group_id: int, photo_id: int) -> int:
    photo = session.get(Photo, photo_id)
    if not photo:
        return 0

    # 이미지 로드
    abs_path = os.path.join(BASE_DIR, "media", photo.file_name)  # 상대경로 → 절대경로
    img = cv2.imread(abs_path)
    if img is None:
        return 0

    # 얼굴 탐지
    faces = face_engine.get_faces(img)
    saved_count = 0

    # 대표 벡터 갱신 대상
    updated_person_ids = set()

    for face in faces:
        bbox = list(map(int, face.bbox))  # [x1, y1, x2, y2]
        embedding = face_engine.get_embedding(face)
        too_small = not is_face_large_enough(bbox)

        top, right, bottom, left = bbox[1], bbox[2], bbox[3], bbox[0]
        location = [top, right, bottom, left]

        person_id = classify_face(session, photo.group_id, embedding)

        face_obj = Face(
            photo_id=photo_id,
            location=location,
            person_id=person_id,  # 초기에는 unknown
            encoding=pickle.dumps(embedding),
            too_small=too_small,
        )
        session.add(face_obj)
        saved_count += 1

        # 기존 인물이라면 대표 벡터 갱신 대상에 추가
        if person_id != 0:
            updated_person_ids.add(person_id)

    photo.face_processed = True
    session.add(photo)
    session.commit()

    # 대표 벡터 갱신
    for person_id in updated_person_ids:
        update_face_representative(session, group_id, person_id)

    return saved_count


# 대표 벡터 갱신 함수 (최근 N개의 벡터를 평균)
def update_face_representative(session: Session, group_id: int, person_id: int):
    faces = (
        session.execute(
            select(Face)
            .join(Photo, Photo.id == Face.photo_id)
            .where(Face.person_id == person_id, Photo.group_id == group_id)
            .order_by(Face.id.desc())
            .limit(RECENT_FACE_LIMIT)
        )
        .scalars()
        .all()
    )

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
    existing = session.get(FaceRepresentative, (group_id, person_id))
    if not existing:
        rep = FaceRepresentative(
            group_id=group_id, person_id=person_id, vector=pickle.dumps(rep_vec)
        )
        session.add(rep)
    else:
        existing.vector = pickle.dumps(rep_vec)
        session.add(existing)

    session.commit()
    return True


# 새 얼굴 벡터와 대표 벡터들을 비교하여 가장 유사한 person_id를 반환
def classify_face(
    session: Session,
    group_id: int,
    embedding: np.ndarray,
    threshold: float = MATCH_THRESHOLD,
) -> int:
    reps = (
        session.execute(
            select(FaceRepresentative).where(FaceRepresentative.group_id == group_id)
        )
        .scalars()
        .all()
    )

    best_person_id = 0
    best_sim = -1.0

    for rep in reps:
        try:
            rep_vec = pickle.loads(rep.vector)
            sim = face_engine.cosine_similarity(rep_vec, embedding)
            if sim > best_sim:
                best_sim = sim
                best_person_id = rep.person_id
        except:
            continue

    print(f"[Matching] group={group_id}, user={best_person_id}, sim={best_sim:.4f}")

    if best_sim >= threshold:
        return best_person_id
    return 0  # unknown


# 새로운 person_id 부여 및 대표 벡터 생성
def assign_new_person_ids(session: Session, group_id: int):
    with Session(engine) as session:
        unknown_faces = (
            session.execute(select(Face).where(Face.person_id == 0)).scalars().all()
        )

        if not unknown_faces:
            print("✅ 미분류 얼굴 없음")
            return 0

        embeddings = []
        face_refs = []
        for face in unknown_faces:
            try:
                vec = pickle.loads(face.encoding)
                embeddings.append(vec)
                face_refs.append(face)
            except:
                continue

        if not embeddings:
            return 0

        assigned = [False] * len(embeddings)

        # 등록 사용자와 비교하여 person_id 우선 반영
        for user in session.execute(select(User)).scalars().all():
            try:
                cluster_dir = f"{BASE_DIR}/media/users/faces/{user.id}"
                if not os.path.exists(cluster_dir):
                    continue

                for subdir in os.listdir(cluster_dir):
                    centroids_path = os.path.join(
                        cluster_dir, subdir, "clusters", "centroids.pkl"
                    )
                    if not os.path.exists(centroids_path):
                        continue

                    with open(centroids_path, "rb") as f:
                        centroids = pickle.load(f)
                    if not centroids:
                        continue

                # 첫 번째 중심값 사용
                rep_vec = np.array(centroids[0], dtype=np.float32)

                exists = session.get(FaceRepresentative, (group_id, user.id))
                if not exists:
                    session.add(
                        FaceRepresentative(
                            group_id=group_id,
                            person_id=user.id,
                            vector=pickle.dumps(rep_vec),
                        )
                    )
                    session.add(
                        PersonInfo(
                            group_id=group_id,
                            person_id=user.id,
                            user_id=user.id,
                            name=user.name,
                        )
                    )

                # 등록 사용자와 유사한 얼굴이 있으면 person_id로 할당
                for idx, vec in enumerate(embeddings):
                    if assigned[idx]:
                        continue
                    sim = face_engine.cosine_similarity(rep_vec, vec)
                    if sim >= MATCH_THRESHOLD:
                        face_refs[idx].person_id = user.id
                        assigned[idx] = True

            except Exception as e:
                print(f"[등록 사용자 {user.id}] 실패: {e}")

        # next_person_id 계산 (1000부터 시작)
        existing_ids = (
            session.execute(
                select(FaceRepresentative.person_id).where(
                    FaceRepresentative.group_id == group_id
                )
            )
            .scalars()
            .all()
        )
        flattened_ids = [p[0] if isinstance(p, tuple) else p for p in existing_ids]
        auto_ids = [pid for pid in flattened_ids if pid >= 1000]
        next_person_id = max(auto_ids) + 1 if auto_ids else 1000

        count_new = 0

        for i in range(len(embeddings)):
            if assigned[i]:
                continue

            face_refs[i].person_id = next_person_id
            assigned[i] = True
            group = [embeddings[i]]

            for j in range(i + 1, len(embeddings)):
                if assigned[j]:
                    continue
                sim = face_engine.cosine_similarity(embeddings[i], embeddings[j])
                if sim >= MATCH_THRESHOLD:
                    face_refs[j].person_id = next_person_id
                    assigned[j] = True
                    group.append(embeddings[j])

            # 대표 벡터 생성
            mat = np.vstack(group)
            dists = np.linalg.norm(mat[:, None] - mat, axis=2)
            medoid_idx = np.argmin(np.sum(dists, axis=1))
            rep_vec = mat[medoid_idx]

            session.add(
                FaceRepresentative(
                    group_id=group_id,
                    person_id=next_person_id,
                    vector=pickle.dumps(rep_vec),
                )
            )
            session.add(
                PersonInfo(
                    person_id=next_person_id,
                    group_id=group_id,
                    name="",
                )
            )

            next_person_id += 1
            count_new += 1

        session.commit()
        print(f"🎉 새 인물 {count_new}명 분류 완료")
        return count_new


# 앨범에 저장
def save_uploaded_photo_to_album(
    session: Session, img_bytes: bytes, group_id: int
) -> Photo:
    unique_name = generate_unique_filename("photo.jpg")
    abs_path = get_group_photo_path(group_id, unique_name)
    rel_path = get_group_photo_relpath(group_id, unique_name)

    os.makedirs(os.path.dirname(abs_path), exist_ok=True)

    with open(abs_path, "wb") as f:
        f.write(img_bytes)

    photo = Photo(
        group_id=group_id,
        user_id=None,
        file_name=rel_path,
        face_processed=False,
    )
    session.add(photo)
    session.commit()
    session.refresh(photo)

    # 얼굴 분석
    process_faces_for_photo(session, group_id, photo.id)
    return photo
