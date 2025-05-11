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

    prompt += """\n이 정보를 참고해서 위 규칙을 완벽히 지켜서 재미있는 모임 일기를 작성해줘.
    출력할 때는 반드시 모든 줄바꿈(\n)을 문자열 안에서는 \\n으로 이스케이프해서 JSON 파싱이 되게 해줘.
    아래 항목들을 한 번에 모두 작성해줘:
        1. 제목(title): 공백 포함 30자 이내, '# ' 없이 한 줄로만. 모임비 언급은 제외하고 활동 위주로 귀엽고 센스 있는 느낌!
        2. 본문(body): 위 규칙에 따라 공백 포함 900자~1300자 사이로 작성.
        3. 요약(summary): 본문의 분위기를 살려 2~3문장 요약, 공백 포함 200자~400자 사이로 작성.
        4. 해시태그(hashtags): 본문 내용을 기반으로 캐주얼하게, 5~8개. '#' 포함, 문자열 배열(JSON list)로 작성.

        🎯 출력 형식은 반드시 다음 JSON 형식을 따라줘:
        ```json
        {{
          "title": "...",
          "body": "...",
          "summary": "...",
          "hashtags": "..."
        }}```
 """

    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=2500,
        temperature=0.7,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.content
