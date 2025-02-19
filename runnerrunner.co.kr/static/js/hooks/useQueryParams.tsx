import React from "react";
import {useLocation} from "react-router-dom";

function useQueryParams() {
  const {search} = useLocation();
  return React.useMemo(() => new URLSearchParams(search) as any, [search]);
}

export default useQueryParams;
