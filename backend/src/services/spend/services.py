# src/services/spend/services.py
from datetime import datetime
from sqlmodel import Session, select
from fastapi import HTTPException

from src.models.user import UserAccount
from src.models.group_account import GroupTransaction, LockIn
from src.models.transaction import Transaction, TransactionParticipant
from src.models.attendance import AttendanceRecord
from src.schemas.spend import SpendCreate, SpendByTokenRequest
from src.routers._helpers import (
    get_group_account,
    group_balance,
    locked_amounts_by_accounts,
)


def perform_spend(session: Session, dto: SpendCreate):
    if dto.total_amount <= 0 or not dto.user_ids:
        raise HTTPException(400, "지출 금액과 참여자는 필수입니다.")

    per_person = dto.total_amount / len(dto.user_ids)

    ga = get_group_account(session, dto.group_id)
    if not ga:
        raise HTTPException(404, "그룹 계좌가 없어요")

    # 참여자 계정 한 번에 조회
    ua_rows = (
        session.execute(
            select(UserAccount).where(UserAccount.user_id.in_(dto.user_ids))
        )
        .scalars()
        .all()
    )
    ua_map = {ua.user_id: ua for ua in ua_rows}

    missing = set(dto.user_ids) - ua_map.keys()
    if missing:
        raise HTTPException(404, f"UserAccount(s) not found: {sorted(missing)}")

    # 락인 잔액 검증
    locked_map = locked_amounts_by_accounts(
        session, [ua.id for ua in ua_rows], dto.group_id
    )
    for uid, ua in ua_map.items():
        if locked_map.get(ua.id, 0.0) < per_person:
            raise HTTPException(400, f"User {uid}의 락인 잔액 부족")

    # 결제 트랜잭션 생성
    settlement = Transaction(
        group_id=dto.group_id,
        total_amount=dto.total_amount,
        description=dto.description,
        schedule_id=dto.schedule_id,  # ✅ 추가!
    )
    session.add(settlement)
    session.commit()
    session.refresh(settlement)

    # 참여자별 차감 기록
    tx_parts: list[TransactionParticipant] = []
    gtx: list[GroupTransaction] = []
    lock_updates: list[LockIn] = []

    for uid, ua in ua_map.items():
        ua.balance -= per_person
        tx_parts.append(
            TransactionParticipant(
                transaction_id=settlement.id, user_id=uid, amount=per_person
            )
        )
        gtx.append(
            GroupTransaction(
                user_account_id=ua.id,
                group_account_id=ga.id,
                amount=-per_person,
                description=dto.description or "공동 지출 1/N",
            )
        )
        lock_updates.append(
            LockIn(
                user_account_id=ua.id,
                group_account_id=ga.id,
                amount=-per_person,
                description=dto.description or "공동 지출 1/N",
            )
        )

    session.add_all(tx_parts + gtx + lock_updates)
    session.commit()

    return {
        "transaction_id": settlement.id,
        "group_balance": group_balance(session, ga.id),
        "per_person": per_person,
    }


def spend_via_token(session: Session, qr_token: str, dto: SpendByTokenRequest):
    record = (
        session.execute(
            select(AttendanceRecord).where(AttendanceRecord.qrcode_token == qr_token)
        )
        .scalars()
        .first()
    )

    if not record:
        raise HTTPException(404, "유효하지 않은 QR 코드입니다.")

    # 모임 종료 체크
    if record.is_closed:
        raise HTTPException(400, "종료된 모임에서는 결제를 진행할 수 없습니다.")

    # 중복 방지
    if record.qrcode_used:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "이미 사용된 QR 코드입니다. 다시 생성해 주세요.",
                "next": f"/api/attendance/{record.id}/qr",
            },
        )

    # 유효 시간 체크
    if (
        not record.qrcode_created_at
        or (datetime.utcnow() - record.qrcode_created_at).total_seconds() > 1800
    ):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "만료된 QR 코드입니다. 다시 생성해 주세요.",
                "next": f"/api/attendance/{record.id}/qr",
            },
        )

    # 사용 처리 (락 처리로 race condition 방지)
    record.qrcode_used = True
    session.add(record)
    session.commit()

    spend_dto = SpendCreate(
        group_id=record.group_id,
        schedule_id=record.schedule_id,  # ✅ 추가
        user_ids=record.attendee_user_ids,
        total_amount=dto.total_amount,
        description=dto.description or "QR 결제",
    )

    return perform_spend(session, spend_dto)
