# src/routers/group_account.py
from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.user import User, UserAccount
from src.models.group_account import GroupAccount, GroupTransaction, LockIn
from src.models.group import Member
from src.schemas.group_account import (
    GroupAccountSummary,
    MemberLockedAmount,
    LockInCreate,
    LockOutCreate,
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
        ga = get_group_account(s, dto.group_account_id)
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        prev_locked = locked_amounts_by_accounts(s, [ua.id], dto.group_account_id).get(ua.id, 0.0)
        if ua.balance - prev_locked < dto.amount:
            raise HTTPException(400, "락인가능 금액이 부족합니다.")

        s.add_all(
            [
                LockIn(
                    user_account_id=ua.id,
                    group_account_id=dto.group_account_id,
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


