# src/utils/score_utils.py

# 점수 → 레벨 (1~5) 변환
def get_level_from_score(score: int) -> int:
    if score >= 400:
        return 5
    if score >= 300:
        return 4
    if score >= 200:
        return 3
    if score >= 100:
        return 2
    return 1
