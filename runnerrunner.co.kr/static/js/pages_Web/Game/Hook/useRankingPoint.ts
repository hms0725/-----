import { useEffect, useState } from "react";
import {
  getMySeasonHistory,
  getMySeasonRankingPoint,
  getMySeasonRanks,
  getMySeasonTier,
  MyRankResponse,
  SeasonHistoryResponse,
} from "../../../../api/tournament";

export const useRankingPoint = () => {
  const [rankingPoint, setRankingPoint] = useState(0);
  const [tier, setTier] = useState("");
  const [nextLevel, setNextLevel] = useState(0);

  const getMyTier = async () => {
    const res = await getMySeasonTier();
    setTier(res.tier);
    setNextLevel(res.pointsToNextTier);
  };

  const getMyPoint = async () => {
    const res = await getMySeasonRankingPoint();
    setRankingPoint(res.point);
  };

  const getMyHistory = async (
    year: number,
    month: number,
    type?: string | null
  ): Promise<SeasonHistoryResponse> => {
    const res = await getMySeasonHistory({
      year,
      month,
      type,
    });
    return res;
  };

  const getMyRanks = async (): Promise<MyRankResponse> => {
    const res = await getMySeasonRanks();
    return res;
  };

  useEffect(() => {
    getMyTier();
  }, []);
  return {
    getMyPoint,
    getMyHistory,
    getMyRanks,
    rankingPoint,
    tier,
    nextLevel,
    getMyTier,
  };
};
