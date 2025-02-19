import { useEffect, useState, useCallback } from "react";
import {
  CompetitionTournamentDto,
  CompetitionType,
  getCompetitionTournament,
  KoreaRegion,
  TournamentState,
  WorldRegion,
} from "../../../../api/competition";

export const useCompetition = () => {
  const [competitionList, setCompetitionList] = useState<
    CompetitionTournamentDto[]
  >([]);

  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [total, setTotal] = useState<number>(0);

  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [type, setType] = useState<CompetitionType>(CompetitionType.PUB);
  const [lastPage, setLastPage] = useState(0);
  const [region, setRegion] = useState<KoreaRegion | WorldRegion | null>(null);

  const setTournamentState = useCallback((data: CompetitionTournamentDto) => {
    let state = TournamentState.마감;
    const now = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (now < startDate) {
      state = TournamentState.진행예정;
    } else if (now >= startDate && now <= endDate) {
      state = TournamentState.진행중;
    }
    data.state = state;
    return data;
  }, []);

  const sortCompetitions = useCallback(
    (competitions: CompetitionTournamentDto[]) => {
      // 상태별 우선순위 정의
      const stateOrder = {
        [TournamentState.진행중]: 0,
        [TournamentState.진행예정]: 1,
        [TournamentState.마감]: 2,
      };

      return [...competitions].sort((a, b) => {
        // 상태로만 정렬
        return stateOrder[a.state] - stateOrder[b.state];
      });
    },
    []
  );

  const getCompetitionList = useCallback(async () => {
    const req = {
      page,
      limit,
      year,
      type,
      month,
      region,
    };
    const res = await getCompetitionTournament(req);
    const competitionsWithState = res.items.map(setTournamentState);
    const sortedCompetitions = sortCompetitions(competitionsWithState);
    setCompetitionList(sortedCompetitions);
    setTotal(res.total);
    setLastPage(res.lastPage);
  }, [
    page,
    limit,
    year,
    type,
    month,
    region,
    setTournamentState,
    sortCompetitions,
  ]);

  useEffect(() => {
    getCompetitionList();
  }, [getCompetitionList]);

  const isSelectedType = (competitionType: CompetitionType) => {
    return competitionType === type ? "active" : "";
  };

  const showCountByType = () => {
    switch (type) {
      case CompetitionType.PUB:
        return (
          <div className="description">
            현재 전국 <span>{total.toLocaleString()}</span>개 펍 대회가 진행 중
            입니다.
          </div>
        );
      case CompetitionType.DOMESTIC:
        return (
          <div className="description">
            현재 전국 <span>{total.toLocaleString()}</span>개 대회가 진행 중
            입니다.
          </div>
        );
      case CompetitionType.INTERNATIONAL:
        return (
          <div className="description">
            현재 전세계 <span>{total.toLocaleString()}</span>개 대회가 진행 중
            입니다.
          </div>
        );
      default:
        return "";
    }
  };

  const regionToKorean: { [key in KoreaRegion | WorldRegion]: string } = {
    [KoreaRegion.ALL]: "전체",
    [KoreaRegion.SEOUL]: "서울",
    [KoreaRegion.GYEONGGI]: "경기",
    [KoreaRegion.INCHEON]: "인천",
    [KoreaRegion.GANGWON]: "강원",
    [KoreaRegion.JUNRA]: "전라",
    [KoreaRegion.GYUNGNAM_BUSAN]: "경남/부산",
    [KoreaRegion.GYUNGBUK_DAEGU]: "경북/대구",
    [KoreaRegion.CHUNGCHEONG]: "충청",
    [KoreaRegion.DAEJEON_SEJONG]: "대전/세종",
    [KoreaRegion.JEJU]: "제주",
    [WorldRegion.ASIA]: "아시아",
    [WorldRegion.AMERICA]: "아메리카",
    [WorldRegion.EUROPE]: "유럽",
  };

  function getKoreanRegion(region?: KoreaRegion | WorldRegion | null): string {
    if (!region) return "전체";
    return regionToKorean[region] || "전체";
  }

  return {
    competitionList,
    page,
    setPage,
    total,
    year,
    setYear,
    month,
    setMonth,
    type,
    setType,
    isSelectedType,
    showCountByType,
    lastPage,
    region,
    setRegion,
    getKoreanRegion,
  };
};
