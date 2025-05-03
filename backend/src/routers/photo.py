# src/routers/photo.py

import os, cv2, pickle, numpy as np
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session, select, delete
from sqlalchemy import func
from src.constants import BASE_DIR
from src.core.database import engine
from src.services.face.engine import face_engine
from src.models.photo import Photo, Face, FaceRepresentative, PersonInfo
from src.schemas.photo import PhotoRead
from src.services.photo.service import process_faces_for_photo, assign_new_person_ids
from src.services.photo.utils import (
    generate_unique_filename,
    get_group_photo_path,
    get_group_photo_relpath,
    crop_square_face,
    delete_merged_files,
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
            process_faces_for_photo(session, group_id, photo.id)
            uploaded_photos.append(PhotoRead.from_orm(photo))

        # 마지막에 한 번만 실행
        assign_new_person_ids(session, group_id)  # 얼굴 감지 후, 미분류 얼굴 분류

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
            .group_by(Face.person_id)
            .having(func.count(Face.id) >= 5)
        )

        person_ids = session.exec(stmt).all()  # -> List[int]
        persons = []
        for person_id in person_ids:
            info = session.get(PersonInfo, (group_id, person_id))
            persons.append(
                {
                    "person_id": person_id,
                    "name": info.name if info else "",
                    "thumbnail_url": f"/api/photos/groups/{group_id}/thumbnails/{person_id}",
                }
            )

        return {"group_id": group_id, "persons": persons}


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

        seen_photo_ids = set()
        filtered_faces = []

        for face, photo in results:
            # 같은 사진 중복 제거
            if photo.id in seen_photo_ids:
                continue
            seen_photo_ids.add(photo.id)
            filtered_faces.append(
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
            "count": len(filtered_faces),
            "faces": filtered_faces,
        }


@router.get(
    "/groups/{group_id}/thumbnails/{person_id}",
    summary="인물별  대표벡터 기반 썸네일 반환",
    description="대표 벡터와 가장 유사한 얼굴을 기준으로 썸네일을 생성합니다.",
)
def get_face_thumbnail(person_id: int, group_id: int):
    thumb_path = os.path.join(
        BASE_DIR, "media", "groups", str(group_id), "thumbnails", f"{person_id}.jpg"
    )
    fallback_path = os.path.join(BASE_DIR, "media", "static", "default-thumbnail.png")
    os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

    # 이미 썸네일이 존재하면 바로 반환 (캐싱)
    if os.path.exists(thumb_path):
        return FileResponse(thumb_path, media_type="image/jpeg")

    # 없으면 새로 생성
    with Session(engine) as session:
        valid = session.exec(
            select(Face)
            .join(Photo, Photo.id == Face.photo_id)
            .where(Face.person_id == person_id, Photo.group_id == group_id)
        ).first()

        if not valid:
            return

        # 대표 벡터 기반 유사 얼굴 탐색
        rep = session.get(FaceRepresentative, (group_id, person_id))
        photo = None
        top = right = bottom = left = None

        if rep:
            rep_vec = pickle.loads(rep.vector)

            # 해당 person_id의 얼굴들 조회
            faces = session.exec(
                select(Face)
                .join(Photo, Face.photo_id == Photo.id)
                .where(Face.person_id == person_id, Photo.group_id == group_id)
            ).all()

            best_face = None
            best_sim = -1.0

            # 가장 유사한 얼굴 찾기
            for face in faces:
                try:
                    vec = pickle.loads(face.encoding)
                    sim = face_engine.cosine_similarity(rep_vec, vec)
                    if sim > best_sim:
                        best_sim = sim
                        best_face = face
                except Exception:
                    continue

            if not best_face:
                return FileResponse(fallback_path, media_type="image/png")

            photo = session.get(Photo, best_face.photo_id)
            if not photo:
                return FileResponse(fallback_path, media_type="image/png")

            top, right, bottom, left = best_face.location

        else:
            # 최근 얼굴
            face = session.exec(
                select(Face)
                .join(Photo, Face.photo_id == Photo.id)
                .where(Face.person_id == person_id, Photo.group_id == group_id)
                .order_by(Face.id.desc())
            ).first()

            if not face:
                return FileResponse(fallback_path, media_type="image/png")

            photo = session.get(Photo, face.photo_id)
            if not photo:
                return FileResponse(fallback_path, media_type="image/png")

            top, right, bottom, left = face.location

        abs_path = os.path.join(BASE_DIR, "media", photo.file_name)
        if not os.path.exists(abs_path):
            return FileResponse(fallback_path, media_type="image/png")

        image = cv2.imread(abs_path)

        cropped = crop_square_face(image, [top, right, bottom, left])

        cv2.imwrite(thumb_path, cropped)

        return FileResponse(thumb_path)


@router.patch("/groups/{group_id}/persons/{person_id}/name", summary="인물 이름 변경")
def update_person_name(group_id: int, person_id: int, new_name: str = Form(...)):
    with Session(engine) as session:
        info = session.get(PersonInfo, (group_id, person_id))
        if not info:
            info = PersonInfo(person_id=person_id, group_id=group_id, name=new_name)
        else:
            info.name = new_name
        session.add(info)
        session.commit()
        return {
            "message": "이름이 변경되었습니다",
            "group_id": group_id,
            "person_id": person_id,
            "name": info.name,
        }


@router.post(
    "/groups/{group_id}/merge",
    summary="인물 병합",
    description="인물별 앨범을 2개 선택하여 병합합니다.",
)
def merge_persons(
    group_id: int, person_id_1: int = Query(...), person_id_2: int = Query(...)
):
    if person_id_1 == person_id_2:
        raise HTTPException(400, detail="같은 person_id는 병합할 수 없습니다.")

    with Session(engine) as session:
        # 우선순위 판단
        def is_registered(pid):
            return pid < 1000

        info1 = session.get(PersonInfo, (person_id_1, group_id))
        info2 = session.get(PersonInfo, (person_id_2, group_id))

        if is_registered(person_id_1) and not is_registered(person_id_2):
            target, source = person_id_1, person_id_2
        elif is_registered(person_id_2) and not is_registered(person_id_1):
            target, source = person_id_2, person_id_1
        elif info1 and info1.name and not (info2 and info2.name):
            target, source = person_id_1, person_id_2
        elif info2 and info2.name and not (info1 and info1.name):
            target, source = person_id_2, person_id_1
        else:
            target, source = person_id_1, person_id_2

        # Face.person_id 갱신
        faces = session.exec(
            select(Face)
            .join(Photo)
            .where(Photo.group_id == group_id, Face.person_id == source)
        ).all()
        for face in faces:
            face.person_id = target
            session.add(face)

        # 대표 벡터 병합
        rep_target = session.get(FaceRepresentative, (group_id, target))
        rep_source = session.get(FaceRepresentative, (group_id, source))

        vecs = []
        if rep_target:
            vecs.append(pickle.loads(rep_target.vector))
        if rep_source:
            vecs.append(pickle.loads(rep_source.vector))

        if vecs:
            new_rep = np.mean(vecs, axis=0)
            if not rep_target:
                rep_target = FaceRepresentative(
                    group_id=group_id, person_id=target, vector=pickle.dumps(new_rep)
                )
                session.add(rep_target)
            else:
                rep_target.vector = pickle.dumps(new_rep)
                session.add(rep_target)

        # 병합 대상 썸네일 및 클러스터 파일 삭제
        delete_merged_files(group_id, source)

        # 병합 대상 DB 삭제
        session.exec(
            delete(FaceRepresentative).where(
                FaceRepresentative.group_id == group_id,
                FaceRepresentative.person_id == source,
            )
        )
        session.exec(
            delete(PersonInfo).where(
                PersonInfo.group_id == group_id, PersonInfo.person_id == source
            )
        )

        session.commit()

    return {"message": f"{source} → {target} 병합 완료", "final_person_id": target}
