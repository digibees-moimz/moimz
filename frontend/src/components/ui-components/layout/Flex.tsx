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

export const Flex = {};
