from fastapi import APIRouter, UploadFile, File, Form
from sqlmodel import Session
from src.core.database import engine
from src.models.photo import Photo

router = APIRouter(prefix="/photos", tags=["Photos"])

@router.post(
    "",
    summary="사진 업로드드",
    description="사진 파일을 업로드하고 group_id 및 user_id와 함께 DB에 메타데이터를 저장합니다.",
)
def upload_photo(file: UploadFile = File(...), group_id: int = Form(...), user_id: int = Form(None)):
    file_path = f"static/uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    with Session(engine) as session:
        photo = Photo(
            group_id=group_id,
            user_id=user_id,
            file_name=file.filename,
            face_processed=False,
        )
        session.add(photo)
        session.commit()
        session.refresh(photo)
        return photo

@router.get(
    "/groups/{group_id}",
    summary="그룹의 사진 목록 조회회",
    description="특정 그룹의 사진 목록을 조회합니다.",
)
def get_group_photos(group_id: int):
    with Session(engine) as session:
        photos = session.exec(
            select(Photo).where(Photo.group_id == group_id)
        ).all()
        return photos
