import {
  type HTMLAttributes,
  type Ref,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "../atoms";
import { cx } from "../utils";

type DialogSize = "sm" | "md" | "lg";

type BaseDialogProps = {
  children: ReactNode;
  closeLabel?: string;
  description?: ReactNode;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  size?: DialogSize;
  title: ReactNode;
};

export type ScreenDialogProps = BaseDialogProps & {
  overlayClassName?: string;
};

export type ParentDialogProps = BaseDialogProps & {
  overlayClassName?: string;
  parent: ReactNode;
  wrapperClassName?: string;
};

export type InlineDialogProps = BaseDialogProps & {
  parent: ReactNode;
  wrapperClassName?: string;
};

type DialogPanelProps = Omit<BaseDialogProps, "open"> &
  Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
    describedBy?: string;
    labelledBy: string;
    modal?: boolean;
    ref?: Ref<HTMLDivElement>;
  };

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

const overlayClasses = "absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]";
const panelSurfaceClasses =
  "bg-surface dark:bg-surface-dark [html[data-color-mode='dark']_&]:bg-surface-dark";

function useDialogDismiss(open: boolean, onOpenChange: (open: boolean) => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      const focusTarget = panel?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      (focusTarget ?? panel)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [onOpenChange, open]);

  return panelRef;
}

function DialogPanel({
  children,
  className,
  closeLabel = "Close dialog",
  describedBy,
  description,
  footer,
  labelledBy,
  modal = true,
  onOpenChange,
  ref,
  size = "md",
  title,
  ...props
}: DialogPanelProps) {
  return (
    <section
      {...props}
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      aria-modal={modal ? "true" : undefined}
      className={cx(
        "relative z-10 flex max-h-[calc(100vh-2rem)] w-[min(calc(100vw-2rem),100%)] flex-col overflow-hidden rounded-lg border border-border text-ink shadow-[0_24px_80px_-34px_rgba(15,23,42,0.75)] outline-none",
        panelSurfaceClasses,
        sizeClasses[size],
        className,
      )}
      ref={ref}
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={cx(
          "surface-gradient shrink-0 border-b border-border px-5 py-4 sm:px-6",
          panelSurfaceClasses,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              className="font-display text-xl font-semibold text-ink"
              id={labelledBy}
            >
              {title}
            </h2>
            {description ? (
              <p
                className="mt-1 max-w-prose text-sm leading-6 text-ink-muted"
                id={describedBy}
              >
                {description}
              </p>
            ) : null}
          </div>
          <Button
            aria-label={closeLabel}
            className="h-9 w-9 shrink-0 rounded-full px-0"
            onClick={() => onOpenChange(false)}
            variant="ghost"
          >
            x
          </Button>
        </div>
      </div>

      <div className={cx("min-h-0 flex-1 overflow-auto px-5 py-5 sm:px-6", panelSurfaceClasses)}>
        {children}
      </div>

      {footer ? (
        <div
          className={cx(
            "flex shrink-0 flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6",
            panelSurfaceClasses,
          )}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export function ScreenDialog({
  onOpenChange,
  open,
  overlayClassName,
  ...props
}: ScreenDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useDialogDismiss(open, onOpenChange);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        aria-label="Close dialog"
        className={cx("fixed inset-0 z-0 cursor-default", overlayClasses, overlayClassName)}
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <DialogPanel
        {...props}
        describedBy={props.description ? descriptionId : undefined}
        labelledBy={titleId}
        onOpenChange={onOpenChange}
        ref={panelRef}
      />
    </div>,
    document.body,
  );
}

export function ParentDialog({
  onOpenChange,
  open,
  overlayClassName,
  parent,
  wrapperClassName,
  ...props
}: ParentDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useDialogDismiss(open, onOpenChange);

  return (
    <div className={cx("relative overflow-hidden rounded-lg", wrapperClassName)}>
      {parent}

      {open ? (
        <div className="absolute inset-0 z-10">
          <button
            aria-label="Close dialog"
            className={cx("z-0", overlayClasses, overlayClassName)}
            onClick={() => onOpenChange(false)}
            type="button"
          />
          <DialogPanel
            {...props}
            className="h-full max-h-full w-full max-w-none rounded-lg"
            describedBy={props.description ? descriptionId : undefined}
            labelledBy={titleId}
            onOpenChange={onOpenChange}
            ref={panelRef}
          />
        </div>
      ) : null}
    </div>
  );
}

export function InlineDialog({
  onOpenChange,
  open,
  parent,
  wrapperClassName,
  ...props
}: InlineDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useDialogDismiss(open, onOpenChange);

  return (
    <div className={wrapperClassName}>
      {open ? (
        <DialogPanel
          {...props}
          describedBy={props.description ? descriptionId : undefined}
          labelledBy={titleId}
          modal={false}
          onOpenChange={onOpenChange}
          ref={panelRef}
        />
      ) : (
        parent
      )}
    </div>
  );
}
