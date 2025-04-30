from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select, func
from src.core.database import engine
from src.models.group_account import GroupAccount, GroupTransaction
from src.schemas.group_account import GroupAccountSummary, MemberLockedAmount, LockInCreate, SpendCreate

router = APIRouter(tags=["Group Account"])

@router.get(
    "/groups/{group_id}/account/summary",
    response_model=GroupAccountSummary,
    summary="Get Group Account Summary",
    description="특정 그룹의 계좌 잔액과 사용자별 락인 금액을 포함한 요약 정보를 반환합니다.",
)
def get_group_account_summary(group_id: int):
    with Session(engine) as session:
        # 그룹 계좌가 존재하는지 확인
        group_account = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == group_id)
        ).first()

        if not group_account:
            raise HTTPException(status_code=404, detail="GroupAccount not found")

        # 전체 잔액 계산 (해당 group_account_id의 모든 거래 합산)
        total_balance = session.exec(
            select(func.sum(GroupTransaction.amount)).where(
                GroupTransaction.group_account_id == group_account.id
            )
        ).one() or 0.0

        # 각 유저별 락인 금액 계산
        rows = session.exec(
            select(
                GroupTransaction.user_account_id,
                func.sum(GroupTransaction.amount)
            )
            .where(GroupTransaction.group_account_id == group_account.id)
            .group_by(GroupTransaction.user_account_id)
        ).all()

        members = [
            MemberLockedAmount(
                user_account_id=user_id,
                locked_amount=amount
            )
            for user_id, amount in rows if user_id is not None
        ]

        return GroupAccountSummary(
            group_account_id=group_account.id,
            total_balance=total_balance,
            members=members
        )


# 락인 — 개인 입금
@router.post(
    "/lockin",
    status_code=status.HTTP_201_CREATED,
    summary="Lock-in Deposit",
    description="사용자가 자신의 개인 락인 계좌에 금액을 입금하고, 그룹 계좌의 잔액을 증가시킵니다.",
)
def lock_in(data: LockInCreate):
    with Session(engine) as session:
        # GroupAccount 찾기
        ga = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not ga:
            raise HTTPException(404, "GroupAccount not found")

        # 거래 기록 + 잔액 증가
        trx = GroupTransaction(
            group_account_id=ga.id,
            user_account_id=data.user_id,
            amount=data.amount,      # 양수
            description=data.description,
        )
        session.add(trx)
        ga.balance += data.amount
        session.commit()
        session.refresh(ga)
        return {"group_balance": ga.balance}


# 지출 — 출석자 1/N 차감
@router.post(
    "/spend",
    status_code=status.HTTP_201_CREATED,
    summary="Spend (1/N Deduction)",
    description="출석자 기준으로 총 금액을 1/N 분할하여 그룹 계좌에서 차감하고 각 사용자에게 지출 트랜잭션을 생성합니다.",
)
def spend(data: SpendCreate):
    with Session(engine) as session:
        ga = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not ga:
            raise HTTPException(404, "GroupAccount not found")

        per_person = data.total_amount / len(data.user_ids)

        for uid in data.user_ids:
            trx = GroupTransaction(
                group_account_id=ga.id,
                user_account_id=uid,
                amount=-per_person,          # 음수
                description=data.description,
            )
            session.add(trx)

        ga.balance -= data.total_amount
        session.commit()
        session.refresh(ga)
        return {"group_balance": ga.balance}
