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
- 참석 인원: {group_data.get('attendees_num')} / 전체 모임 인원: {group_data.get('group_member_num')}
- 참석자: {', '.join(group_data.get('attendees'))}
- 불참자: {', '.join(set(group_data.get('group_member')) - set(group_data.get('attendees')))}

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
