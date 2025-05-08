# src/routers/group.py
# 기존 summary / description 보존 + 중복 쿼리 최소화 버전

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session, select, exists
from sqlalchemy import text
from src.core.database import engine, get_session, SD_API_URL
from src.models.group import Group, Member, MoimCharacter, MoimScore
from src.models.group_account import GroupAccount
from src.models.user import User
from src.schemas.group import (
    GroupCreate,
    GroupRead,
    GroupUpdate,
    GroupJoin,
    GroupLeave,
    CharacterImageUpload, 
    CharacterRead,
)
from src.routers._helpers import get_group
from src.services.group.service import (
    save_moim_character_image,
    generate_prompt_from_scores,
)
import random
import requests

router = APIRouter(prefix="/groups", tags=["Groups"])


# ───────────────────────── 계좌번호 util
def _generate_account_number() -> str:
    yyy = f"{random.randint(0, 999):03d}"
    zz = f"{random.randint(0, 99):02d}"
    zzzzzz = f"{random.randint(0, 999999):06d}"
    c = random.randint(0, 9)
    return f"{yyy}-{zz}-{zzzzzz}-{c}"


# ───────────────────────── 모임 생성
@router.post(
    "",
    response_model=GroupRead,
    status_code=status.HTTP_201_CREATED,
    summary="모임 생성",
    description="새로운 모임을 생성하고, 동시에 전용 그룹 계좌도 만듭니다.",
)
def create_group(dto: GroupCreate):
    with Session(engine) as s:
        grp = Group.model_validate(dto)
        s.add(grp)
        s.commit()
        s.refresh(grp)

        s.add(
            GroupAccount(
                group_id=grp.id,
                account_number=_generate_account_number(),
            )
        )
        s.add(
            MoimScore(group_id=grp.id)
        )

        s.commit()
        return GroupRead.model_validate(grp, from_attributes=True)


# ───────────────────────── 전체 모임 목록
@router.get(
    "",
    response_model=List[GroupRead],
    summary="전체 모임 조회",
    description="전체 모임(Group) 목록을 조회합니다.",
)
def get_groups(session: Session = Depends(get_session)):
    rows = session.execute(select(Group)).scalars().all()
    return [GroupRead.model_validate(r, from_attributes=True) for r in rows]


# ───────────────────────── 모임 정보 수정
@router.patch(
    "/{group_id}",
    response_model=GroupRead,
    summary="모임 정보 수정",
    description="모임 이름, 설명, 카테고리, 대표 이미지를 수정합니다.",
)
def update_group(group_id: int, dto: GroupUpdate):
    with Session(engine) as s:
        grp = get_group(s, group_id)
        for k, v in dto.model_dump(exclude_unset=True).items():
            setattr(grp, k, v)
        s.commit()
        s.refresh(grp)
        return GroupRead.model_validate(grp, from_attributes=True)


# ───────────────────────── 모임 가입
@router.post(
    "/members",
    summary="모임 가입",
    description="사용자가 특정 모임에 멤버로 가입합니다.",
)
def join_group(dto: GroupJoin):
    with Session(engine) as s:
        # 유저·그룹 존재 검사
        if not s.execute(select(exists().where(User.id == dto.user_id))).scalar_one():
            raise HTTPException(404, "존재하지 않는 유저입니다.")
        if not s.execute(select(exists().where(Group.id == dto.group_id))).scalar_one():
            raise HTTPException(404, "존재하지 않는 모임입니다.")

        # 중복 가입 검사
        dup = s.execute(
            select(exists().where(Member.user_id == dto.user_id, Member.group_id == dto.group_id))
        ).scalar_one()
        if dup:
            raise HTTPException(400, "이미 가입한 모임입니다.")

        s.add(Member(**dto.model_dump()))
        s.commit()
        return {"message": "모임에 가입되었습니다"}


# ───────────────────────── 모임 탈퇴
@router.delete(
    "/members",
    summary="모임 탈퇴",
    description="사용자가 특정 모임에서 탈퇴합니다.",
)
def leave_group(dto: GroupLeave):
    with Session(engine) as s:
        member = s.execute(
            select(Member)
            .where(Member.user_id == dto.user_id, Member.group_id == dto.group_id)
        ).scalars().first()
        if not member:
            raise HTTPException(404, "가입된 모임이 없습니다.")

        s.delete(member)
        s.commit()
        return {"message": "모임에서 탈퇴되었습니다"}


# ───────────────────────── 멤버 조회
@router.get(
    "/{group_id}/members",
    summary="특정 모임 멤버 조회",
    description="특정 그룹에 소속된 멤버들의 목록을 조회합니다.",
)
def get_group_members(group_id: int, session: Session = Depends(get_session)):
    get_group(session, group_id) 
    return session.execute(select(Member).where(Member.group_id == group_id)).scalars().all()


# ───────────────────────── 멤버 ID만 조회
@router.get(
    "/{group_id}/members/id",
    response_model=List[int],
    summary="특정 모임 멤버 ID 목록 조회",
    description="특정 그룹의 멤버 user_id 목록을 조회합니다.",
)
def get_member_ids(group_id: int, session: Session = Depends(get_session)):
    ids = session.execute(
        select(Member.user_id).where(Member.group_id == group_id)
    ).scalars().all()
    if not ids:
        raise HTTPException(404, "해당 그룹에 멤버가 없습니다.")
    return ids


# ───────────────────────── 캐릭터 생성 및 저장
@router.post(
    "/{group_id}/generate-character",
    response_model=CharacterRead,
    summary="SD 기반 캐릭터 생성 및 저장",
    description="모임 데이터를 바탕으로 캐릭터 생성 → 저장 후 대표 캐릭터로 등록합니다.",
)
def generate_character(group_id: int, session: Session = Depends(get_session)):
    group = get_group(session, group_id)

    try:
        # 1️⃣ session 넘겨서 호출
        result = generate_prompt_from_scores(group_id, session)
        print("🎯 프롬프트:", result["prompt"])
        print("🎯 네거티브:", result["negative_prompt"])
        payload = {
            "prompt": result["prompt"],
            "negative_prompt": result["negative_prompt"],
            "steps": 25,
            "sampler_index": "Euler a",
            "enable_hr": True,
            "hr_scale": 2,
            "denoising_strength": 0.7,
            "hr_upscaler": "Latent",
            "width": 512,
            "height": 512,
        }

        txt2img_url = f"{SD_API_URL}/sdapi/v1/txt2img"
        response = requests.post(txt2img_url, json=payload)
        response.raise_for_status()
        image_base64 = response.json()["images"][0]

        # 2️⃣ 저장
        image_url = save_moim_character_image(image_base64, group_id)

        # 3️⃣ 기존 대표 플래그 초기화
        session.execute(
            text(
                "UPDATE moimcharacter "
                "SET is_representative = false "
                "WHERE group_id = :gid"
            ),
            {"gid": group_id},
        )

        # 4️⃣ 새로운 레코드 & 그룹 대표 이미지 갱신
        new_char = MoimCharacter(
            group_id=group_id,
            image_url=image_url,
            is_representative=True,
        )
        session.add(new_char)
        group.image_url = image_url

        session.commit()
        session.refresh(new_char)
        return CharacterRead.model_validate(new_char, from_attributes=True)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"캐릭터 생성 실패: {e}")