# src/routers/attendance.py

from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import StreamingResponse
import os

from src.schemas.attendance import AttendanceResponse
from src.services.attendance.services import run_attendance_check
from src.constants import BASE_DIR

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post(
    "/photo",
    response_model=AttendanceResponse,
    summary="사진 기반 출석체크",
)
async def check_attendance(
    file: UploadFile = File(...),
    group_id: int = Query(..., description="출석 체크 대상 그룹 ID"),
):
    return await run_attendance_check(file, group_id)


@router.get(
    "/photo/{check_id}",
    summary="출석 체크 결과 이미지 조회",
    responses={200: {"content": {"image/png": {}}}},
)
def get_attendance_image(check_id: str):
    img_path = os.path.join(BASE_DIR, "media", "attendance", f"{check_id}.png")
    if not os.path.exists(img_path):
        raise HTTPException(404, detail="이미지 정보를 찾을 수 없습니다.")
    return StreamingResponse(open(img_path, "rb"), media_type="image/png")
