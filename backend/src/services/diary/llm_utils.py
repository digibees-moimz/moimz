import os
import anthropic

# API 키 환경변수로 가져오기
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)


def load_prompt_template():
    with open("src/prompts/diary_template.txt", "r", encoding="utf-8") as f:
        return f.read()


def generate_diary_content(group_data, transactions):
    template = load_prompt_template()

    attendee_names = group_data.get("attendees", [])
    group_member_names = group_data.get("group_member", [])
    absent_names = list(set(group_member_names) - set(attendee_names))

    prompt = (
        template
        + f"""
- 모임 이름: {group_data.get('appoint_name')}
- 모임 날짜: {group_data.get('date')}
- 모임 장소: {group_data.get('location')}
- 전체 인원 수: {group_data.get('group_member_num')}
- 참석 인원 수: {group_data.get('attendees_num')}
- 전체 인원: {', '.join(group_member_names)}
- 참석자: {', '.join(attendee_names)}
- 불참자: {', '.join(absent_names) if absent_names else '없음'}

다음은 모임에서 사용한 결제 내역이야:
"""
    )
    for tx in transactions:
        prompt += f"""
        - 상점 이름: {tx['store_name']}
        - 상점 주소: {tx['store_location']}
        - mcc 코드: {tx['mcc_code']}
        - 결제 금액: {tx['total_amount']}원
        - 결제 일시: {tx['transaction_date']}
        - 추가 정보: {tx['description']}
        """

    prompt += (
        "\n이 정보를 참고해서 위 규칙을 완벽히 지켜서 재미있는 모임 일기를 작성해줘."
    )

    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1500,
        temperature=0.7,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.content


def generate_diary_summary(full_text: str) -> str:
    prompt = f"""
다음은 친구들과의 모임 일기야.
이 일기의 분위기와 감성을 유지하면서 2~3문장으로 요약해줘.
짧고 귀엽고 자연스럽게, 공백 포함 300자 이내로 부탁해!

일기 내용:
{full_text}

요약:
"""
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        temperature=0.7,
        max_tokens=1200,
        messages=[{"role": "user", "content": prompt}],
    )
    if isinstance(response.content, list) and len(response.content) > 0:
        return response.content[0].text  # TextBlock → 텍스트만 추출
    elif isinstance(response.content, str):
        return response.content.strip()
    else:
        return str(response.content)
