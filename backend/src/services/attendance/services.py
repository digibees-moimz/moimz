# backend/src/services/attendance/services.py
import os, uuid, time, cv2, pickle
import numpy as np
from typing import Dict, Any

from fastapi import UploadFile, HTTPException
from PIL import Image, ImageDraw, ImageFont
from sqlmodel import select
from sqlmodel import Session

from src.services.face.engine import face_engine
from src.constants import BASE_DIR, MATCH_THRESHOLD_ATTENDANCE
from src.models.group import Member
from src.models.user import User, UserAccount
from src.core.database import engine
from src.routers._helpers import locked_amounts_by_accounts


ATTEND_DIR = os.path.join(BASE_DIR, "media", "attendance")
os.makedirs(ATTEND_DIR, exist_ok=True)


def get_latest_cluster_dir(user_id: int) -> str:
    base_dir = os.path.join(BASE_DIR, "media", "users", "faces", str(user_id))
    if not os.path.exists(base_dir):
        return ""
    video_dirs = sorted(os.listdir(base_dir), reverse=True)
    for vid in video_dirs:
        cluster_dir = os.path.join(base_dir, vid, "clusters")
        if os.path.exists(os.path.join(cluster_dir, "centroids.pkl")):
            return cluster_dir
    return ""


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
            raise HTTPException(
                status_code=400, detail="사진에서 얼굴을 찾을 수 없습니다."
            )

        unknowns = [face_engine.get_embedding(f) for f in faces]

        # 4) 그룹 멤버만 순회
        all_matches = []
        for uid, unk in enumerate(unknowns):
            for user_id in group_user_ids:
                cluster_dir = get_latest_cluster_dir(user_id)
                print("사용자 : ", user_id)
                if not cluster_dir:
                    continue  # 등록 영상이 아직 없으면 건너뛰기

                # centroid 로드
                try:
                    with open(os.path.join(cluster_dir, "centroids.pkl"), "rb") as f:
                        centroids = pickle.load(f)
                except:
                    continue

                best_sim = -1
                best_idx = -1

                # 1차: centroids 비교
                for i, centroid in enumerate(centroids):
                    sim = face_engine.cosine_similarity(centroid, unk)
                    if sim > best_sim:
                        best_sim = sim
                        best_idx = i

                if best_sim < MATCH_THRESHOLD_ATTENDANCE:
                    continue

                # 2차: 후보 벡터와 정밀 비교
                cluster_file = os.path.join(cluster_dir, f"cluster_{best_idx}.pkl")
                if not os.path.exists(cluster_file):
                    continue

                with open(cluster_file, "rb") as f:
                    candidates = pickle.load(f)

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
        recognition_map: dict[int, int] = {}

        for m in all_matches:
            if m["similarity"] < MATCH_THRESHOLD_ATTENDANCE:
                break
            if m["user_id"] in seen_users or m["unknown_id"] in seen_faces:
                continue
            seen_users.add(m["user_id"])
            seen_faces.add(m["unknown_id"])
            recognition_map[m["unknown_id"]] = m["user_id"]

        # 이름, 계좌, 락인 정보 조회
        stmt = select(User.id, User.name).where(User.id.in_(seen_users))
        name_map = dict(session.exec(stmt).all())

        stmt = select(UserAccount.user_id, UserAccount.id).where(
            UserAccount.user_id.in_(seen_users)
        )
        user_account_map = dict(session.exec(stmt).all())

        locked_map = locked_amounts_by_accounts(  # 락인 집계 helper 사용
            session,
            user_account_ids=list(user_account_map.values()),
            group_account_id=group_id,
        )

        # 응답 attendees
        attendees = []
        for m in all_matches:
            uid = m["user_id"]
            if uid not in seen_users:
                continue
            seen_users.remove(uid)  # 중복 방지
            account_id = user_account_map.get(uid)
            attendees.append(
                {
                    "user_id": uid,
                    "name": name_map.get(uid, "이름 없음"),
                    "locked_amount": locked_map.get(account_id, 0.0),
                    "similarity": round(m["similarity"], 4),
                }
            )
        duration = round(time.time() - start, 3)

        # 총 결제 가능 금액 계산
        total_available_amount = sum(att["locked_amount"] for att in attendees)

        # 6) 이미지에 박스·레이블 그리기
        # OpenCV → PIL 변환
        img_pil = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(img_pil)

        # 한글 폰트 설정
        FONT_PATH = os.path.join(BASE_DIR, "fonts", "Pretendard-SemiBold.otf")
        font = ImageFont.truetype(FONT_PATH, size=36)

        for idx, face in enumerate(faces):
            x1, y1, x2, y2 = map(int, face.bbox)
            uid = recognition_map.get(idx)
            label = name_map.get(uid) or "알 수 없음"

            # 출석자로 체크되었으면 초록, 아니면 빨강
            color = (0, 255, 0) if uid else (0, 0, 255)
            fill_color = tuple(c // 1 for c in color[::-1])
            draw.rectangle([x1, y1, x2, y2], outline=fill_color, width=4)
            draw.text((x1, y1 - 40), label, font=font, fill=color[::-1])

        # PIL → OpenCV 되돌리기
        img = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

        # 7) 파일로 저장하고 URL 생성
        check_id = uuid.uuid4().hex
        out_path = os.path.join(ATTEND_DIR, f"{check_id}.png")
        cv2.imwrite(out_path, img)

        return {
            "attendees": attendees,
            "count": len(attendees),
            "total_available_amount": total_available_amount,
            "duration": duration,
            "image_url": f"/api/attendance/photo/{check_id}",
        }
