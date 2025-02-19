import { useState, useEffect } from "react";
import {
  getAllSeasonRanks,
  getTournamentList,
  SeasonRankingResponse,
} from "../../../../api/tournament";
import {
  getTournamentInfo,
  TournamentInfoInterface,
} from "../../../../api/game";
import {
  DashboardDailyTournament,
  DashboardTournament,
} from "../../../../api/dashboard";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../../utils/network";

export const useTournamentData = (gamePageState: number) => {
  const [preTournamentList, setPreTournament] = useState<DashboardTournament[]>(
    []
  );
  const [dailyTournament, setDailyTournament] = useState<
    DashboardDailyTournament[]
  >([]);
  const [tournamentData, setTournamentData] = useState<
    TournamentInfoInterface[]
  >([]);

  const [seasonRanking, setSeasonRanking] =
    useState<SeasonRankingResponse | null>(null);

  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);

  const getDailyTournament = async () => {
    const res = await getTournamentList();
    setPreTournament(res);
  };

  const getSeasonRanking = async (page = 0) => {
    const res = await getAllSeasonRanks({ over: 4, page, size: 7, season: 1 });
    setSeasonRanking(res);
  };

  useEffect(() => {
    getSeasonRanking();
    getDailyTournament();
  }, [gamePageState]);

  useEffect(() => {
    const fetchTournamentInfo = async (item: DashboardTournament) => {
      try {
        const token = accessToken ? accessToken.replace("Bearer ", "") : "-";
        const res = await getTournamentInfo({ groupId: item.groupId, token });

        if (res.data && JSON.stringify(res.data) !== "{}") {
          return res.data;
        }
      } catch (error) {
        console.error("Error fetching tournament info:", error);
      }
      return null;
    };

    const processTournaments = async () => {
      const tournamentInfoPromises = preTournamentList.map(fetchTournamentInfo);
      const tournamentInfos = await Promise.all(tournamentInfoPromises);

      const combinedTournaments: DashboardDailyTournament[] =
        preTournamentList.map((item, index) => ({
          ...item,
          tournamentInfo:
            tournamentInfos[index] || ({} as TournamentInfoInterface),
        }));

      setTournamentData(
        tournamentInfos.filter(Boolean) as TournamentInfoInterface[]
      );

      const freeList = combinedTournaments
        .filter(
          (tournament) => tournament.tournamentInfo?.info?.data?.buyinPrice <= 0
        )
        .sort((a, b) =>
          a.tournamentGroup === "H" ? -1 : b.tournamentGroup === "H" ? 1 : 0
        );

      const paidList = combinedTournaments.filter(
        (tournament) => tournament.tournamentInfo?.info?.data?.buyinPrice > 0
      );

      setDailyTournament([...freeList, ...paidList]);
    };

    processTournaments();
  }, [preTournamentList, accessToken]);

  return {
    dailyTournament,
    tournamentData,
    getDailyTournament,
    seasonRanking,
    getSeasonRanking,
  };
};
