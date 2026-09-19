import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cx } from "../utils";

export type HeaderColor = "primary" | "secondary";
export type HeaderSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type HeaderProps = HTMLAttributes<HTMLElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children?: ReactNode;
  color?: HeaderColor;
  size?: HeaderSize;
};

const sizeClasses: Record<HeaderSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

const colorClasses: Record<HeaderColor, string> = {
  primary: "text-[--ink]",
  secondary: "text-[--ink-muted]",
};

export const Header = ({
  as: Component = "h2",
  children,
  className,
  color = "primary",
  size = "lg",
  ...props
}: HeaderProps) => {
  return (
    <Component
      {...props}
      className={cx(
        "font-semibold leading-tight tracking-tight",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    >
      {children}
    </Component>
  );
};
