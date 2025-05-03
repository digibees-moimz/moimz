# src/routers/group_account.py
from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import User, UserAccount
from src.models.group_account import GroupAccount, GroupTransaction, LockIn
from src.models.group import Member
from src.models.transaction import Transaction, TransactionParticipant
from src.schemas.group_account import (
    GroupAccountSummary,
    MemberLockedAmount,
    LockInCreate,
    LockOutCreate,
    SpendCreate,
)
from src.routers._helpers import (
    get_group,
    get_group_account,
    get_user_account,
    group_balance,
    locked_amounts_by_accounts,
)

router = APIRouter(tags=["Group Account"])


# ────────────────────────────────────────────────────────────
#  모임통장 요약
# ────────────────────────────────────────────────────────────
@router.get(
    "/groups/{group_id}/account/summary",
    response_model=GroupAccountSummary,
    summary="모임통장 조회",
    description="특정 그룹의 계좌 잔액과 사용자별 락인 금액을 포함한 요약 정보를 반환합니다.",
)
def get_group_account_summary(group_id: int):
    with Session(engine) as s:
        grp = get_group(s, group_id)
        ga = get_group_account(s, group_id)
        if not ga:
            raise HTTPException(404, "GroupAccount not found")

        # ① 멤버의 UserAccount-id / 이름 한꺼번에
        ua_rows = s.execute(
            select(UserAccount.id, User.name)
            .join(Member, Member.user_id == UserAccount.user_id)
            .join(User, User.id == UserAccount.user_id)
            .where(Member.group_id == group_id)
        ).all()  # → [(ua_id, name), …]

        ua_ids = [row[0] for row in ua_rows]
        locked_map = locked_amounts_by_accounts(s, ua_ids, group_id)

        members = [
            MemberLockedAmount(
                user_account_id=ua_id,
                name=name,
                locked_amount=locked_map.get(ua_id, 0.0),
            )
            for ua_id, name in ua_rows
        ]

        min_locked = min((m.locked_amount for m in members), default=0.0)

        return GroupAccountSummary(
            group_account_id=ga.id,
            account_number=ga.account_number,
            total_balance=group_balance(s, ga.id),
            members=members,
            available_to_spend=min_locked * len(members),
        )


# ────────────────────────────────────────────────────────────
#  락인 — 개인 입금
# ────────────────────────────────────────────────────────────
@router.post(
    "/lockin",
    status_code=status.HTTP_201_CREATED,
    summary="락인하기",
    description="사용자가 자신의 개인 락인 계좌에 금액을 입금하고, 그룹 계좌의 잔액을 증가시킵니다.",
)
def lock_in(dto: LockInCreate):
    if dto.amount <= 0:
        raise HTTPException(400, "입금 금액은 0보다 커야 합니다.")

    with Session(engine) as s:
        ua = get_user_account(s, dto.user_id)
        ga = get_group_account(s, dto.group_id)
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        prev_locked = locked_amounts_by_accounts(s, [ua.id], dto.group_id).get(ua.id, 0.0)
        if ua.balance - prev_locked < dto.amount:
            raise HTTPException(400, "락인가능 금액이 부족합니다.")

        s.add_all(
            [
                LockIn(
                    user_account_id=ua.id,
                    group_id=dto.group_id,
                    amount=dto.amount,
                    description=dto.description,
                ),
                GroupTransaction(
                    group_account_id=ga.id,
                    user_account_id=ua.id,
                    amount=dto.amount,
                    description=dto.description or "락인 입금",
                ),
            ]
        )
        s.commit()

        return {
            "balance": ua.balance,
            "locked_balance": prev_locked + dto.amount,
            "withdrawable": ua.balance - (prev_locked + dto.amount),
        }


# ────────────────────────────────────────────────────────────
#  락인 해제
# ────────────────────────────────────────────────────────────
@router.post(
    "/lockout",
    status_code=status.HTTP_201_CREATED,
    summary="락인 해제",
    description="사용자가 락인된 금액 중 일부를 해제하고 그룹 계좌 잔액에서 출금합니다.",
)
def lock_out(dto: LockOutCreate):
    if dto.amount <= 0:
        raise HTTPException(400, "출금 금액은 0보다 커야 합니다.")

    with Session(engine) as s:
        ua = get_user_account(s, dto.user_id)
        ga = get_group_account(s, dto.group_id)
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        prev_locked = locked_amounts_by_accounts(s, [ua.id], dto.group_id).get(ua.id, 0.0)
        if prev_locked < dto.amount:
            raise HTTPException(400, "락인된 금액보다 많이 출금할 수 없습니다.")

        s.add_all(
            [
                LockIn(
                    user_account_id=ua.id,
                    group_id=dto.group_id,
                    amount=-dto.amount,
                    description=dto.description or "락인 해제 출금",
                ),
                GroupTransaction(
                    group_account_id=ga.id,
                    user_account_id=ua.id,
                    amount=-dto.amount,
                    description=dto.description or "락인 해제 출금",
                ),
            ]
        )
        s.commit()

        new_locked = prev_locked - dto.amount
        return {
            "balance": ua.balance,
            "locked_balance": new_locked,
            "withdrawable": ua.balance - new_locked,
        }


# ────────────────────────────────────────────────────────────
#  지출 — 출석자 1/N 차감
# ────────────────────────────────────────────────────────────
@router.post(
    "/spend",
    status_code=status.HTTP_201_CREATED,
    summary="1/N 정산 지출",
    description="출석자 기준으로 총 금액을 1/N 분할하여 그룹 계좌에서 차감하고 결제-단위 트랜잭션을 기록합니다.",
)
def spend(dto: SpendCreate):
    if dto.total_amount <= 0 or not dto.user_ids:
        raise HTTPException(400, "지출 금액과 참여자는 필수입니다.")

    per_person = dto.total_amount / len(dto.user_ids)

    with Session(engine) as s:
        ga = get_group_account(s, dto.group_id)
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        # 참여자 계정 한 번에 조회
        ua_rows = s.execute(
            select(UserAccount)
            .where(UserAccount.user_id.in_(dto.user_ids))
        ).scalars().all()
        ua_map = {ua.user_id: ua for ua in ua_rows}

        missing = set(dto.user_ids) - ua_map.keys()
        if missing:
            raise HTTPException(404, f"UserAccount(s) not found: {sorted(missing)}")

        # 락인 잔액 검증 (집계 쿼리로 N+1 제거)
        locked_map = locked_amounts_by_accounts(s, [ua.id for ua in ua_rows], dto.group_id)
        for uid, ua in ua_map.items():
            if locked_map.get(ua.id, 0.0) < per_person:
                raise HTTPException(400, f"User {uid}의 락인 잔액 부족")

        # 결제 1건 생성
        settlement = Transaction(
            group_id=dto.group_id,
            total_amount=dto.total_amount,
            description=dto.description,
        )
        s.add(settlement)
        s.commit()
        s.refresh(settlement)

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
                    group_account_id=ga.id,
                    user_account_id=ua.id,
                    amount=-per_person,
                    description=dto.description or "공동 지출 1/N",
                )
            )
            lock_updates.append(
                LockIn(
                    user_account_id=ua.id,
                    group_id=dto.group_id,
                    amount=-per_person,
                    description=dto.description or "공동 지출 1/N",
                )
            )

        s.add_all(tx_parts + gtx + lock_updates)
        s.commit()

        return {
            "transaction_id": settlement.id,
            "group_balance": group_balance(s, ga.id),
            "per_person": per_person,
        }
