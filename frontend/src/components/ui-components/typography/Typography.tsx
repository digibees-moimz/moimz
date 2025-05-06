import { createHTMLElementWithCurry } from "../shared/createElementWithClassName";

// Title 계열
const Display = createHTMLElementWithCurry(
  "text-4xl sm:text-5xl font-bold leading-tight",
  "h1"
);
const Heading1 = createHTMLElementWithCurry(
  "text-3xl sm:text-4xl font-bold leading-tight",
  "h1"
);
const Heading2 = createHTMLElementWithCurry(
  "text-2xl sm:text-3xl font-semibold leading-snug",
  "h2"
);
const Heading3 = createHTMLElementWithCurry(
  "text-xl sm:text-2xl font-semibold leading-snug",
  "h3"
);

const Heading4 = createHTMLElementWithCurry(
  "text-lg sm:text-xl font-semibold leading-snug",
  "h3"
);

// Body 계열
const BodyLarge = createHTMLElementWithCurry("text-lg leading-relaxed", "p");
const Body = createHTMLElementWithCurry("text-base leading-relaxed", "p");
const BodySmall = createHTMLElementWithCurry("text-sm leading-normal", "p");

// Supporting 계열
const Caption = createHTMLElementWithCurry(
  "text-xs text-gray-500 leading-normal",
  "span"
);
const Label = createHTMLElementWithCurry(
  "text-sm font-medium text-gray-700",
  "label"
);

export const Typography = {
  Display,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  BodyLarge,
  Body,
  BodySmall,
  Caption,
  Label,
};
