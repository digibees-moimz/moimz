import uuid
import os
from datetime import datetime
from src.constants import ALBUM_DIR


def generate_unique_filename(original_filename: str) -> str:
    ext = os.path.splitext(original_filename)[-1]
    uid = uuid.uuid4().hex[:8]
    date = datetime.now().strftime("%Y%m%d")
    return f"{date}_{uid}{ext}"


# 파일 저장용 절대경로 반환
def get_group_photo_path(group_id: int, filename: str) -> str:
    return os.path.join(ALBUM_DIR, str(group_id), "photos", filename)


# DB 저장용 상대경로 반환
def get_group_photo_relpath(group_id: int, filename: str) -> str:
    return f"groups/{group_id}/photos/{filename}"
