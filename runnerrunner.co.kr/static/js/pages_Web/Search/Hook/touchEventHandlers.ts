import React from "react";

export const handleTouchEvents = (
  startY: number | null,
  setStartY: React.Dispatch<React.SetStateAction<number | null>>,
  setCurrentY: React.Dispatch<React.SetStateAction<number>>,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  onTouchEnd: () => void
) => {
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const touchY =
      e.type === "touchstart"
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY;
    setStartY(touchY);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startY) return;
    const touchY =
      e.type === "touchmove"
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY;
    const distanceY = startY - touchY;
    setIsDragging(true);

    if (distanceY > 0) {
      setIsDragging(true);
      setCurrentY(distanceY);
    }
  };

  const handleTouchEnd = () => {
    if (startY) {
      onTouchEnd();
    }
    setStartY(null);
    setCurrentY(0);
    setTimeout(() => {
      setIsDragging(false);
    }, 200);
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};
