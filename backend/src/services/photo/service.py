import os
import cv2
import pickle
import numpy as np
from sqlmodel import Session, select
from typing import List
from src.models.photo import Photo, Face
from src.services.face.engine import face_engine  # 얼굴 탐지 + 임베딩
from src.constants import ALBUM_DIR, BASE_DIR


MIN_FACE_WIDTH = 60
MIN_FACE_HEIGHT = 60


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

            face_obj = Face(
                photo_id=photo_id,
                location=location,
                user_id=0,  # 초기에는 unknown
                encoding=pickle.dumps(embedding),
                too_small=too_small,
            )
            session.add(face_obj)
            saved_count += 1

        photo.face_processed = True
        session.add(photo)
        session.commit()

        return saved_count
