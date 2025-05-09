# src/routers/schedule.py
from fastapi import APIRouter, HTTPException, status, Depends, Query
from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from src.core.database import get_session
from sqlalchemy.orm import selectinload
from src.models.group import Member
from src.models.transaction import Transaction
from src.models.schedule import Schedule, ScheduleComment
from src.schemas.schedule import (
    ScheduleCreate,
    ScheduleRead,
    ScheduleUpdate,
    ScheduleCommentCreate,
    ScheduleCommentRead,
    ScheduleCalendarRead,
    AllScheduleCalendarRead,
)
from src.services.attendance.services import close_attendance_by_schedule_id

router = APIRouter(prefix="/schedules", tags=["Schedules"])


def get_schedule_or_404(session: Session, schedule_id: int) -> Schedule:
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        raise HTTPException(404, detail="일정이 존재하지 않습니다.")
    return schedule


@router.post(
    "",
    response_model=ScheduleRead,
    status_code=status.HTTP_201_CREATED,
    summary="일정 생성",
    description="모임 일정을 생성합니다.",
)
def create_schedule(
    schedule_in: ScheduleCreate, session: Session = Depends(get_session)
):
    schedule = Schedule(**schedule_in.dict())
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return schedule


# 전체 중 다음 일정 1개
@router.get(
    "/upcoming",
    response_model=AllScheduleCalendarRead,
    summary="전체 중 가장 가까운 다음 일정 조회",
)
def get_upcoming_schedule(
    user_id: int = Query(..., description="사용자 ID"),
    session: Session = Depends(get_session),
):
    now = datetime.utcnow()

    # 사용자가 속한 그룹 ID 목록
    group_ids_stmt = select(Member.group_id).where(Member.user_id == user_id)
    group_ids = session.execute(group_ids_stmt).scalars().all()

    if not group_ids:
        raise HTTPException(404, detail="가입한 그룹이 없습니다.")

    stmt = (
        select(Schedule)
        .options(selectinload(Schedule.group))
        .where(Schedule.group_id.in_(group_ids))
        .where(Schedule.date >= now)
        .order_by(Schedule.date.asc())
        .limit(1)
    )
    schedule = session.execute(stmt).scalars().first()
    if not schedule:
        raise HTTPException(404, detail="다가오는 일정이 없습니다.")
    return AllScheduleCalendarRead(
        id=schedule.id,
        title=schedule.title,
        date=schedule.date,
        is_done=schedule.is_done,
        group_id=schedule.group_id,
        group_name=schedule.group.name if schedule.group else "",
        location=schedule.location,
    )


# 전체 중 오늘 기준 다음 일정 1개
@router.get(
    "/today",
    response_model=AllScheduleCalendarRead,
    summary="전체 중 오늘의 가장 빠른 일정 조회",
)
def get_today_schedule(
    user_id: int = Query(..., description="사용자 ID"),
    session: Session = Depends(get_session),
):
    today = datetime.utcnow().date()
    start_time = datetime.combine(today, datetime.min.time())  # 00:00:00
    end_time = datetime.combine(today, datetime.max.time())  # 23:59:59

    # 사용자가 속한 그룹 ID 목록
    group_ids_stmt = select(Member.group_id).where(Member.user_id == user_id)
    group_ids = session.execute(group_ids_stmt).scalars().all()

    if not group_ids:
        raise HTTPException(404, detail="가입한 그룹이 없습니다.")

    # 해당 그룹들 중 오늘 이후 가장 빠른 일정
    stmt = (
        select(Schedule)
        .options(selectinload(Schedule.group))
        .where(Schedule.group_id.in_(group_ids))
        .where(Schedule.is_done == False)
        .where(Schedule.date >= start_time)
        .where(Schedule.date <= end_time)
        .order_by(Schedule.date.asc())
        .limit(1)
    )
    schedule = session.execute(stmt).scalars().first()

    if not schedule:
        raise HTTPException(404, detail="다가오는 일정이 없습니다.")
    return AllScheduleCalendarRead(
        id=schedule.id,
        title=schedule.title,
        date=schedule.date,
        is_done=schedule.is_done,
        group_id=schedule.group_id,
        group_name=schedule.group.name if schedule.group else "",
        location=schedule.location,
    )


@router.get(
    "/group/{group_id}",
    response_model=list[ScheduleRead],
    summary="해당 그룹 모든 일정 조회",
    description="특정 그룹의 모든 모임 일정을 조회합니다.",
)
def get_schedules_by_group(group_id: int, session: Session = Depends(get_session)):
    return (
        session.execute(select(Schedule).where(Schedule.group_id == group_id))
        .scalars()
        .all()
    )


@router.get(
    "/group/{group_id}/monthly",
    response_model=list[ScheduleCalendarRead],
    summary="월별 일정 조회",
    description="특정 그룹의 특정 연/월에 해당하는 일정들을 조회합니다.",
)
def get_monthly_schedules(
    group_id: int,
    year: int = Query(..., description="조회할 연도"),
    month: int = Query(..., description="조회할 월"),
    session: Session = Depends(get_session),
):
    start_date = datetime(year, month, 1)
    end_date = datetime(year + int(month == 12), month % 12 + 1, 1)

    stmt = (
        select(Schedule)
        .where(Schedule.group_id == group_id)
        .where(Schedule.date >= start_date)
        .where(Schedule.date < end_date)
    )

    schedules = session.execute(stmt).scalars().all()
    return schedules


@router.get(
    "/{schedule_id}",
    response_model=ScheduleRead,
    summary="단일 일정 상세 조회",
    description="단일 모임 일정의 상세 정보를 조회합니다.",
)
def get_schedule(schedule_id: int, session: Session = Depends(get_session)):
    stmt = (
        select(Schedule)
        .where(Schedule.id == schedule_id)
        .options(
            selectinload(Schedule.user),  # 주최자 정보 포함
            selectinload(Schedule.comments).selectinload(
                ScheduleComment.user
                ),  # 댓글 작성자 정보 포함
            selectinload(Schedule.transactions).selectinload(
                Transaction.participants
                ),  # ✅ 이 줄 추가!
        )
    )
    schedule = session.execute(stmt).scalars().first()
    if not schedule:
        raise HTTPException(404, "일정이 존재하지 않습니다.")
    return schedule


@router.patch(
    "/{schedule_id}",
    response_model=ScheduleRead,
    summary="일정 수정",
    description="모임 일정의 정보를 수정합니다.",
)
def update_schedule(
    schedule_id: int,
    schedule_in: ScheduleUpdate,
    session: Session = Depends(get_session),
):
    schedule = get_schedule_or_404(session, schedule_id)
    for k, v in schedule_in.dict(exclude_unset=True).items():
        setattr(schedule, k, v)
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return schedule


@router.delete(
    "/{schedule_id}",
    summary="일정 삭제",
    description="모임 일정을 삭제합니다.",
)
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = get_schedule_or_404(session, schedule_id)
    session.delete(schedule)
    session.commit()
    return {"message": "일정이 삭제되었습니다."}


@router.patch(
    "/{schedule_id}/done",
    status_code=status.HTTP_200_OK,
    summary="일정 완료 처리",
    description="특정 일정을 완료 상태로 표시합니다.",
)
def mark_schedule_done(schedule_id: int, session: Session = Depends(get_session)):
    schedule = get_schedule_or_404(session, schedule_id)
    schedule.is_done = True

    # 연결된 출석 기록 종료
    close_attendance_by_schedule_id(session, schedule_id)

    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return {"message": "일정을 완료 처리했습니다.", "schedule_id": schedule.id}


@router.post(
    "/{schedule_id}/comments",
    response_model=ScheduleCommentRead,
    status_code=status.HTTP_201_CREATED,
    summary="댓글 등록",
    description="해당 일정에 댓글을 작성합니다.",
)
def add_comment(
    schedule_id: int,
    comment_in: ScheduleCommentCreate,
    session: Session = Depends(get_session),
):
    # 일정 존재 확인
    schedule = get_schedule_or_404(session, schedule_id)

    # 댓글 저장
    comment = ScheduleComment(
        schedule_id=schedule_id,
        user_id=comment_in.user_id,
        content=comment_in.content,
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


@router.get(
    "/{schedule_id}/comments",
    response_model=list[ScheduleCommentRead],
    summary="댓글 목록 조회",
    description="특정 일정에 달린 댓글들을 모두 조회합니다.",
)
def get_comments(schedule_id: int, session: Session = Depends(get_session)):
    return (
        session.execute(
            select(ScheduleComment).where(ScheduleComment.schedule_id == schedule_id)
        )
        .scalars()
        .all()
    )


@router.get(
    "/group/{group_id}/today",
    response_model=list[ScheduleCalendarRead],
    summary="오늘 날짜 기준 일정 조회 (기본값: 오늘의 미완료 일정 조회)",
    description="오늘 날짜의 일정들을 완료 여부에 따라 조회합니다.",
)
def get_today_unfinished_schedules(
    group_id: int,
    is_done: Optional[bool] = Query(
        False, description="완료 여부 (true/false)"
    ),  # 미완료 일정이 기본
    session: Session = Depends(get_session),
):
    today = datetime.utcnow().date()
    start_time = datetime.combine(today, datetime.min.time())  # 00:00:00
    end_time = datetime.combine(today, datetime.max.time())  # 23:59:59

    stmt = (
        select(Schedule)
        .where(Schedule.group_id == group_id)
        .where(Schedule.is_done == is_done)
        .where(Schedule.date >= start_time)
        .where(Schedule.date <= end_time)
        .order_by(Schedule.date.asc())
    )

    return session.execute(stmt).scalars().all()


# 특정 그룹의 다음 일정 1개
@router.get(
    "/groups/{group_id}/upcoming",
    response_model=ScheduleCalendarRead,
    summary="특정 그룹의 다음 일정 조회",
)
def get_upcoming_schedule_by_group(
    group_id: int, session: Session = Depends(get_session)
):
    now = datetime.utcnow()
    stmt = (
        select(Schedule)
        .where(Schedule.group_id == group_id)
        .where(Schedule.date >= now)
        .order_by(Schedule.date.asc())
        .limit(1)
    )
    schedule = session.execute(stmt).scalars().first()

    if not schedule:
        raise HTTPException(404, detail="이 그룹에는 예정된 일정이 없습니다.")
    return ScheduleCalendarRead.model_validate(schedule)
