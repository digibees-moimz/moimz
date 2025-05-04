# src/routers/attendance.py

import os
from fastapi import APIRouter, UploadFile, HTTPException, File, Query, Depends
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from src.core.database import get_session
from src.schemas.attendance import (
    AttendanceResponse,
    ManualAttendanceRequest,
    ManualAttendanceResponse,
    AttendanceCompleteRequest,
    AttendanceRecordRead,
    AttendanceUpdateRequest,
)
from src.services.attendance.services import (
    run_photo_attendance,
    run_manual_attendance,
    save_attendance,
    get_attendance_record,
    update_attendance,
    generate_qr_for_attendance,
)

from src.constants import BASE_DIR

QR_DIR = os.path.join(BASE_DIR, "media", "qrcodes")
os.makedirs(QR_DIR, exist_ok=True)

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
    return await run_photo_attendance(file, group_id)


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


@router.post(
    "/manual",
    response_model=ManualAttendanceResponse,
    summary="수동 출석체크",
)
def manual_attendance(
    data: ManualAttendanceRequest,
    session: Session = Depends(get_session),
):
    return run_manual_attendance(session, data)


@router.post(
    "/complete",
    summary="참석자 명단 DB 저장",
)
def complete_attendance(
    dto: AttendanceCompleteRequest,
    session: Session = Depends(get_session),
):
    attendance_id = save_attendance(session, dto)
    return {"attendance_id": attendance_id}


@router.get(
    "/{attendance_id}",
    response_model=AttendanceRecordRead,
    summary="출석 완료 정보 조회",
)
def read_attendance_record(
    attendance_id: int,
    session: Session = Depends(get_session),
):
    return get_attendance_record(session, attendance_id)


@router.put(
    "/{attendance_id}",
    response_model=ManualAttendanceResponse,
    summary="출석 명단 수정 및 요약 반환",
)
def update_attendance_route(
    attendance_id: int,
    dto: AttendanceUpdateRequest,
    session: Session = Depends(get_session),
):
    record = update_attendance(session, attendance_id, dto.user_ids)
    return get_attendance_record(session, record.id)


@router.post(
    "/attendance/{attendance_id}/qr",
    summary="출석 정보 기반 QR 코드 생성",
    description="출석 완료(attendance_id 기준) 정보를 바탕으로 QR 코드 토큰을 생성하고, URL을 반환합니다.",
)
def create_qr_for_attendance(
    attendance_id: int,
    session: Session = Depends(get_session),
):
    token = generate_qr_for_attendance(session, attendance_id)
    return {
        "attendance_id": attendance_id,
        "qr_token": token,
        "qr_url": f"/api/attendance/qrcode/{token}",  # QR 이미지 접근용
    }


@router.get(
    "/qr/image/{token}",
    summary="QR 이미지 조회",
    responses={200: {"content": {"image/png": {}}}},
)
def get_qr_image(token: str):
    qr_path = os.path.join(QR_DIR, f"{token}.png")
    if not os.path.exists(qr_path):
        raise HTTPException(404, "QR 이미지가 존재하지 않습니다.")
    return StreamingResponse(open(qr_path, "rb"), media_type="image/png")
