import React, { useEffect } from "react";
import useQueryParams from "../../../hooks/useQueryParams";
import { openNewWindow } from "../../../utils/common";

const RedirectPage = () => {
  const searchParams = useQueryParams();
  const redirectUrl = searchParams.get("url");

  useEffect(() => {
    if (redirectUrl) {
      if (redirectUrl.includes("http")) {
        openNewWindow(redirectUrl);
        window.location.href = "/";
      } else {
        window.history.replaceState(null, "", "/");
        window.location.href = redirectUrl;
      }
    } else {
      // URL 파라미터가 없는 경우 홈으로 이동
      window.history.replaceState(null, "", "/");
      window.location.href = "/";
    }
  }, [redirectUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center"></div>
    </div>
  );
};

export default RedirectPage;
