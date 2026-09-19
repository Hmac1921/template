import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "../utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[--radius-lg] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--focus-ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--surface] disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[--brand] text-[--on-brand] shadow-[--shadow-button] hover:bg-[--brand-strong]",
  secondary:
    "border border-[--border] bg-[--surface] text-[--ink] hover:bg-[--surface-muted]",
  ghost: "text-[--ink] hover:bg-[--surface-muted]",
  danger: "bg-[--danger] text-white hover:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = ({
  children,
  className,
  disabled,
  fullWidth,
  isLoading = false,
  leadingIcon,
  size = "md",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      aria-busy={isLoading || undefined}
      className={cx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={isDisabled}
      type={type}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : (
        leadingIcon
      )}

      {children ? (
        <span className="inline-flex items-center">{children}</span>
      ) : null}

      {!isLoading && trailingIcon ? <span>{trailingIcon}</span> : null}
    </button>
  );
};
