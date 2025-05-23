import React from "react";
import type { TagName } from "@/types";
import { twMerge } from "tailwind-merge";

export interface BaseProps extends React.HTMLAttributes<HTMLElement> {
  as?: TagName;
}

export function createHTMLElement(
  props: BaseProps,
  className: string,
  defaultTag: TagName = "div"
) {
  const { as, className: propsClassName, ...restProps } = props;
  // 기본 클래스와 props로 전달된 클래스 병합
  const mergedClassName = twMerge(className, propsClassName);

  return React.createElement(as || defaultTag, {
    className: mergedClassName,
    ...restProps,
  });
}

export function createHTMLElementWithCurry(
  className: string,
  defaultTag: TagName = "div"
) {
  return (props: BaseProps) => createHTMLElement(props, className, defaultTag);
}
