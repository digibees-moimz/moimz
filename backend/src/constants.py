import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 그룹별 사진 저장 루트
ALBUM_DIR = os.path.join(BASE_DIR, "media", "groups")
os.makedirs(ALBUM_DIR, exist_ok=True)

# threshold 값
MATCH_THRESHOLD_ALBUM = 0.45
MATCH_THRESHOLD_ATTENDANCE = 0.43
