# src/models/group.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

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
    characters: List["MoimCharacter"] = Relationship(back_populates="group")
    score: Optional["MoimScore"] = Relationship(
        back_populates="group",
        sa_relationship_kwargs={"uselist": False},  # 1:1로 고정
    )
    # photos: List["Photo"] = Relationship(back_populates="group")

class Member(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    group_id: int = Field(foreign_key="group.id")
    role: str = Field(default="MEMBER", description="예: LEADER, MEMBER 등")
    
    # 양방향 관계 설정
    user: Optional["User"] = Relationship(back_populates="members")
    group: Optional["Group"] = Relationship(back_populates="members")


# 캐릭터 가져와서 저장할 테이블
class MoimCharacter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id")
    image_url: str = Field(description="생성된 캐릭터 이미지 URL")
    is_representative: bool = Field(default=False, description="대표 캐릭터 여부")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    group: Optional["Group"] = Relationship(back_populates="characters")

# 그룹별 모임 스코어 저장할 테이블
class MoimScore(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    group_id: int = Field(foreign_key="group.id", index=True)

    dining: int = Field(default=0)
    cafe: int = Field(default=0)
    drinks: int = Field(default=0)
    sports_outdoor: int = Field(default=0)
    culture: int = Field(default=0)
    travel: int = Field(default=0)
    shopping: int = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    group: Optional["Group"] = Relationship(back_populates="score")
