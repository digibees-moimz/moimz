import { Flex } from "@/components/ui-components/layout/Flex";
import { Grid } from "@/components/ui-components/layout/Grid";
import { Typography } from "@/components/ui-components/typography/Typography";

export default function TestGridPage() {
  const items = Array.from({ length: 10 }, (_, idx) => idx + 1);

  return (
    <>
      <section>
        <div className="space-y-6">
          <Typography.Display>메인 타이틀</Typography.Display>

          <Typography.Heading1>페이지 제목</Typography.Heading1>

          <Typography.Heading2>섹션 제목</Typography.Heading2>

          <Typography.Heading3>소제목</Typography.Heading3>

          <Typography.Body>
            여기는 일반 본문입니다. 줄바꿈도 자연스럽게 됩니다.
            <br />두 번째 줄입니다.
          </Typography.Body>

          <Typography.BodySmall>
            덜 강조된 작은 본문입니다.
          </Typography.BodySmall>

          <Typography.Caption>캡션(날짜, 주석 등)입니다.</Typography.Caption>

          <Typography.Label>입력폼 라벨</Typography.Label>
        </div>
      </section>
      {/* 기본 Grid */}
      <section>
        <h2 className="text-xl font-bold mb-4">기본 Grid (gap-4)</h2>
        <Grid.Grid>
          {items.map((item) => (
            <div
              key={item}
              className="bg-blue-100 p-6 text-center rounded shadow"
            >
              Item {item}
            </div>
          ))}
        </Grid.Grid>
      </section>

      {/* 고정 열수 Grid */}
      <section>
        <h2 className="text-xl font-bold mb-4">Grid.Col3 (3열)</h2>
        <Grid.Col3>
          {items.map((item) => (
            <Flex.RowCenter
              key={item}
              className="bg-green-100 p-6 text-center rounded shadow aspect-square"
            >
              Item {item}
            </Flex.RowCenter>
          ))}
        </Grid.Col3>
      </section>

      {/* 반응형 AutoGrid */}
      <section>
        <h2 className="text-xl font-bold mb-4">Grid.AutoGrid (반응형)</h2>
        <Grid.AutoCols className="min-[400px]:grid-cols-2 min-[640px]:grid-cols-3">
          {items.map((item) => (
            <div
              key={item}
              className="bg-pink-100 p-6 text-center rounded shadow"
            >
              Item {item}
            </div>
          ))}
        </Grid.AutoCols>
      </section>
    </>
  );
}
