# src/models/group.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Group(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = Field(default=None, description="그룹 대표 이미지 URL")

    # 양방향 관계 설정
    account: Optional["GroupAccount"] = Relationship(back_populates="group")
    members: List["Member"] = Relationship(back_populates="group")
    schedules: List["Schedule"] = Relationship(back_populates="group")
    diaries: List["Diary"] = Relationship(back_populates="group")
    boards: List["Board"] = Relationship(back_populates="group")
    # photos: List["Photo"] = Relationship(back_populates="group")

class Member(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    group_id: int = Field(foreign_key="group.id")
    role: str = Field(default="MEMBER", description="예: LEADER, MEMBER 등")
    
    # 양방향 관계 설정
    user: Optional["User"] = Relationship(back_populates="members")
    group: Optional["Group"] = Relationship(back_populates="members")