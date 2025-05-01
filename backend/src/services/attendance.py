# backend/src/services/attendance.py
import time
from typing import List, Dict, Any

import cv2
import numpy as np
from fastapi import UploadFile, HTTPException

from src.services.user.clustering_state import face_db
from src.services.face.engine import face_engine
from src.constants import MATCH_THRESHOLD_ATTENDANCE


async def run_attendance_check(file: UploadFile) -> Dict[str, Any]:
    start = time.time()

    # 1) 이미지 로드
    img_bytes = await file.read()
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

    # 2) 얼굴 감지 및 임베딩 추출
    faces = face_engine.get_faces(img)
    if not faces:
        raise HTTPException(status_code=400, detail="사진에서 얼굴을 찾을 수 없습니다.")

    unknowns = [face_engine.get_embedding(f) for f in faces] if faces else []

    all_matches: List[Dict[str, Any]] = []

    # 3) user_id별로 centroids → closest cluster 선택 → 멤버 비교
    for uid, unk in enumerate(unknowns):
        for user_id, data in face_db.items():
            clusters = data.get("clusters")
            raw = data.get("raw", [])

            # 1차: centroids 비교
            if clusters and clusters.get("centroids"):
                cents = np.array(clusters["centroids"])
                sims = [face_engine.cosine_similarity(c, unk) for c in cents]
                best_i = int(np.argmax(sims))
                if sims[best_i] < MATCH_THRESHOLD_ATTENDANCE:
                    continue

                labels = clusters["labels"]
                candidates = [raw[i] for i, lab in enumerate(labels) if lab == best_i]
            else:
                candidates = raw

            # 2차: 실제 유사도 계산
            for known in candidates:
                sim = face_engine.cosine_similarity(known, unk)
                all_matches.append(
                    {
                        "unknown_id": uid,
                        "user_id": user_id,
                        "similarity": sim,
                    }
                )

    # 4) 유사도 순 정렬 및 중복 제거
    all_matches.sort(key=lambda x: x["similarity"], reverse=True)
    seen_users, seen_faces = set(), set()
    attendees = []

    for m in all_matches:
        if m["similarity"] < MATCH_THRESHOLD_ATTENDANCE:
            break
        if m["user_id"] in seen_users or m["unknown_id"] in seen_faces:
            continue
        seen_users.add(m["user_id"])
        seen_faces.add(m["unknown_id"])
        attendees.append(
            {
                "user_id": m["user_id"],
                "similarity": float(m["similarity"]),
            }
        )

    duration = round(time.time() - start, 3)
    return {
        "attendees": attendees,
        "count": len(attendees),
        "duration": duration,
    }
