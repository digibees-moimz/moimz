import json, re
from sqlmodel import Session, select
from src.models.attendance import AttendanceRecord
from src.models.user import User
from datetime import datetime
from src.models.group import Member
from src.models.diary import Diary
from src.models.transaction import Transaction
from src.models.attendance import AttendanceRecord
from src.models.schedule import Schedule
from src.models.user import User
from src.services.diary.llm_utils import generate_diary_content


def get_attendees_from_attendance(session: Session, attendance_id: int):
    attendance = session.get(AttendanceRecord, attendance_id)
    if not attendance or not attendance.attendee_user_ids:
        return []

    users = (
        session.execute(select(User).where(User.id.in_(attendance.attendee_user_ids)))
        .scalars()
        .all()
    )

    return [
        {"user_id": u.id, "name": u.name, "profile_image_url": u.profile_image_url}
        for u in users
    ]


def auto_generate_diary(
    session: Session, group_id: int, schedule_id: int, attendance_id: int, user_id: int
) -> Diary:
    # 출석 확인
    attendance = session.get(AttendanceRecord, attendance_id)
    if not attendance or not attendance.attendee_user_ids:
        raise ValueError("출석 정보가 없습니다.")

    # 일정 확인
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        raise ValueError("일정 정보가 없습니다.")

    # 참석자 조회
    users = (
        session.execute(select(User).where(User.id.in_(attendance.attendee_user_ids)))
        .scalars()
        .all()
    )
    attendees = [u.name for u in users]

    members = (
        session.execute(select(Member).where(Member.group_id == group_id))
        .scalars()
        .all()
    )
    user_ids = [m.user_id for m in members]

    all_users = (
        session.execute(select(User).where(User.id.in_(user_ids))).scalars().all()
    )
    all_user_names = [u.name for u in all_users]

    # 결제 내역 조회
    transactions = (
        session.execute(
            select(Transaction).where(Transaction.schedule_id == schedule_id)
        )
        .scalars()
        .all()
    )
    tx_data = [
        {
            "store_name": tx.store_name,
            "store_location": tx.store_location or "미정",
            "mcc_code": tx.mcc_code,
            "total_amount": tx.total_amount,
            "transaction_date": tx.created_at.strftime("%Y-%m-%d"),
            "description": tx.description,
        }
        for tx in transactions
    ]

    # 프롬프트에 넣을 그룹 데이터
    group_data = {
        "appoint_name": schedule.title,
        "date": schedule.date.strftime("%Y-%m-%d"),
        "location": schedule.location,
        "attendees": attendees,
        "group_member": all_user_names,
        "attendees_num": len(attendees),
        "group_member_num": len(all_user_names),
    }

    diary_response = generate_diary_content(group_data, tx_data)

    # 응답 정제 및 JSON 파싱
    if isinstance(diary_response, list):
        diary_response_str = "\n".join([b.text for b in diary_response])
    elif isinstance(diary_response, str):
        diary_response_str = diary_response
    else:
        raise ValueError("Claude 응답 형식이 예상과 다릅니다.")

    diary_response_str = clean_json_text(diary_response_str)
    parsed = json.loads(diary_response_str)

    print("Claude 응답 원문 ↓↓↓")
    print(diary_response_str)

    diary = Diary(
        group_id=group_id,
        user_id=user_id,
        schedule_id=schedule_id,
        attendance_id=attendance_id,
        title=parsed["title"],
        diary_text=parsed["body"],
        summary=parsed.get("summary", None),
        hashtags=parsed.get("hashtags", []),
        created_at=datetime.utcnow(),
    )
    session.add(diary)
    session.commit()
    session.refresh(diary)
    return diary


def clean_json_text(text: str) -> str:
    # ```json ... ``` 제거
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]
    # JSON control character 정리
    text = re.sub(r'(?<!\\)\\(?!["\\/bfnrtu])', r"\\\\", text)
    return text.strip()
