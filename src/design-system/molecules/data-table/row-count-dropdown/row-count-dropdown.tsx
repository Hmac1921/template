import { useEffect, useRef, useState } from "react";

import { useClickAway } from "../../../../hooks/useClickAway";

type GTRowCountDropdownProps = {
  pageCount: number;
  type?: string;
  onChange: (value: Record<string, number>) => void;
};

const GTRowCountDropdown = ({
  pageCount,
  type = "main",
  onChange,
}: GTRowCountDropdownProps) => {
  const [options, setOptions] = useState<Array<number>>([]);

  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleSelect = (value: number) => {
    setOpen(false);
    onChange({ pageCount: value });
  };

  useClickAway(ref, () => setOpen(false));

  useEffect(() => {
    if (type === "main") {
      setOptions([15, 25, 50, 100]);
    } else {
      setOptions([5, 10, 15]);
    }
  }, [pageCount]);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <input
          id="row-count"
          className="h-9 w-16 rounded-lg border border-border bg-surface text-center text-sm text-ink"
          type="text"
          value={pageCount}
          readOnly
        />
        <button
          type="button"
          aria-label="Select row count"
          className="cursor-pointer text-ink transition hover:text-brand-strong"
          onClick={() => setOpen((prev) => !prev)}
        >
          v
        </button>
      </div>
      {open && (
        <ul className="absolute right-0 z-50 mt-2 flex w-20 flex-col overflow-hidden rounded-lg border border-border bg-surface text-sm text-ink shadow-[var(--shadow-card)]">
          {options.length > 0 ? (
            options.map((item, i) => (
              <li
                className="cursor-pointer px-3 py-2 text-center hover:bg-surface-muted"
                key={i}
                onClick={() => handleSelect(item)}
              >
                {item}
              </li>
            ))
          ) : (
            <p className="px-3 py-2">Loading ...</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default GTRowCountDropdown;
