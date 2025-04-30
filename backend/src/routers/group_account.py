from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select, func
from src.core.database import engine
from src.models.user import UserAccount
from src.models.group_account import GroupAccount, GroupTransaction
from src.models.group import Group, Member
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

        # GroupAccount 찾기
        ga = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        user_account = session.exec(
            select(UserAccount).where(UserAccount.user_id == data.user_id)
        ).first()

        if user_account is None:
            raise HTTPException(404, "유저 계좌가 없어요")


        available = user_account.balance - user_account.locked_balance
        if available < data.amount:
            raise HTTPException(400, "락인가능 금액이 부족합니다.")

        user_account.locked_balance += data.amount

        # 거래 기록 + 잔액 증가
        session.add(GroupTransaction(
            group_account_id=ga.id,
            user_account_id=user_account.id,
            amount=data.amount,
            description=data.description or "락인 입금",
        ))
        session.commit()
        session.refresh(user_account)

        return {
            "balance":         user_account.balance,
            "locked_balance":  user_account.locked_balance,
            "withdrawable":    user_account.balance - user_account.locked_balance
        }


# 락인 해제 — 개인 출금
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

        ga = session.exec(
            select(GroupAccount).where(GroupAccount.group_id == data.group_id)
        ).first()
        if not ga:
            raise HTTPException(404, "그룹 계좌가 없어요")

        user_account = session.exec(
            select(UserAccount).where(UserAccount.user_id == data.user_id)
        ).first()

        if user_account is None:
            raise HTTPException(404, "유저 계좌가 없어요")

        if user_account.locked_balance < data.amount:
            raise HTTPException(400, detail="락인된 금액보다 많이 출금할 수 없습니다.")

        user_account.locked_balance -= data.amount

        # 거래 기록 + 잔액 감소
        session.add(GroupTransaction(
            group_account_id=ga.id,
            user_account_id=user_account.id,
            amount=-data.amount,
            description=data.description or "락인 해제 출금",
        ))
        session.commit()
        session.refresh(user_account)

        return {
            "balance":         user_account.balance,
            "locked_balance":  user_account.locked_balance,
            "withdrawable":    user_account.balance - user_account.locked_balance
        }


# 지출 — 출석자 1/N 차감
@router.post(
    "/spend",
    status_code=status.HTTP_201_CREATED,
    summary="1/N 정산 지출",
    description="출석자 기준으로 총 금액을 1/N 분할하여 그룹 계좌에서 차감하고 각 사용자에게 지출 트랜잭션을 생성합니다.",
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

        # 락인 잔액 기준 검사
        for uid in data.user_ids:
            ua = ua_map[uid]
            if ua.locked_balance < per_person:
                raise HTTPException(
                    400,
                    detail=f"User {uid}의 락인 잔액이 부족합니다. 필요: {per_person}, 보유: {ua.locked_balance}"
                )

        for uid in data.user_ids:
            ua = ua_map[uid]
            ua.locked_balance -= per_person
            ua.balance        -= per_person

            session.add(GroupTransaction(
                group_account_id=ga.id,
                user_account_id=ua.id,
                amount=-per_person,
                description=data.description or "공동 지출 1/N",
            ))

        session.commit()

        total_balance = session.exec(
            select(func.sum(GroupTransaction.amount))
            .where(GroupTransaction.group_account_id == ga.id)
        ).one() or 0.0

        return {"group_balance": total_balance}
