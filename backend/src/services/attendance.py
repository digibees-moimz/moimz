# backend/src/services/attendance.py
import os, uuid, time, cv2, numpy as np
from typing import List, Dict, Any

from fastapi import UploadFile, HTTPException
from sqlmodel import select
from sqlalchemy.orm import Session

from src.services.user.clustering_state import face_db
from src.services.face.engine import face_engine
from src.constants import BASE_DIR, MATCH_THRESHOLD_ATTENDANCE
from src.models.group import Member
from src.core.database import engine


ATTEND_DIR = os.path.join(BASE_DIR, "media", "attendance")
os.makedirs(ATTEND_DIR, exist_ok=True)


async def run_attendance_check(file: UploadFile, group_id: int) -> Dict[str, Any]:
    start = time.time()

    # 1) 그룹 멤버 user_id 조회
    with Session(engine) as session:
        stmt = select(Member).where(Member.group_id == group_id)
        members = session.execute(stmt).scalars().all()
    if not members:
        raise HTTPException(404, f"그룹 {group_id}에 멤버가 없습니다.")
    group_user_ids = {m.user_id for m in members}

    # 2) 이미지 로드
    img_bytes = await file.read()
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

    # 3) 얼굴 감지 및 임베딩 추출
    faces = face_engine.get_faces(img)
    if not faces:
        raise HTTPException(status_code=400, detail="사진에서 얼굴을 찾을 수 없습니다.")

    unknowns = [face_engine.get_embedding(f) for f in faces] if faces else []

    all_matches: List[Dict[str, Any]] = []

    # 4) 그룹 멤버만 순회
    for uid, unk in enumerate(unknowns):
        for user_id in group_user_ids:
            data = face_db.get(user_id)
            print("사용자 : ", user_id)
            if not data:
                continue  # 등록 영상이 아직 없으면 건너뛰기

            clusters = data.get("clusters")
            raw = data.get("raw", [])

            # 1차: centroids 비교
            if clusters and clusters.get("centroids"):
                cents = np.array(clusters["centroids"])
                sims = [face_engine.cosine_similarity(c, unk) for c in cents]
                best = int(np.argmax(sims))
                if sims[best] < MATCH_THRESHOLD_ATTENDANCE:
                    continue

                labels = clusters["labels"]
                candidates = [raw[i] for i, lab in enumerate(labels) if lab == best]
            else:
                candidates = raw

            # 2차: 후보 벡터와 정밀 비교
            for known in candidates:
                sim = face_engine.cosine_similarity(known, unk)
                all_matches.append(
                    {
                        "unknown_id": uid,
                        "user_id": user_id,
                        "similarity": sim,
                    }
                )

    # 5) 유사도 순 정렬 및 중복 제거
    all_matches.sort(key=lambda x: x["similarity"], reverse=True)
    seen_users, seen_faces = set(), set()
    attendees = []
    recognition_map: dict[int, int] = {}

    for m in all_matches:
        if m["similarity"] < MATCH_THRESHOLD_ATTENDANCE:
            break
        if m["user_id"] in seen_users or m["unknown_id"] in seen_faces:
            continue
        seen_users.add(m["user_id"])
        seen_faces.add(m["unknown_id"])

        # 1) attendees 리스트 채우기
        attendees.append(
            {
                "user_id": m["user_id"],
                "similarity": float(m["similarity"]),
            }
        )
        # 2) recognition_map 에도 기록
        recognition_map[m["unknown_id"]] = m["user_id"]

    duration = round(time.time() - start, 3)

    # 6) 이미지에 박스·레이블 그리기
    for idx, face in enumerate(faces):
        x1, y1, x2, y2 = map(int, face.bbox)
        # recognition_map 에서 꺼내기
        recognized = recognition_map.get(idx)

        # 출석자로 체크되었으면 초록, 아니면 빨강
        color = (0, 255, 0) if recognized else (0, 0, 255)
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
        label = str(recognized) if recognized else "Unknown"
        cv2.putText(img, label, (x1, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # 7) 파일로 저장하고 URL 생성
    check_id = uuid.uuid4().hex
    out_path = os.path.join(ATTEND_DIR, f"{check_id}.png")
    cv2.imwrite(out_path, img)

    return {
        "attendees": attendees,
        "count": len(attendees),
        "duration": duration,
        "image_url": f"/api/attendance/photo/{check_id}",
    }
