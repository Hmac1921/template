import { type RefObject, useEffect } from "react";
import { useEventCallback } from "./useEventCallback";

export const useClickAway = (
  ref: RefObject<HTMLElement | null>,
  handleOnClickOutside: (event: Event) => void,
) => {
  const handleOutsideInteraction = useEventCallback((event: Event) => {
    if (!ref.current || ref.current.contains(event.target as Node)) {
      return;
    }

    handleOnClickOutside(event);
  });

  useEffect(() => {
    function listener(event: Event) {
      handleOutsideInteraction(event);
    }

    document.addEventListener("pointerdown", listener);
    document.addEventListener("focusin", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
      document.removeEventListener("focusin", listener);
    };
  }, [handleOutsideInteraction, ref]);
};
