import { Flex } from "@/components/ui-components/layout/Flex";
import { Grid } from "@/components/ui-components/layout/Grid";

export default function TestGridPage() {
  const items = Array.from({ length: 10 }, (_, idx) => idx + 1);

  return (
    <>
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
