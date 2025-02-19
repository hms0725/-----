import instance from "../utils/network";
import { Cafe, HoldemNowType, PubType } from "./types";

export type LikeType = "CAFE" | "PRODUCT";

export interface LikeCafe {
  id: number;
  areaProvinceId: number;
  cafeName: string;
  point: number;
  coverImageUrl: null | string;
  pubType: number;
}
export interface LikeItemReq {
  area: string;
  cafes: LikeCafe[];
}
export interface HistoryItemReq {
  createdAt: string;
  pubName: string;
  tournamentTitle: string;
  entryCount: number;
  rank: number | null;
  reBuyInCount: number;
  addOnCount: number;
  totalPointsSpent: number;
  pointsWon: number;
  tournamentEntry: number;
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
}): Promise<Cafe[]> {
  return instance.post("/nest/like/items", data);
}

export function likeHasItems(pubId: number): Promise<{
  hasLike: boolean;
}> {
  return instance.get(`/nest/like/hasItem/${pubId}`);
}

export function likeAdd(pubId: number): Promise<Cafe[]> {
  return instance.post(`/nest/like/add/${pubId}`);
}

export function likeDelete(pubId: number): Promise<Cafe[]> {
  return instance.post(`/nest/like/delete/${pubId}`);
}

export function cafeViewMessage(params: {
  messageId: number;
}): Promise<HoldemNowType> {
  return instance.get("/cafe/viewMessage", { params });
}
