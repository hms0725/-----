import { useCallback, useEffect, useState } from "react";
import { PubSearchParams } from "../api/cafe";
import { GameType, PubType } from "../api/types";
import { parseJSON } from "../utils/common";
import useQueryParams from "./useQueryParams";

function usePubSearchFilter(defaultValues: PubSearchParams = {}) {
  const query = useQueryParams();
  const [filter, setFilter] = useState<PubSearchParams>({
    sort: "distance",
    ...defaultValues,
  });

  const isSelectedPubType = useCallback(
    (type: PubType) => {
      if (!filter.pubTypes || filter.pubTypes.length === 0) {
        return type === "";
      }
      return filter.pubTypes.includes(type);
    },
    [filter.pubTypes]
  );

  const isSelectedGameType = useCallback(
    (type: GameType) => {
      if (!filter.gameTypes || filter.gameTypes.length === 0) {
        return type === "";
      }
      return filter.gameTypes.includes(type);
    },
    [filter.gameTypes]
  );

  const isSelectedSortType = useCallback(
    (type: string) => {
      if (!filter.sort) {
        return type === "";
      }
      return filter.sort === type;
    },
    [filter.sort]
  );

  const togglePubType = useCallback((type: PubType) => {
    setFilter((filter) => {
      const newFilter = { ...filter };

      if (newFilter.pubTypes) {
        if (type === "") {
          newFilter.pubTypes = undefined;
        } else {
          const idx = newFilter.pubTypes.indexOf(type);
          if (idx === -1) {
            newFilter.pubTypes.push(type);
          } else {
            newFilter.pubTypes.splice(idx, 1);
          }
        }
      } else if (type !== "") {
        newFilter.pubTypes = [type];
      }

      return newFilter;
    });
  }, []);

  const toggleGameType = useCallback((type: GameType) => {
    setFilter((filter) => {
      const newFilter = { ...filter };

      if (newFilter.gameTypes) {
        if (type === "") {
          newFilter.gameTypes = undefined;
        } else {
          const idx = newFilter.gameTypes.indexOf(type);
          if (idx === -1) {
            newFilter.gameTypes.push(type);
          } else {
            newFilter.gameTypes.splice(idx, 1);
          }
        }
      } else if (type !== "") {
        newFilter.gameTypes = [type];
      }

      return newFilter;
    });
  }, []);

  const setSortType = useCallback((sortType: string) => {
    setFilter((filter) => {
      const newFilter = {
        ...filter,
        sort: sortType !== "" ? sortType : undefined,
      };
      return newFilter;
    });
  }, []);

  const setGameType = useCallback((type: GameType) => {
    setFilter((filter) => {
      const newFilter = { ...filter };

      if (type === "") {
        newFilter.gameTypes = undefined;
      } else {
        newFilter.gameTypes = [type];
      }
      return newFilter;
    });
  }, []);

  const setPubType = useCallback((type: PubType) => {
    setFilter((filter) => {
      const newFilter = { ...filter };

      if (type === "") {
        newFilter.pubTypes = undefined;
      } else {
        newFilter.pubTypes = [type];
      }
      return newFilter;
    });
  }, []);

  // 초기 필터 설정 (한 번만 실행)
  useEffect(() => {
    const initialFilter = parseJSON(query.get("filter"));
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, []); // 의존성 배열을 비워서 초기 마운트시에만 실행

  return {
    filter,
    setFilter,
    togglePubType,
    toggleGameType,
    setSortType,
    setPubType,
    setGameType,
    isSelectedPubType,
    isSelectedGameType,
    isSelectedSortType,
  };
}

export default usePubSearchFilter;
