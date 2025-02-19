import { useCallback, useLayoutEffect, useState } from "react";

export const MIN_WIDTH_DESKTOP = 1080;
export const MIN_HEIGHT_DESKTOP = 880;
export const MEDIA_DESKTOP = `(min-width: ${MIN_WIDTH_DESKTOP}px) and (min-height: ${MIN_HEIGHT_DESKTOP}px)`;

function useScreenOrientation() {
  //'' means not initialized
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "">(
    ""
  );
  const handleResize = useCallback(() => {
    setOrientation("portrait");
  }, []);

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return orientation;
}

export default useScreenOrientation;
