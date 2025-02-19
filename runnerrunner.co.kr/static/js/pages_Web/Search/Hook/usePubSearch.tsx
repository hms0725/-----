import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  allStoresState,
  premiumStoreListState,
  regularStoreListState,
  vipStoreListState,
} from "../../../../recoil/search";
import {
  searchAreaCafe,
  PubSearchParams,
  cafeTournaments,
  areaCafeList,
  searchNestCafe,
} from "../../../../api/cafe";
import { Cafe, PubTournament } from "../../../../api/types";
import { isPremiumAndVIP } from "../../../../utils/common";

export const usePubSearch = () => {
  const [error, setError] = useState<Error | null>(null);

  const [searchResults, setSearchResults] = useRecoilState(allStoresState);
  // premium과 regular 스토어는 자동으로 계산되므로 읽기 전용으로만 사용
  const premiumList = useRecoilValue(premiumStoreListState);
  const vipList = useRecoilValue(vipStoreListState);
  const storeList = useRecoilValue(regularStoreListState);

  const updateCafeListWithTournaments = useCallback(
    (cafeList: Cafe[], tournamentList: PubTournament[]): Cafe[] => {
      // tournamentList를 cafeId를 키로 하는 Map으로 변환
      const tournamentMap = new Map(
        tournamentList.map((tournament) => [tournament.cafeId, tournament])
      );
      // 각 카페에 해당하는 토너먼트 정보 업데이트
      return cafeList.map((cafe) => {
        if (isPremiumAndVIP(cafe.pubType)) {
          const tournament = tournamentMap.get(+cafe.id);
          return {
            ...cafe,
            pubTournamentList: tournament ? [tournament] : [],
          };
        }
        return cafe;
      });
    },
    []
  );

  // 검색 결과 처리 함수
  const processSearchResults = useCallback((list: Cafe[]) => {
    try {
      const updatedList = list.map((item) => ({
        ...item,
      }));

      setSearchResults(updatedList);
      setError(null);
    } catch (err) {
      console.error("Error processing search results:", err);
      setError(err as Error);
    }
  }, []);

  // 일반 검색 함수
  const handleSearch = useCallback(
    async (params: PubSearchParams, forceRadius?: number): Promise<void> => {
      try {
        const noPubTypes =
          params.pubTypes?.length === 1 && params.pubTypes[0] === "";
        const noSortType = !Boolean(params.sort);

        const cafeList = await searchNestCafe({
          ...params,
          lat: params.lat || 35,
          lon: params.lon || 127,
          km: forceRadius || params.km,
          sort: !noSortType ? params.sort : undefined,
          pubTypes: !noPubTypes ? params.pubTypes : undefined,
        });

        await processSearchResults(cafeList);

        // 프리미엄 펍 토너먼트 데이터 처리
        const premiumPubs = cafeList.filter((cafe) =>
          isPremiumAndVIP(cafe.pubType)
        );
        if (premiumPubs.length > 0) {
          const tournamentList = await cafeTournaments(premiumPubs);
          if (tournamentList.length > 0) {
            const updatedList = updateCafeListWithTournaments(
              cafeList,
              tournamentList
            );
            processSearchResults(updatedList);
          }
        }
      } catch (error) {
        console.error("Search failed:", error);
        setError(error as Error);
        // 에러 처리를 위한 커스텀 훅이나 컨텍스트를 사용하여 사용자에게 알림
        throw error;
      }
    },
    [processSearchResults]
  );

  const handleFirstSearch = useCallback(
    async (areaProvinceId: number, areaCityId: number): Promise<void> => {
      try {
        const cafeList = await areaCafeList(areaProvinceId, areaCityId);

        processSearchResults(cafeList);

        const premiumPubs = cafeList.filter((cafe) =>
          isPremiumAndVIP(cafe.pubType)
        );

        if (premiumPubs.length > 0) {
          const tournamentList = await cafeTournaments(premiumPubs);

          if (tournamentList.length > 0) {
            const tournamentMap = new Map(
              tournamentList.map((tournament) => [
                tournament.cafeId,
                tournament,
              ])
            );

            const updatedList = cafeList.map((cafe) => {
              if (isPremiumAndVIP(cafe.pubType)) {
                const tournament = tournamentMap.get(cafe.id);
                return {
                  ...cafe,
                  pubTournamentList: tournament ? [tournament] : [],
                };
              }
              return cafe;
            });

            // Re-process results with tournament data
            processSearchResults(updatedList);
          }
        }
      } catch (error) {
        console.error("Error in handleSearch:", error);
        throw error;
      }
    },
    [processSearchResults]
  );

  // 텍스트 검색 함수
  const handleTextSearch = useCallback(
    async (params: PubSearchParams): Promise<Cafe[]> => {
      try {
        const cafeList = await searchNestCafe({
          ...params,
          lat: params.lat || 35,
          lon: params.lon || 127,
          myLat: params.myLat,
          myLon: params.myLon,
        });
        return cafeList;
      } catch (error) {
        console.error("Error in text search:", error);
        throw error;
      }
    },
    []
  );

  // 지역 검색 함수
  const handleAreaSearch = useCallback(async (cafeName: string) => {
    return await searchAreaCafe(cafeName);
  }, []);

  return {
    storeList,
    premiumList,
    searchResults,
    vipList,
    error,
    handleSearch,
    handleTextSearch,
    handleAreaSearch,
    handleFirstSearch,
  };
};
