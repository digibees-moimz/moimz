# backend/src/routers/attendance.py
from fastapi import APIRouter, UploadFile, File
from src.schemas.attendance import AttendanceResponse
from src.services.attendance import run_attendance_check

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post(
    "/photo",
    response_model=AttendanceResponse,
    summary="사진 기반 출석체크",
)
async def check_attendance(file: UploadFile = File(...)):
    return await run_attendance_check(file)
