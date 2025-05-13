# src/routers/schedule_image.py

import os
import shutil
from datetime import datetime
from uuid import uuid4
from typing import List

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlmodel import Session

from src.core.database import get_session
from src.models.schedule import Schedule, ScheduleImage
from src.schemas.schedule import ScheduleImageRead

router = APIRouter(prefix="/schedule-images", tags=["ScheduleImages"])

UPLOAD_DIR = "media/schedules"

@router.post(
    "",
    response_model=List[ScheduleImageRead],  # 여러 개 반환
    summary="스케줄 이미지 다중 업로드"
)
def upload_schedule_images(
    schedule_id: int = Form(...),
    files: List[UploadFile] = File(...),  # ✅ List로 받기
    session: Session = Depends(get_session),
):
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="해당 스케줄이 존재하지 않습니다.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    saved_images = []

    for file in files:
        ext = os.path.splitext(file.filename)[-1]
        filename = f"{schedule_id}_{uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        image = ScheduleImage(
            schedule_id=schedule_id,
            image_url=f"/files/schedules/{filename}",
        )
        session.add(image)
        saved_images.append(image)

    session.commit()
    return [ScheduleImageRead.model_validate(img) for img in saved_images]