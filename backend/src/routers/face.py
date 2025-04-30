from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlmodel import Session, select
from src.core.database import get_session
from src.services.face.service import create_face_video
from src.services.face.processor import process_video_and_save_encodings
from src.schemas.face import FaceVideoRead
from src.models.face import FaceEncoding

router = APIRouter(prefix="/faces", tags=["Faces"])


@router.post(
    "/video",
    response_model=FaceVideoRead,
    summary="사용자 얼굴 등록용 영상 업로드",
    description="사용자의 얼굴 영상을 업로드하여 저장하고, 추후 분석 처리에 활용합니다.",
    status_code=status.HTTP_201_CREATED,
)
async def upload_face_video(
    user_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    # 1. 영상 저장 + DB 기록
    face_video = create_face_video(session, user_id, file)

    # 2. 얼굴 벡터 추출 및 저장
    results = process_video_and_save_encodings(session, face_video)

    # 3. 벡터 정보 다시 로딩해서 붙이기 (ORM 자동 대응)
    face_video.embeddings = session.exec(
        select(FaceEncoding).where(FaceEncoding.video_id == face_video.id)
    ).all()

    if not results:
        raise HTTPException(400, detail="등록 가능한 얼굴이 감지되지 않았습니다.")

    return face_video
