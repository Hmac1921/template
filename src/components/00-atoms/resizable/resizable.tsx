import React from "react";

export const Resizable = ({ children }: any) => {
  const [node, setNode] = React.useState<HTMLElement | null>(null);

  const ref = React.useCallback((nodeEle: any) => {
    setNode(nodeEle);
  }, []);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
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
      const h = parseInt(styles.height, 10);

      const handleMouseMove = (e: React.MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
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

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
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
      const w = parseInt(styles.width, 10);
      const h = parseInt(styles.height, 10);

      const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        const dy = touch.clientY - startPos.y;
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

  React.useEffect(() => {
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
  console.log(node);

  return children({ ref });
};
