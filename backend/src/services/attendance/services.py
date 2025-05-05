# backend/src/services/attendance/services.py
import qrcode
import os, uuid, time, cv2, pickle
from datetime import datetime, timedelta
import numpy as np
from typing import List, Optional

from fastapi import UploadFile, HTTPException
from PIL import Image, ImageDraw, ImageFont
from sqlmodel import Session, select

from src.services.face.engine import face_engine
from src.constants import BASE_DIR, MATCH_THRESHOLD_ATTENDANCE
from src.core.database import engine
from src.routers._helpers import locked_amounts_by_accounts
from src.models.attendance import AttendanceRecord
from src.models.group import Member
from src.models.user import User, UserAccount
from src.models.schedule import Schedule
from src.schemas.attendance import (
    PhotoAttendanceItem,
    PhotoAttendanceResponse,
    ManualAttendanceRequest,
    ManualAttendanceResponse,
    ManualAttendanceItem,
    AttendanceCompleteRequest,
    SavedAttendanceItem,
    AttendanceRecordRead,
)

ATTEND_DIR = os.path.join(BASE_DIR, "media", "attendance")
os.makedirs(ATTEND_DIR, exist_ok=True)

QR_DIR = os.path.join(BASE_DIR, "media", "qrcodes")
os.makedirs(QR_DIR, exist_ok=True)


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


# 사진 기반 출석체크
async def run_photo_attendance(
    file: UploadFile, group_id: int
) -> PhotoAttendanceResponse:
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

        # 결제 가능 금액 계산
        min_locked = min((att["locked_amount"] for att in attendees), default=0.0)
        available_to_spend = min_locked * len(attendees)

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

        return PhotoAttendanceResponse(
            group_id=group_id,
            user_ids=[a["user_id"] for a in attendees],
            count=len(attendees),
            available_to_spend=available_to_spend,
            attendees=[PhotoAttendanceItem(**a) for a in attendees],
            duration=duration,
            image_url=f"/api/attendance/photo/{check_id}",
        )


# 수동 출석체크
def run_manual_attendance(
    session: Session, data: ManualAttendanceRequest
) -> ManualAttendanceResponse:
    # 이름 조회
    stmt = select(User.id, User.name).where(User.id.in_(data.user_ids))
    name_map = dict(session.execute(stmt).all())

    # 계좌 ID 조회
    stmt = select(UserAccount.user_id, UserAccount.id).where(
        UserAccount.user_id.in_(data.user_ids)
    )
    account_map = dict(session.execute(stmt).all())

    # 락인 금액 조회
    locked_map = locked_amounts_by_accounts(
        session,
        user_account_ids=list(account_map.values()),
        group_account_id=data.group_id,
    )

    attendees: list[ManualAttendanceItem] = []
    for uid in data.user_ids:
        account_id = account_map.get(uid)
        attendees.append(
            ManualAttendanceItem(
                user_id=uid,
                name=name_map.get(uid, "이름 없음"),
                locked_amount=locked_map.get(account_id, 0.0),
            )
        )

    # 결제 가능 금액
    min_locked = min((att.locked_amount for att in attendees), default=0.0)
    available_to_spend = min_locked * len(attendees)

    return ManualAttendanceResponse(
        group_id=data.group_id,
        user_ids=data.user_ids,
        attendees=attendees,
        count=len(attendees),
        available_to_spend=available_to_spend,
    )


def save_attendance(session: Session, dto: AttendanceCompleteRequest) -> int:
    # 일정이 존재하는지 조회 (0 또는 None → 번개 모임)
    if dto.schedule_id not in (None, 0):
        schedule = session.get(Schedule, dto.schedule_id)
        if not schedule:
            raise HTTPException(404, "일정이 존재하지 않습니다.")
        if schedule.is_done:
            raise HTTPException(400, "종료된 일정에는 출석체크를 저장할 수 없습니다.")
        schedule_id = schedule.id
    else:
        schedule_id = None  # 번개 모임은 None으로 저장

    record = AttendanceRecord(
        group_id=dto.group_id,
        schedule_id=schedule_id,
        attendee_user_ids=dto.user_ids,
        check_type=dto.check_type,
        image_url=dto.image_url,
    )
    session.add(record)
    session.commit()
    session.refresh(record)
    return record.id


def get_attendance_record(session: Session, attendance_id: int) -> AttendanceRecordRead:
    record = session.get(AttendanceRecord, attendance_id)
    if not record:
        raise HTTPException(404, "출석 정보가 없습니다.")

    stmt = select(User.id, User.name).where(User.id.in_(record.attendee_user_ids))
    name_map = dict(session.execute(stmt).all())

    stmt = select(UserAccount.user_id, UserAccount.id).where(
        UserAccount.user_id.in_(record.attendee_user_ids)
    )
    account_map = dict(session.execute(stmt).all())

    locked_map = locked_amounts_by_accounts(
        session,
        user_account_ids=list(account_map.values()),
        group_account_id=record.group_id,
    )

    attendees = [
        SavedAttendanceItem(
            user_id=uid,
            name=name_map.get(uid, "이름 없음"),
            locked_amount=locked_map.get(account_map.get(uid), 0.0),
        )
        for uid in record.attendee_user_ids
    ]

    min_locked = min((a.locked_amount for a in attendees), default=0.0)
    available_to_spend = min_locked * len(attendees)

    return AttendanceRecordRead(
        attendance_id=record.id,
        attendees=attendees,
        count=len(attendees),
        available_to_spend=available_to_spend,
        check_type=record.check_type,
        image_url=getattr(record, "image_url", None),
    )


def update_attendance(
    session: Session, attendance_id: int, user_ids: List[int]
) -> None:
    record = session.get(AttendanceRecord, attendance_id)
    if not record:
        raise HTTPException(404, "출석 정보가 없습니다.")
    if record.is_closed:
        raise HTTPException(400, "종료된 모임에서는 출석을 수정할 수 없습니다.")

    record.attendee_user_ids = user_ids
    session.add(record)
    session.commit()
    session.refresh(record)
    return record


def delete_qr_image_if_exists(token: Optional[str]):
    # 기존 QR 삭제
    if token:
        path = os.path.join(QR_DIR, f"{token}.png")
        if os.path.exists(path):
            os.remove(path)


def generate_qr_for_attendance(session: Session, attendance_id: int) -> str:
    record = session.get(AttendanceRecord, attendance_id)
    if not record:
        raise HTTPException(404, "출석 정보가 없습니다.")
    if record.is_closed:
        raise HTTPException(400, "종료된 모임에서는 QR 코드를 생성할 수 없습니다.")

    # 사용된 QR이면 새로 만들어야 함
    if record.qrcode_used:
        delete_qr_image_if_exists(record.qrcode_token)
        # 초기화
        record.qrcode_token = None
        record.qrcode_created_at = None
        record.qrcode_used = False

    # 이미 QR이 생성되어 있고 아직 유효하면 그대로 사용
    if record.qrcode_token and record.qrcode_created_at:
        elapsed = datetime.utcnow() - record.qrcode_created_at
        if elapsed.total_seconds() < 1800:  # 30분
            return record.qrcode_token  # 재사용
        delete_qr_image_if_exists(record.qrcode_token)

    # 새 QR 토큰 생성
    token = uuid.uuid4().hex
    record.qrcode_token = token
    record.qrcode_created_at = datetime.utcnow()
    session.add(record)
    session.commit()

    # QR 이미지 생성
    qr_data = f"moiMz|{record.group_id}|{token}"
    qr_img = qrcode.make(qr_data)
    qr_path = os.path.join(QR_DIR, f"{token}.png")
    qr_img.save(qr_path)

    return token


# 모임 종료 처리
def close_attendance_by_schedule_id(session: Session, schedule_id: int):
    record = (
        session.execute(
            select(AttendanceRecord).where(AttendanceRecord.schedule_id == schedule_id)
        )
        .scalars()
        .first()
    )
    if record and not record.is_closed:
        record.is_closed = True
        session.add(record)
        session.commit()
