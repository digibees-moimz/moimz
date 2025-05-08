# src/services/group/service.py

import os
import base64
from datetime import datetime
from PIL import Image
from io import BytesIO
import random
from typing import Dict
from sqlmodel import Session, select
from src.models.group import MoimScore
from src.prompts.sd_template import prompt_data
from src.utils.score_utils import get_level_from_score
import random

STYLE_PRESETS = {
    "dandi": {
        "lora": "<lora:dandi_style:1>",
        "base": "(full body:1.2), 3D, "
                "a cute round blue bird character,"
                " centered composition, white background,"
                " chibi style, smooth shading, adorable,"
                " best quality, masterpiece, extremely detailed"
    },
    "ddokdi": {
        "lora": "<lora:ddokdi_style:1>",
        "base": "(full body:1.2), 3D, "
                "a cute round blue bird character with white face, red flower,"
                " centered composition, plain background,"
                " chibi style, smooth shading, adorable,"
                " best quality, masterpiece, extremely detailed"
    },
    "woodi": {
        "lora": "<lora:w00di_style:1.0>",
        "base": "(full body:1.2), 3D, large green afro, dark skin, cool expression, narrowed eyes, deadpan," 
                "a tree character,"
                " centered composition, plain background,"
                " chibi style, smooth shading,"
                " best quality, masterpiece, extremely detailed"
    },
}

def save_moim_character_image(image_base64: str, group_id: int) -> str:
    """
    Base64 문자열로 전달된 이미지를 서버에 저장하고,
    프론트에서 접근 가능한 경로(/media/...)를 반환합니다.
    """
    # 1. 저장 파일명 및 디렉토리 설정
    filename = f"char_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    relative_dir = f"media/moim_characters/{group_id}"
    os.makedirs(relative_dir, exist_ok=True)

    # 2. 이미지 디코딩 및 저장
    full_path = os.path.join(relative_dir, filename)
    try:
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        image.save(full_path)
    except Exception as e:
        raise RuntimeError("이미지 저장 중 오류 발생") from e

    # 3. URL 경로 반환 (프론트에서 접근 가능해야 함)
    return f"/{full_path}"


def generate_prompt_from_scores(group_id: int, session: Session) -> Dict[str, str]:
    # ── 1) 점수 레코드 조회
    score_row: MoimScore | None = session.execute(
        select(MoimScore).where(MoimScore.group_id == group_id)
    ).scalars().first()

    if not score_row:          # 점수가 없으면 dining Lv1 기본
        top_cat, top_level = "dining", 1
    else:
        score_dict = score_row.model_dump(exclude={"id", "group_id", "created_at"})
        top_cat = max(score_dict, key=score_dict.get)
        top_level = get_level_from_score(score_dict[top_cat])

    # ── 2) 카테고리·레벨 키워드 랜덤 선택
    keywords_pool = prompt_data[top_cat].get(top_level) or prompt_data[top_cat][1]
    keywords = random.choice(keywords_pool)

    # ── 3) 스타일(단디/똑디/우디) 랜덤 선정
    style_key = random.choice(list(STYLE_PRESETS.keys()))
    preset = STYLE_PRESETS[style_key]          # {'lora':..., 'base':...}

    # ── 4) 최종 프롬프트 조립
    prompt = f"{preset['lora']}, {preset['base']}, {keywords}"
    negative_prompt = (
        "text, logo, title, watermark, signature,"
        "cafe menu, extra objects, "
        "mutation, deformed, ugly, "
        "realistic, photo, "
        "lowres, bad anatomy, wrong anatomy, blurry, nsfw"
    )

    return {
        "category": top_cat,
        "level": top_level,
        "style": style_key,
        "prompt": prompt,
        "negative_prompt": negative_prompt,
    }