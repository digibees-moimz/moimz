import { createHTMLElementWithCurry } from "../shared/createElementWithClassName";

// Title 계열
const Display = createHTMLElementWithCurry(
  "text-4xl sm:text-5xl font-bold leading-tight"
);
const Heading1 = createHTMLElementWithCurry(
  "text-3xl sm:text-4xl font-bold leading-tight"
);
const Heading2 = createHTMLElementWithCurry(
  "text-2xl sm:text-3xl font-semibold leading-snug"
);
const Heading3 = createHTMLElementWithCurry(
  "text-xl sm:text-2xl font-semibold leading-snug"
);

// Body 계열
const BodyLarge = createHTMLElementWithCurry("text-lg leading-relaxed");
const Body = createHTMLElementWithCurry("text-base leading-relaxed");
const BodySmall = createHTMLElementWithCurry("text-sm leading-normal");

// Supporting 계열
const Caption = createHTMLElementWithCurry(
  "text-xs text-gray-500 leading-normal"
);
const Label = createHTMLElementWithCurry("text-sm font-medium text-gray-700");

export const Typography = {
  Display,
  Heading1,
  Heading2,
  Heading3,
  BodyLarge,
  Body,
  BodySmall,
  Caption,
  Label,
};
