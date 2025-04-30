import { createHTMLElementWithCurry } from "../shared/createElementWithClassName";

// 기본 Grid
const BaseGrid = createHTMLElementWithCurry("grid gap-4");

// 고정 열수
const Col2 = createHTMLElementWithCurry("grid grid-cols-2 gap-4");
const Col3 = createHTMLElementWithCurry("grid grid-cols-3 gap-4");
const Col4 = createHTMLElementWithCurry("grid grid-cols-4 gap-4");
const Col7 = createHTMLElementWithCurry("grid grid-cols-7 gap-4");

// 반응형 AutoGrid
const AutoCols = createHTMLElementWithCurry(
  "grid gap-4 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
);

export const Grid = {
  Grid: BaseGrid,
  Col2,
  Col3,
  Col4,
  Col7,
  AutoCols,
};
