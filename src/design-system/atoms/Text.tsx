import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cx } from "../utils";

export type TextColor = "primary" | "secondary";
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children?: ReactNode;
  color?: TextColor;
  size?: TextSize;
};

const sizeClasses: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const colorClasses: Record<TextColor, string> = {
  primary: "text-[--ink]",
  secondary: "text-[--ink-muted]",
};

export const Text = ({
  as: Component = "p",
  children,
  className,
  color = "primary",
  size = "md",
  ...props
}: TextProps) => {
  return (
    <Component
      {...props}
      className={cx(
        "leading-relaxed",
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    >
      {children}
    </Component>
  );
};
