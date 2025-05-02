import React from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "white" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isDisabled?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#7DB5FF] text-white font-bold hover:bg-[#4a86e0]",
  secondary: "bg-[#22BD9C] text-white font-bold hover:bg-[#1B8871]",
  white: "bg-[#ffffff] text-gray-600 font-bold hover:bg-[#e9e9e9]",
  destructive: "bg-[#FC9DB3] text-white font-bold hover:bg-[#EB728E]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-3 text-base",
  md: "h-12 px-4 text-base",
  lg: "h-14 px-5 text-xl",
  icon: "h-10 w-10 p-2",
};

export const Button = ({
  variant = "primary",
  size = "md",
  isDisabled,
  fullWidth = true,
  iconOnly,
  leftIcon,
  rightIcon,
  children,
  className,
  ...rest
}: ButtonProps) => {
  const mergedClass = twMerge(
    "inline-flex items-center justify-center font-medium rounded-lg transition",
    fullWidth ? "w-full" : "w-fit",
    iconOnly && "p-2 justify-center",
    isDisabled
      ? "bg-[#E6E6E6] text-white font-bold cursor-not-allowed pointer-events-none"
      : variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button className={mergedClass} disabled={isDisabled} {...rest}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {!iconOnly && <span>{children}</span>}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
