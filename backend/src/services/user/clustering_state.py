from typing import Dict, Any

# 사용자별 raw·cluster 상태를 메모리에 저장할 전역 dict
face_db: Dict[int, Dict[str, Any]] = {}
