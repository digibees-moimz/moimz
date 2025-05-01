# backend/src/routers/attendance.py
from fastapi import APIRouter, UploadFile, File, Query
from src.schemas.attendance import AttendanceResponse
from src.services.attendance import run_attendance_check

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
