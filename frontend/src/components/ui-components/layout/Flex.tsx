import React from "react";
import type { TagName } from "@/types";

interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  as?: TagName;
}

function createHTMLElement(props: FlexProps, className: string) {
  return React.createElement(props.as || "div", { className, ...props });
}

function createHTMLElementWithCurry(className: string) {
  return (props: FlexProps) => createHTMLElement(props, className);
}

const ColCenter = createHTMLElementWithCurry(
  "flex flex-col justify-center items-center w-full h-full"
);

const RowCenter = createHTMLElementWithCurry(
  "flex flex-row justify-center items-center w-full"
);

const ColBetweenCenter = createHTMLElementWithCurry(
  "flex flex-col justify-between items-center h-full"
);

const RowBetweenCenter = createHTMLElementWithCurry(
  "flex flex-row justify-between items-center"
);

const ColStartCenter = createHTMLElementWithCurry(
  "flex flex-col justify-start items-center h-full"
);

const RowStartCenter = createHTMLElementWithCurry(
  "flex flex-row justify-start items-center"
);

const ColEndCenter = createHTMLElementWithCurry(
  "flex flex-col justify-end items-center h-full"
);

const RowEndCenter = createHTMLElementWithCurry(
  "flex flex-row justify-end items-center"
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
