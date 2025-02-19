import instance from "../utils/network";
import { DashboardDailyTournament } from "./dashboard";

export interface UserRank {
  nickname: string;
  userId: number;
  point: number;
  rank: number;
}

export interface SeasonRanking {
  rank: number;
  point: number;
  nickName: string;
  profile: string;
  tier: string;
}
export interface SeasonRankingResponse {
  topThree: SeasonRanking[];
  otherRanks: SeasonRanking[];
  totalOtherRanks: number;
}

export interface RegisterSeasonRakingPoint {
  gameType: string;
  rankingPoint: number;
  rank: number | null;
  season: number;
  groupId: number;
  userId: number;
}

export interface SeasonHistoryResponse {
  years: number[];
  months: number[];
  histories: SeasonHistory[];
}

export interface SeasonHistory {
  createdAt: string;
  rank: number;
  type: string;
  point: number;
}

export interface MyPointsResponse {
  point: number;
}

export interface MyRankResponse {
  first: number;
  second: number;
  third: number;
  other: number;
}

export interface TournamentScheduleItemInterface {
  id: number;
  image: string;
  title: string;
  description: string | null;
  lat: number | null;
  lon: number | null;
  prize: number;
  place: string;
  phone: string | null;
  webUrl?: string;
  startAt: string;
  endAt: string;
  buyIn: number | null;
  blindLevelUpTime: null;
  registerLimit: null;
  currentBlindLevel: null;
  starting: null;
  reEntry: null;
  player: null;
  entry: null;
  totalStack: null;
  averageStack: null;
  competitionType: string;
}

export interface SeasonTier {
  tier: string;
  pointsToNextTier: number;
}

export function getMySeasonTier(): Promise<SeasonTier> {
  return instance.get("/tournament/season-rank/user-tier/1");
}

export function registerRankingPoint(
  request: RegisterSeasonRakingPoint
): Promise<number> {
  return instance.post("/tournament/season-rank/", request);
}

export function runnerRankingList(params: {
  startDate: string;
  endDate: string;
}): Promise<UserRank[]> {
  return instance.get("/tournament/ranking/runnerRankingList", { params });
}

export function getMySeasonRankingPoint(): Promise<MyPointsResponse> {
  return instance.get("/tournament/season-rank/my-points/1");
}

export function getMySeasonRanks(): Promise<MyRankResponse> {
  return instance.get("/tournament/season-rank/my-rank");
}

export function getAllSeasonRanks(params: {
  over: number;
  season: number;
  page?: number;
  size?: number;
}): Promise<SeasonRankingResponse> {
  return instance.get("/tournament/season-rank/filter", {
    params: {
      over: params.over, //OVER 이상 표시
      season: params.season,
      page: params.page,
      size: params.size,
    },
  });
}

export function getTournamentList(): Promise<DashboardDailyTournament[]> {
  return instance.get("/tournament/list");
}

export function getMySeasonHistory(params: {
  year: number;
  month: number;
  type?: string | null;
}): Promise<SeasonHistoryResponse> {
  return instance.get("/tournament/season-rank/history", {
    params: {
      year: params.year,
      month: params.month,
      type: params.type,
    },
  });
}

export function totalRunnerRankingList(): Promise<UserRank[]> {
  return instance.get("/tournament/ranking/totalRunnerRankingList");
}

export function getMajorTournamentList(params: {
  year: number;
  month: number;
}): Promise<TournamentScheduleItemInterface[]> {
  return instance.get("/brand-competition/list", { params });
}

export function getDayMajorTournamentList(params: {
  year: number;
  month: number;
  day: number;
}): Promise<TournamentScheduleItemInterface[]> {
  return instance.get("/brand-competition/day-list", { params });
}

export function getMajorTournamentDetail(params: {
  tournamentId: number;
}): Promise<TournamentScheduleItemInterface> {
  return instance.get(`/brand-competition/${params.tournamentId}`);
}

export function getMinorTournamentList(params: {
  year: number;
  month: number;
}): Promise<TournamentScheduleItemInterface[]> {
  return instance.get("/minor-competition/list", { params });
}

export function getMinorTournamentDetail(params: {
  tournamentId: number;
}): Promise<TournamentScheduleItemInterface> {
  return instance.get(`/minor-competition/${params.tournamentId}`);
}
