import React from "react";
import type { TagName } from "@/types";
import { twMerge } from "tailwind-merge";

interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  as?: TagName;
}

function createHTMLElement(props: FlexProps, className: string) {
  const { as, className: propsClassName, ...restProps } = props;
  // tailwind-merge를 사용하여 기본 클래스와 props로 전달된 클래스를 병합
  const mergedClassName = twMerge(className, propsClassName);

  return React.createElement(as || "div", {
    className: mergedClassName,
    ...restProps,
  });
}

function createHTMLElementWithCurry(className: string) {
  return (props: FlexProps) => createHTMLElement(props, className);
}

const ColCenter = createHTMLElementWithCurry(
  "flex flex-col justify-center items-center w-full"
);

const RowCenter = createHTMLElementWithCurry(
  "flex flex-row justify-center items-center w-full"
);

const ColBetweenCenter = createHTMLElementWithCurry(
  "flex flex-col justify-between items-center"
);

const RowBetweenCenter = createHTMLElementWithCurry(
  "flex flex-row justify-between items-center"
);

const ColStartCenter = createHTMLElementWithCurry(
  "flex flex-col justify-start items-center"
);

const RowStartCenter = createHTMLElementWithCurry(
  "flex flex-row justify-start items-center"
);

const ColEndCenter = createHTMLElementWithCurry(
  "flex flex-col justify-end items-center"
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
