import { useCallback, useEffect, useState } from "react";

export const Resizable = ({ children }: any) => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [dxDy, setDxDy] = useState<{ dx: number; dy: number }>({
    dx: 0,
    dy: 0,
  });

  const ref = useCallback((nodeEle: any) => {
    setNode(nodeEle);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!node) {
        return;
      }

      const parent = node.parentElement as HTMLElement;
      const startPos = {
        x: e.clientX,
        y: e.clientY,
      };
      const styles = window.getComputedStyle(parent);
      const w = parseInt(styles.width, 10);
      // const h = parseInt(styles.height, 10);

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        setDxDy({ dx, dy });
        parent.style.width = `${w + dx}px`;
        updateCursor();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
        resetCursor();
      };

      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [node]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!node) {
        return;
      }

      const parent = node.parentElement as HTMLElement;
      const touch = e.touches[0];

      const startPos = {
        x: touch.clientX,
        y: touch.clientY,
      };
      const styles = window.getComputedStyle(parent);
      const w = parseInt(styles.width, 10) - dxDy.dx;
      // const h = parseInt(styles.height, 10) - dxDy.dy;

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        // const dy = touch.clientY - startPos.y;
        parent.style.width = `${w + dx}px`;
        updateCursor();
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove as any);
        document.removeEventListener("touchend", handleTouchEnd);
        resetCursor();
      };

      document.addEventListener("touchmove", handleTouchMove as any);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [node]
  );

  const updateCursor = () => {
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const resetCursor = () => {
    document.body.style.removeProperty("cursor");
    document.body.style.removeProperty("user-select");
  };

  useEffect(() => {
    if (!node) {
      return;
    }
    node.addEventListener("mousedown", handleMouseDown as any);
    node.addEventListener("touchstart", handleTouchStart as any);

    return () => {
      node.removeEventListener("mousedown", handleMouseDown as any);
      node.removeEventListener("touchstart", handleTouchStart as any);
    };
  }, [node]);

  return children({ ref });
};
