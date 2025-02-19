import instance from "../utils/network";
import { Cafe, HoldemNowType, PubType } from "./types";

export type LikeType = "CAFE" | "PRODUCT";

export interface LikeCafe {
  id: number,
  areaProvinceId: number,
  cafeName: string,
  point: number,
  coverImageUrl: null | string,
  pubType: number
}
export interface LikeItemReq {
  area: string,
  cafes: LikeCafe[],
};
export interface HistoryItemReq {
  createdAt: string,
  pubName: string,
  tournamentTitle: string,
  entryCount: number,
  rank: number | null,
  reBuyInCount: number,
  addOnCount: number,
  totalPointsSpent: number,
  pointsWon: number,
  tournamentEntry: number,
};
export interface GetRankReq {
  rankings: RankingRes[],
  myRank: number | null,
}
export interface RankingRes {
  nickname: string,
  rank: number,
  tier: string,
  points: number,
  userId: number,
}

export function getRanking(id: number): Promise<GetRankReq> {
  return instance.get(`/member/ranking/${id}`);
}

export function likeItems(data: {
  userId: number;
  itemType: LikeType;
  lat: number;
  lon: number;
  pubTypes?: PubType[];
  buyInFrom?: number;
  buyInTo?: number;
  blindUpFrom?: number;
  blindUpTo?: number;
  prizeFrom?: number;
  prizeTo?: number;
  sort?: string;
}): Promise<LikeItemReq[]> {
  return instance.post("/nest/member/list", data);
}

export function historyItems(): Promise<HistoryItemReq[]> {
  return instance.get(`/nest/member/history`);
}

export function likeHasItems(pubId: number): Promise<{
  isMember: boolean;
}> {
  return instance.get(`/nest/member/is-member/${pubId}`);
}

export function likeAdd(pubId: number) {
  return instance.post(`/nest/member/${pubId}`);
}

export function likeDelete(pubId: number) {
  return instance.delete(`/nest/member/${pubId}`);
}

export function cafeViewMessage(params: {
  messageId: number;
}): Promise<HoldemNowType> {
  return instance.get("/cafe/viewMessage", { params });
}
