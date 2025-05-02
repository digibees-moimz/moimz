from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select, func
from src.core.database import engine
from src.models.user import UserAccount, LockIn
from src.models.group_account import GroupAccount, GroupTransaction
from src.models.group import Group, Member
from src.models.transaction import (
    Transaction,               # 결제 1건
    TransactionParticipant     # 참여자 N건
)
from src.schemas.group_account import GroupAccountSummary, MemberLockedAmount, LockInCreate, SpendCreate, LockOutCreate

router = APIRouter(tags=["Group Account"])

@router.get(
    "/groups/{group_id}/account/summary",
    response_model=GroupAccountSummary,
    summary="모임통장 조회",
    description="특정 그룹의 계좌 잔액과 사용자별 락인 금액을 포함한 요약 정보를 반환합니다.",
)
def get_group_account_summary(group_id: int):
    with Session(engine) as session:
        # 1. 그룹 존재 확인
        group = session.get(Group, group_id)
        if not group:
            raise HTTPException(404, "Group not found")

        # 2. 해당 그룹의 그룹 계좌 가져오기
        group_account = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == group_id)
        ).first()

        # 3. 그룹 계좌의 총 잔액 계산 (트랜잭션 합산 기준)
        total_balance = session.exec(
            select(func.sum(GroupTransaction.amount)).where(
                GroupTransaction.group_account_id == group_account.id
            )
        ).one() or 0.0

        # 4. 이 그룹에 소속된 모든 유저 ID 가져오기
        member_ids = session.exec(
            select(Member.user_id).where(Member.group_id == group_id)
        ).all()

        # 5. 각 유저의 락인 금액 계산
        locked_rows = session.exec(
            select(
                GroupTransaction.user_account_id,
                func.sum(GroupTransaction.amount)
            )
            .where(GroupTransaction.group_account_id == group_account.id)
            .group_by(GroupTransaction.user_account_id)
        ).all()
        locked_dict = {uid: amt for uid, amt in locked_rows}

        # 6. 모든 멤버에 대해 locked_amount 없으면 0으로 설정
        members = [
            MemberLockedAmount(
                user_account_id=user_id,
                locked_amount=locked_dict.get(user_id, 0.0)
            )
            for user_id in member_ids
        ]

        # 7. 가장 적게 락인한 금액을 available_to_spend으로 계산
        min_locked = min([m.locked_amount for m in members], default=0.0)
        available_to_spend = min_locked * len(members)
        
        return GroupAccountSummary(
            group_account_id=group_account.id,
            account_number=group_account.account_number,  # 이거 추가
            total_balance=total_balance,
            members=members,
            available_to_spend=available_to_spend
        )

# 락인 — 개인 입금
@router.post(
    "/lockin",
    status_code=status.HTTP_201_CREATED,
    summary="락인하기",
    description="사용자가 자신의 개인 락인 계좌에 금액을 입금하고, 그룹 계좌의 잔액을 증가시킵니다.",
)
def lock_in(data: LockInCreate):
    with Session(engine) as session:
        if data.amount <= 0:
            raise HTTPException(400, detail="입금 금액은 0보다 커야 합니다.")

        # 사용자 계좌
        user_account = session.exec(
            select(UserAccount).where(UserAccount.user_id == data.user_id)
        ).first()
        if not user_account:
            raise HTTPException(404, "유저 계좌가 없어요")

        # 그룹 계좌
        group_account = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not group_account:
            raise HTTPException(404, "그룹 계좌가 없어요")

        # 락인 가능한 금액 확인
        total_locked = session.exec(
            select(func.sum(LockIn.amount)).where(
                LockIn.user_account_id == user_account.id
            )
        ).one() or 0.0

        available = user_account.balance - total_locked
        if available < data.amount:
            raise HTTPException(400, "락인가능 금액이 부족합니다.")

        # LockIn 기록 추가
        session.add(LockIn(
            user_account_id=user_account.id,
            group_id=data.group_id,
            amount=data.amount,
            description=data.description
        ))

        # GroupTransaction 기록도 추가
        session.add(GroupTransaction(
            group_account_id=group_account.id,
            user_account_id=user_account.id,
            amount=data.amount,
            description=data.description or "락인 입금",
        ))

        session.commit()

        return {
            "balance": user_account.balance,
            "locked_balance": total_locked + data.amount,
            "withdrawable": available - data.amount,
        }

# 락인 해제제
@router.post(
    "/lockout",
    status_code=status.HTTP_201_CREATED,
    summary="락인 해제",
    description="사용자가 락인된 금액 중 일부를 해제하고 그룹 계좌 잔액에서 출금합니다.",
)
def lock_out(data: LockOutCreate):
    with Session(engine) as session:
        if data.amount <= 0:
            raise HTTPException(400, detail="출금 금액은 0보다 커야 합니다.")

        # 그룹 계좌 확인
        ga = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        # 사용자 계좌 확인
        ua = session.exec(
            select(UserAccount).where(UserAccount.user_id == data.user_id)
        ).first()
        if not ua:
            raise HTTPException(404, "유저 계좌가 없어요")

        # 현재 락인 총액 확인
        total_locked = session.exec(
            select(func.sum(LockIn.amount)).where(
                LockIn.user_account_id == ua.id,
                LockIn.group_id == data.group_id
            )
        ).one() or 0.0

        if total_locked < data.amount:
            raise HTTPException(400, detail="락인된 금액보다 많이 출금할 수 없습니다.")

        # LockIn 테이블에 음수 락인 추가
        session.add(LockIn(
            user_account_id=ua.id,
            group_id=data.group_id,
            amount=-data.amount,
            description=data.description or "락인 해제 출금"
        ))

        # GroupTransaction 기록
        session.add(GroupTransaction(
            group_account_id=ga.id,
            user_account_id=ua.id,
            amount=-data.amount,
            description=data.description or "락인 해제 출금"
        ))

        session.commit()

        return {
            "balance": ua.balance,
            "locked_balance": total_locked - data.amount,
            "withdrawable": ua.balance - (total_locked - data.amount)
        }

# 지출 — 출석자 1/N 차감
@router.post(
    "/spend",
    status_code=status.HTTP_201_CREATED,
    summary="1/N 정산 지출",
    description="출석자 기준으로 총 금액을 1/N 분할하여 그룹 계좌에서 차감하고 결제-단위 트랜잭션을 기록합니다.",
)
def spend(data: SpendCreate):
    with Session(engine) as session:
        ga = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        per_person = data.total_amount / len(data.user_ids)

        user_accounts = session.exec(
            select(UserAccount).where(UserAccount.user_id.in_(data.user_ids))
        ).all()
        ua_map = {ua.user_id: ua for ua in user_accounts}
        missing = set(data.user_ids) - set(ua_map.keys())
        if missing:
            raise HTTPException(404, f"UserAccount(s) not found: {sorted(missing)}")

        # 🔸 락인 잔액 검증
        for uid in data.user_ids:
            ua = ua_map[uid]
            total_locked = session.exec(
                select(func.sum(LockIn.amount)).where(
                    LockIn.user_account_id == ua.id,
                    LockIn.group_id == data.group_id
                )
            ).one() or 0.0

            if total_locked < per_person:
                raise HTTPException(
                    400,
                    detail=f"User {uid}의 락인 잔액 부족. 필요 {per_person}, 보유 {total_locked}"
                )

        # 🔸 결제 1건 생성
        settlement = Transaction(
            group_id=data.group_id,
            total_amount=data.total_amount,
            description=data.description
        )
        session.add(settlement)
        session.commit()
        session.refresh(settlement)

        # 🔸 참여자별 차감 처리
        for uid in data.user_ids:
            ua = ua_map[uid]
            ua.balance -= per_person  # 사용자의 총 계좌 잔액 차감

            # 🔹 LockIn 테이블에 음수 기록 추가
            session.add(LockIn(
                user_account_id=ua.id,
                group_id=data.group_id,
                amount=-per_person,
                description=data.description or "공동 지출 1/N"
            ))

            # 🔹 모임 통장 거래 기록
            session.add(GroupTransaction(
                group_account_id=ga.id,
                user_account_id=ua.id,
                amount=-per_person,
                description=data.description or "공동 지출 1/N"
            ))

            # 🔹 참여자 트랜잭션 기록
            session.add(TransactionParticipant(
                transaction_id=settlement.id,
                user_id=uid,
                amount=per_person
            ))

        session.commit()

        total_balance = session.exec(
            select(func.sum(GroupTransaction.amount)).where(
                GroupTransaction.group_account_id == ga.id
            )
        ).one() or 0.0

        return {
            "transaction_id": settlement.id,
            "group_balance": total_balance,
            "per_person": per_person
        }
