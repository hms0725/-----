import React, { useEffect, PropsWithChildren } from "react";

export const PerformanceWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
          console.warn(
            `Long task detected: ${entry.name}, duration: ${entry.duration}ms`
          );
        }
      }
    });
    observer.observe({ entryTypes: ["longtask"] });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};
