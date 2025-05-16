# src/models/user.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    email: str
    profile_image_url: Optional[str]
    
    # 계좌 관련
    accounts: List["UserAccount"] = Relationship(back_populates="user")

    # 일정 관련
    schedules: List["Schedule"] = Relationship(back_populates="user")
    schedule_comments: List["ScheduleComment"] = Relationship(back_populates="user")

    # 게시판/다이어리 관련
    boards: List["Board"] = Relationship(back_populates="user")
    diaries: List["Diary"] = Relationship(back_populates="user")

    # 모임 멤버
    members: List["Member"] = Relationship(back_populates="user")
    transaction_participations: List["TransactionParticipant"] = Relationship(back_populates="user")
    # 얼굴 등록 및 인물 앨범 관련
    # photos: List["Photo"] = Relationship(back_populates="user")
    # face_videos: List["FaceVideo"] = Relationship(back_populates="user")
    # face_encodings: List["FaceEncoding"] = Relationship(back_populates="user")
    # person_infos: List["PersonInfo"] = Relationship(back_populates="user")

class UserAccount(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    account_name: str
    account_number: str
    balance: float = 0.0

    user: Optional["User"] = Relationship(back_populates="accounts")  # 역참조용
    lockins: List["LockIn"] = Relationship(back_populates="user_account")
    group_transactions: List["GroupTransaction"] = Relationship(back_populates="user_account")