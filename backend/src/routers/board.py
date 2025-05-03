# src/routers/board.py

from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from src.core.database import engine
from src.models.board import Board
from src.schemas.board import BoardCreate, BoardRead

router = APIRouter(prefix="/board", tags=["Board"])

@router.post(
    "",
    response_model=BoardRead,
    status_code=status.HTTP_201_CREATED,
    summary="커뮤니티 게시글 작성",
    description="새 게시글을 작성합니다.",
)
def create_board_post(data: BoardCreate):
    with Session(engine) as session:
        post = Board(**data.dict())
        session.add(post)
        session.commit()
        session.refresh(post)
        return post

@router.get(
    "/group/{group_id}",
    response_model=list[BoardRead],
    summary="해당 모임 커뮤니티 게시글 조회",
    description="특정 그룹에 속한 게시글 목록을 조회합니다.",
)
def get_group_board_posts(group_id: int):
    with Session(engine) as session:
        posts = session.exec(
            select(Board).where(Board.group_id == group_id)
        ).all()
        return posts

@router.get(
    "/{post_id}",
    response_model=BoardRead,
    summary="특정 게시글 조회",
    description="게시글 ID를 기준으로 특정 게시글의 상세 내용을 조회합니다.",
)
def get_board_post(post_id: int):
    with Session(engine) as session:
        post = session.get(Board, post_id)
        if not post:
            raise HTTPException(404, "Post not found")
        return post

@router.patch(
    "/{post_id}",
    response_model=BoardRead,
    summary="게시글 수정",
    description="게시글 ID를 기준으로 게시글 내용을 수정합니다.",
)
def update_board_post(post_id: int, update_data: dict):
    with Session(engine) as session:
        post = session.get(Board, post_id)
        if not post:
            raise HTTPException(404, "Post not found")
        for key, value in update_data.items():
            setattr(post, key, value)
        session.commit()
        session.refresh(post)
        return post

@router.delete(
    "/{post_id}",
    summary="게시글 삭제",
    description="게시글 ID를 기준으로 게시글을 삭제합니다.",
)
def delete_board_post(post_id: int):
    with Session(engine) as session:
        post = session.get(Board, post_id)
        if not post:
            raise HTTPException(404, "Post not found")
        session.delete(post)
        session.commit()
        return {"ok": True}
