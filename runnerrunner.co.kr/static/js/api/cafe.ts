import instance from "../utils/network";
import {
  Cafe,
  CommonResponse,
  GameType,
  PubTournament,
  PubType,
} from "./types";

export interface PubSearchParams {
  data?: number[];
  q?: string;
  lat?: number;
  lon?: number;
  myLat?: number;
  myLon?: number;
  km?: number;
  pubTypes?: PubType[];
  gameTypes?: GameType[];
  buyInFrom?: number;
  buyInTo?: number;
  blindUpFrom?: number;
  blindUpTo?: number;
  prizeFrom?: number;
  prizeTo?: number;
  sort?: string;
}

export function searchNestCafe(data: PubSearchParams): Promise<Cafe[]> {
  return instance.post("/nest/pub/search", data);
}

export function areaCafeList(
  areaProvinceId: number,
  areaCityId: number
): Promise<Cafe[]> {
  return instance.get("/nest/pub/areaCafeList", {
    params: { areaProvinceId, areaCityId },
  });
}

export function searchAreaCafe(cityName: string): Promise<Cafe[]> {
  return instance.get("/nest/pub/cityCafeList", { params: { cityName } });
}

export function cafeDetail(id: number): Promise<Cafe> {
  return instance.get("/nest/pub/" + id);
}

export function cafeTournament(id: number): Promise<PubTournament[]> {
  return instance.get("/nest/seller/tournament/pub-not-end/" + id);
}

export function cafeTournamentsStarted(
  cafeList: Cafe[]
): Promise<PubTournament[]> {
  const cafeIds = cafeList.map((cafe) => cafe.id);
  return instance.post("/nest/seller/tournament/pubs", { cafeIds });
}

export function cafeTournamentsWithNotStarted(
  cafeList: Cafe[]
): Promise<PubTournament[]> {
  const cafeIds = cafeList.map((cafe) => cafe.id);
  return instance.post("/nest/seller/tournament/pubs-with-not-start", {
    cafeIds,
  });
}

export function cafeTournaments(cafeList: Cafe[]): Promise<PubTournament[]> {
  return cafeTournamentsStarted(cafeList);
}

export function cafeTournamentEnd(id: number): Promise<any> {
  return instance.get("/nest/seller/tournament/timer-by-user/" + id);
}

export function cafeReports(data: {
  cafeId: number;
  info: string;
}): Promise<CommonResponse> {
  return instance.post("/nest/pub/reports", data);
}

export function AddReview(
  data: { pubId: number; message: string; score: number },
  imageFiles: File[]
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  for (let file of imageFiles) {
    formData.append("imageList", file);
  }

  return instance.post("/nest/pub/review", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function UpdateReview(
  data: { pubId: number; message: string; score: number; id: number },
  imageFiles: File[]
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  for (let file of imageFiles) {
    formData.append("imageList", file);
  }

  return instance.put(`/nest/pub/review/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function RemoveReview(id: number): Promise<CommonResponse> {
  return instance.delete(`/nest/pub/review/${id}`);
}
