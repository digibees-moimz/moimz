from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
    status,
    BackgroundTasks,
)
from sqlmodel import Session, select
from src.core.database import get_session
from src.services.face.service import create_face_video
from src.services.face.processor import process_video_and_save_encodings
from src.schemas.face import FaceVideoRead, VideoStatusResponse
from src.models.face import FaceVideo

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
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    # 1. 영상 저장 + DB 기록
    face_video = create_face_video(session, user_id, file)

    # 2. 얼굴 벡터 추출 및 저장 (백그라운드에서 비동기 처리)
    background_tasks.add_task(
        process_video_and_save_encodings,
        face_video.id,
    )

    return face_video


@router.get(
    "/video/{video_id}/status",
    response_model=VideoStatusResponse,
    summary="영상 처리 상태 조회",
    description="'processing' 또는 'done' 상태를 반환합니다.",
)
def get_video_status(video_id: int, session: Session = Depends(get_session)):
    face_video = session.get(FaceVideo, video_id)
    if not face_video:
        raise HTTPException(status_code=404, detail="영상 정보를 찾을 수 없습니다.")

    return {"video_id": video_id, "status": face_video.status}


@router.get(
    "/video/{video_id}",
    response_model=FaceVideoRead,
    summary="얼굴 등록 데이터 조회",
)
def get_face_video(video_id: int, session: Session = Depends(get_session)):
    face_video = session.get(FaceVideo, video_id)
    if not face_video:
        raise HTTPException(status_code=404, detail="영상 정보를 찾을 수 없습니다.")

    return face_video
