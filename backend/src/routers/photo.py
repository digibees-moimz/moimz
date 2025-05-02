# backend/src/routers/photo.py
import os, cv2
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlmodel import Session, select
from src.constants import BASE_DIR
from src.core.database import engine
from src.models.photo import Photo, Face
from src.schemas.photo import PhotoRead
from src.services.photo.service import process_faces_for_photo, assign_new_person_ids
from src.services.photo.utils import (
    generate_unique_filename,
    get_group_photo_path,
    get_group_photo_relpath,
)

router = APIRouter(prefix="/photos", tags=["Photos"])


@router.post(
    "",
    response_model=dict[str, list[PhotoRead]],
    summary="사진 업로드",
    description="사진 파일을 업로드하고 group_id 및 user_id와 함께 DB에 메타데이터를 저장합니다.",
)
def upload_photo(
    files: list[UploadFile] = File(...),
    group_id: int = Form(...),
    user_id: int = Form(None),
):
    uploaded_photos = []

    with Session(engine) as session:
        for file in files:
            unique_name = generate_unique_filename(file.filename)
            abs_path = get_group_photo_path(group_id, unique_name)
            rel_path = get_group_photo_relpath(group_id, unique_name)

            os.makedirs(os.path.dirname(abs_path), exist_ok=True)

            # 절대 경로
            with open(abs_path, "wb") as f:
                f.write(file.file.read())

            photo = Photo(
                group_id=group_id,
                user_id=user_id,  # 업로드한 사람의 ID
                file_name=rel_path,  # 상대 경로
                face_processed=False,
            )
            session.add(photo)
            session.commit()
            session.refresh(photo)

            # 얼굴 자동 분석
            process_faces_for_photo(session, photo.id)
            uploaded_photos.append(PhotoRead.from_orm(photo))

        # 마지막에 한 번만 실행
        assign_new_person_ids(session)  # 얼굴 감지 후, 미분류 얼굴 분류

    return {"uploaded": uploaded_photos}


@router.get(
    "/groups/{group_id}",
    summary="그룹 사진 목록 조회",
    description="특정 그룹의 사진 목록을 조회합니다.",
)
def get_group_photos(group_id: int):
    with Session(engine) as session:
        photos = session.exec(select(Photo).where(Photo.group_id == group_id)).all()
        return photos


@router.get(
    "/groups/{group_id}/persons",
    summary="그룹의 인물별 앨범 목록 조회 (썸네일 포함)",
    description="특정 그룹의 인물별 사진 목록을 조회합니다.",
)
def get_persons_in_group(group_id: int):
    with Session(engine) as session:
        # 이 그룹의 모든 person_id 추출
        stmt = (
            select(Face.person_id)
            .join(Photo, Photo.id == Face.photo_id)
            .where(Photo.group_id == group_id, Face.person_id != 0)  # 미분류 제외
            .distinct()
        )

        person_ids = session.exec(stmt).all()  # -> List[int]

        return {
            "group_id": group_id,
            "persons": [
                {
                    "person_id": person_id,
                    "thumbnail_url": f"/api/photos/groups/{group_id}/thumbnails/{person_id}",
                }
                for person_id in person_ids
            ],
        }


@router.get(
    "/groups/{group_id}/persons/{person_id}",
    summary="특정 인물의 얼굴 사진 조회",
    description="특정 그룹의 인물별 사진 목록을 조회합니다.",
)
def get_faces_by_person(group_id: int, person_id: int):
    with Session(engine) as session:
        stmt = (
            select(Face, Photo)
            .join(Photo, Photo.id == Face.photo_id)
            .where(Photo.group_id == group_id, Face.person_id == person_id)
        )
        results = session.exec(stmt).all()

        faces = []
        for face, photo in results:
            faces.append(
                {
                    "face_id": face.id,
                    "photo_id": photo.id,
                    "location": face.location,
                    "image_url": f"/files/{photo.file_name}",
                }
            )

        return {
            "group_id": group_id,
            "person_id": person_id,
            "count": len(faces),
            "faces": faces,
        }


@router.get(
    "/groups/{group_id}/thumbnails/{person_id}",
    summary="인물별 얼굴 크롭 썸네일 반환",
    description="인물별 앨범의 썸네일(인물 얼굴 크롭)을 반환합니다.",
)
def get_face_thumbnail(person_id: int, group_id: int):
    thumb_path = os.path.join(
        BASE_DIR, "media", "groups", f"{group_id}", "thumbnails", f"{person_id}.jpg"
    )
    os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

    # 이미 썸네일이 존재하면 바로 반환 (캐싱)
    if os.path.exists(thumb_path):
        return FileResponse(thumb_path)

    # 없으면 새로 생성
    with Session(engine) as session:
        # 최근 얼굴 하나 기준으로 crop
        face = session.exec(
            select(Face).where(Face.person_id == person_id).order_by(Face.id.desc())
        ).first()
        if not face:
            return

        photo = session.get(Photo, face.photo_id)
        if not photo:
            return

        abs_path = os.path.join(BASE_DIR, "media", photo.file_name)
        if not os.path.exists(abs_path):
            return

        top, right, bottom, left = face.location
        image = cv2.imread(abs_path)
        height, width, _ = image.shape

        # 확장 비율
        margin = 0.4  # 20% 확장

        h = bottom - top
        w = right - left

        expand_top = max(0, int(top - h * margin))
        expand_bottom = min(height, int(bottom + h * margin))
        expand_left = max(0, int(left - w * margin))
        expand_right = min(width, int(right + w * margin))

        cropped = image[expand_top:expand_bottom, expand_left:expand_right]

        # 썸네일 저장
        cv2.imwrite(thumb_path, cropped)
        return FileResponse(thumb_path)
