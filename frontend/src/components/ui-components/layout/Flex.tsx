import { createHTMLElementWithCurry } from "../shared/createElementWithClassName";

const ColCenter = createHTMLElementWithCurry(
  "flex flex-col justify-center items-center w-full h-full"
);

const RowCenter = createHTMLElementWithCurry(
  "flex flex-row justify-center items-center w-full h-full"
);

const ColBetweenCenter = createHTMLElementWithCurry(
  "flex flex-col justify-between items-center h-full"
);

const RowBetweenCenter = createHTMLElementWithCurry(
  "flex flex-row justify-between items-center h-full"
);

const ColStartCenter = createHTMLElementWithCurry(
  "flex flex-col justify-start items-center h-full"
);

const RowStartCenter = createHTMLElementWithCurry(
  "flex flex-row justify-start items-center h-full"
);

const ColEndCenter = createHTMLElementWithCurry(
  "flex flex-col justify-end items-center h-full"
);

const RowEndCenter = createHTMLElementWithCurry(
  "flex flex-row justify-end items-center h-full"
);

export const Flex = {
  ColCenter,
  RowCenter,
  ColBetweenCenter,
  RowBetweenCenter,
  ColStartCenter,
  RowStartCenter,
  ColEndCenter,
  RowEndCenter,
};
