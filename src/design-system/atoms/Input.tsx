import { useId, type ComponentPropsWithoutRef } from "react";

import { cx } from "../utils";

type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "disabled" | "size"
> & {
  errorMessage?: string;
  hasError?: boolean;
  hint?: string;
  isDisabled?: boolean;
  label?: string;
  uiSize?: InputSize;
};

const baseClasses =
  "w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-60";

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12 text-base",
};

export const Input = ({
  className,
  errorMessage,
  hasError,
  hint,
  id,
  isDisabled = false,
  label,
  uiSize = "md",
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const isInvalid = Boolean(errorMessage) || hasError;

  return (
    <div className={cx("space-y-2", className)}>
      {label ? (
        <label
          className={cx(
            "block text-xs font-medium uppercase tracking-[0.18em]",
            isDisabled ? "text-ink-muted" : "text-brand",
          )}
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}

      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        className={cx(
          baseClasses,
          sizeClasses[uiSize],
          isInvalid &&
            "border-danger focus-visible:ring-[rgba(194,65,12,0.35)]",
          isDisabled && "cursor-not-allowed opacity-60",
          className,
        )}
        disabled={isDisabled}
        id={inputId}
      />

      {hint ? (
        <p className="text-xs text-ink-muted" id={hintId}>
          {hint}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="text-xs font-medium text-danger" id={errorId}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};
