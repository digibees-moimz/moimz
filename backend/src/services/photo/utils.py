import uuid, os, cv2
import shutil
from datetime import datetime
from src.constants import ALBUM_DIR, BASE_DIR


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


def crop_square_face(image, bbox, margin_ratio=0.4, output_size=256):
    top, right, bottom, left = bbox
    h, w = bottom - top, right - left
    cx, cy = (left + right) // 2, (top + bottom) // 2

    # 가장 긴 쪽 기준 정사각형 사이즈 계산 (마진 포함)
    side = int(max(w, h) * (1 + margin_ratio))

    # 정사각형 영역 좌표 계산
    x1 = max(0, cx - side // 2)
    y1 = max(0, cy - side // 2)
    x2 = min(image.shape[1], cx + side // 2)
    y2 = min(image.shape[0], cy + side // 2)

    # 잘라내고 resize
    cropped = image[y1:y2, x1:x2]
    resized = cv2.resize(
        cropped, (output_size, output_size), interpolation=cv2.INTER_AREA
    )
    return resized


def delete_merged_files(group_id: int, person_id: int):
    # 썸네일 삭제
    thumb_path = os.path.join(
        ALBUM_DIR, str(group_id), "thumbnails", f"{person_id}.jpg"
    )
    if os.path.exists(thumb_path):
        os.remove(thumb_path)

    # 클러스터 디렉토리 삭제
    face_dir = os.path.join(BASE_DIR, "media", "users", "faces", str(person_id))
    if os.path.exists(face_dir):
        shutil.rmtree(face_dir)
