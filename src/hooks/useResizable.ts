import {
  useEffect,
  useReducer,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useEventCallback } from "./useEventCallback";

type ResizableState = {
  dragOriginWidth: number;
  dragStartClientX: number;
  isResizing: boolean;
  width: number;
};

type ResizableAction =
  | { type: "start"; clientX: number }
  | { type: "update"; clientX: number; maxWidth: number; minWidth: number }
  | { type: "commit" }
  | { type: "resize-by"; delta: number; maxWidth: number; minWidth: number }
  | { type: "resize-to-boundary"; boundary: "min" | "max"; maxWidth: number; minWidth: number };

type UseResizableArgs = {
  defaultWidth: number;
  maxWidth: number;
  minWidth: number;
  onResize?: (width: number) => void;
  step?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createInitialState(defaultWidth: number): ResizableState {
  return {
    dragOriginWidth: defaultWidth,
    dragStartClientX: 0,
    isResizing: false,
    width: defaultWidth,
  };
}

function resizableReducer(
  state: ResizableState,
  action: ResizableAction,
): ResizableState {
  switch (action.type) {
    case "start": {
      return {
        ...state,
        dragOriginWidth: state.width,
        dragStartClientX: action.clientX,
        isResizing: true,
      };
    }
    case "update": {
      const nextWidth = clamp(
        state.dragOriginWidth + (action.clientX - state.dragStartClientX),
        action.minWidth,
        action.maxWidth,
      );

      return {
        ...state,
        width: nextWidth,
      };
    }
    case "commit": {
      return {
        ...state,
        isResizing: false,
      };
    }
    case "resize-by": {
      return {
        ...state,
        width: clamp(state.width + action.delta, action.minWidth, action.maxWidth),
      };
    }
    case "resize-to-boundary": {
      return {
        ...state,
        width: action.boundary === "min" ? action.minWidth : action.maxWidth,
      };
    }
    default: {
      return state;
    }
  }
}

export function useResizable({
  defaultWidth,
  maxWidth,
  minWidth,
  onResize,
  step = 16,
}: UseResizableArgs) {
  const [state, dispatch] = useReducer(
    resizableReducer,
    defaultWidth,
    createInitialState,
  );

  const emitResize = useEventCallback((width: number) => {
    onResize?.(width);
  });

  useEffect(() => {
    emitResize(state.width);
  }, [emitResize, state.width]);

  useEffect(() => {
    if (!state.isResizing) {
      return;
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function handlePointerMove(event: globalThis.PointerEvent) {
      dispatch({
        type: "update",
        clientX: event.clientX,
        maxWidth,
        minWidth,
      });
    }

    function stopResize() {
      dispatch({
        type: "commit",
      });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);

    return () => {
      document.body.style.removeProperty("cursor");
      document.body.style.removeProperty("user-select");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };
  }, [maxWidth, minWidth, state.isResizing]);

  function startResizing(clientX: number) {
    dispatch({
      type: "start",
      clientX,
    });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    event.preventDefault();
    startResizing(event.clientX);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        dispatch({
          type: "resize-by",
          delta: step * -1,
          maxWidth,
          minWidth,
        });
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        dispatch({
          type: "resize-by",
          delta: step,
          maxWidth,
          minWidth,
        });
        break;
      }
      case "PageDown": {
        event.preventDefault();
        dispatch({
          type: "resize-by",
          delta: step * -3,
          maxWidth,
          minWidth,
        });
        break;
      }
      case "PageUp": {
        event.preventDefault();
        dispatch({
          type: "resize-by",
          delta: step * 3,
          maxWidth,
          minWidth,
        });
        break;
      }
      case "Home": {
        event.preventDefault();
        dispatch({
          type: "resize-to-boundary",
          boundary: "min",
          maxWidth,
          minWidth,
        });
        break;
      }
      case "End": {
        event.preventDefault();
        dispatch({
          type: "resize-to-boundary",
          boundary: "max",
          maxWidth,
          minWidth,
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  return {
    handleKeyDown,
    handlePointerDown,
    isResizing: state.isResizing,
    width: state.width,
  };
}
