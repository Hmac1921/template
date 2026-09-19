import { useEffect, useRef } from "react";

export function useEventCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
) {
  const callbackRef = useRef(callback);
  const stableCallbackRef = useRef((...args: Args) => callbackRef.current(...args));

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return stableCallbackRef.current;
}
