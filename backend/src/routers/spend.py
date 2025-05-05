# src/routers/spend.py
from fastapi import APIRouter, status, Depends
from sqlmodel import Session

from src.core.database import get_session
from src.services.spend.services import perform_spend, spend_via_token
from src.schemas.spend import (
    SpendCreate,
    SpendByTokenRequest,
)

router = APIRouter(tags=["1/N Spend"])


# ────────────────────────────────────────────────────────────
#  지출 — 출석자 1/N 차감 (수동)
# ────────────────────────────────────────────────────────────
@router.post(
    "/spend",
    status_code=status.HTTP_201_CREATED,
    summary="수동 1/N 정산 지출",
    description="출석자 기준으로 총 금액을 1/N 분할하여 그룹 계좌에서 차감하고 결제-단위 트랜잭션을 기록합니다.",
)
def spend(dto: SpendCreate, session: Session = Depends(get_session)):
    return perform_spend(session, dto)


# ────────────────────────────────────────────────────────────
#  지출 — 출석자 1/N 차감 (QR 코드)
# ────────────────────────────────────────────────────────────
@router.post(
    "/token/{qr_token}",
    status_code=status.HTTP_201_CREATED,
    summary="QR 기반 출석자 1/N 정산",
)
def spend_by_qr_token(
    qr_token: str,
    dto: SpendByTokenRequest,
    session: Session = Depends(get_session),
):
    return spend_via_token(session, qr_token, dto)
