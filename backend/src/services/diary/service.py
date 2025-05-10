from sqlmodel import Session, select
from src.models.attendance import AttendanceRecord
from src.models.user import User
from datetime import datetime
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

    # 그룹 전체 인원 이름 조회 (필요하면 Member 테이블 등에서 그룹 사용자 전부 가져오기)
    all_users = (
        session.execute(
            select(User).join_from(User, Schedule, Schedule.group_id == group_id)
        )
        .scalars()
        .all()
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

    diary_text = generate_diary_content(group_data, tx_data)

    # ✅ TextBlock 리스트를 하나의 문자열로 변환
    if isinstance(diary_text, list):
        diary_text_str = "\n\n".join(block.text for block in diary_text)
    else:
        diary_text_str = str(diary_text)

    # 제목 추출
    title = diary_text_str.strip().split("\n")[0].replace("#", "").strip()

    diary = Diary(
        group_id=group_id,
        user_id=user_id,
        schedule_id=schedule_id,
        attendance_id=attendance_id,
        title=title,
        diary_text=diary_text_str,
        created_at=datetime.utcnow(),
    )
    session.add(diary)
    session.commit()
    session.refresh(diary)
    return diary
