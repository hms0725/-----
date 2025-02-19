import instance from "../utils/network";
import { CommonResponse } from "./types";

export interface SecondHandMarketNoticeResponse {
  createdAt: string;
  description: string;
  id: number;
  title: string;
  updatedAt: string;
}

export interface SecondHandMarketCommentResponse {
  createdAt: string;
  exit: boolean;
  id: number;
  message: string;
  mine: boolean;
  userNickName: string;
  userProfile: string;
}

export interface SecondHandMarketResponse {
  id: number;
  userId: number;
  imageList: string[];
  title: string;
  message: string;
  areaProvinceName: string;
  areaCityName: string;
  areaStreetName: string;
  areaProvinceId: number;
  areaCityId: number;
  areaStreetId: number;
  onSale: boolean;
  price: number;
  createdAt: string;
  username: string;
  userProfile: string;
  like: boolean;
  likeCount: number;
  commentCount: number;
  mine: boolean;
  validate: boolean;
}

export interface MarketReportRequest {
  marketId: number;
  type: string;
  description: string;
}

export interface MarketCommentReportRequest {
  commentId: number;
  type: string;
  description: string;
}

export function getMarketComment(
  id: number
): Promise<SecondHandMarketCommentResponse[]> {
  return instance.get(`/second-hand-market-comment/${id}`);
}
export function getMarketDetail(id: number): Promise<SecondHandMarketResponse> {
  return instance.get(`/second-hand-market/${id}`);
}
export function getSecondHandMarketNotice(): Promise<
  SecondHandMarketNoticeResponse[]
> {
  return instance.get(`/second-hand-market-notice`);
}

export function reportMarket(body: MarketReportRequest) {
  return instance.put(`/second-hand-market/report`, body);
}

export function reportMarketComment(body: MarketCommentReportRequest) {
  return instance.put(`/second-hand-market-comment/report`, body);
}

export function addMarketComment(request: {
  marketId: number;
  message: string;
}) {
  return instance.post(`/second-hand-market-comment/`, request);
}
interface NetworkResponse {
  code: number;
  message: string;
}
export function likeMarket(id: number): Promise<NetworkResponse> {
  return instance.patch(`second-hand-market/like/${id}`);
}

export function cancelLikeMarket(id: number): Promise<NetworkResponse> {
  return instance.patch(`second-hand-market/like-cancel/${id}`);
}

export function updateMarketComment(request: { id: number; message: string }) {
  return instance.put(`/second-hand-market-comment/`, request);
}

export function exitMarketComment(id: number) {
  return instance.patch(`/second-hand-market-comment/exit/${id}?exit=true`);
}

export function registerMarket(
  data: {
    title: string;
    message: string;
    price: number;
    areaProvinceId: number;
    areaCityId: number;
    areaStreetId: number;
  },
  imageFiles: File[]
) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("message", data.message);
  formData.append("areaProvinceId", data.areaProvinceId.toString());
  formData.append("areaCityId", data.areaCityId.toString());
  formData.append("areaStreetId", data.areaStreetId.toString());
  formData.append("price", data.price.toString());

  for (let file of imageFiles) {
    formData.append("imageList", file);
  }

  return instance.post("/second-hand-market", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function UpdateMarket(
  id: number,
  data: {
    title: string;
    message: string;
    price: number;
    areaProvinceId: number;
    areaCityId: number;
    areaStreetId: number;
    onSale: boolean;
  },
  imageFiles: File[]
) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("message", data.message);
  formData.append("areaProvinceId", data.areaProvinceId.toString());
  formData.append("areaCityId", data.areaCityId.toString());
  formData.append("areaStreetId", data.areaStreetId.toString());
  formData.append("price", data.price.toString());
  formData.append("onSale", data.onSale.toString());

  for (let file of imageFiles) {
    formData.append("imageList", file);
  }

  return instance.put(`/second-hand-market/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function RemoveMarket(id: number): Promise<CommonResponse> {
  return instance.delete(`/second-hand-market/${id}`);
}

export function getSecondHandMarket(
  p: number | null | undefined,
  c: number | null | undefined,
  s: number | null | undefined,
  order: number | null | undefined,
  minPrice: number | null | undefined,
  maxPrice: number | null | undefined,
  onSale: boolean | null,
  lat: number | null | undefined,
  lon: number | null | undefined
): Promise<SecondHandMarketResponse[]> {
  const params = new URLSearchParams();

  if (p !== null && p !== undefined) params.append("p", p.toString());
  if (c !== null && c !== undefined) params.append("c", c.toString());
  if (s !== null && s !== undefined) params.append("s", s.toString());
  if (order !== null && order !== undefined)
    params.append("order", order.toString());
  if (minPrice !== null && minPrice !== undefined)
    params.append("minPrice", minPrice.toString());
  if (maxPrice !== null && maxPrice !== undefined)
    params.append("maxPrice", maxPrice.toString());
  if (onSale !== null && onSale !== undefined)
    params.append("onSale", onSale.toString());
  if (lat !== null && lat !== undefined) params.append("lat", lat.toString());
  if (lon !== null && lon !== undefined) params.append("lon", lon.toString());

  return instance.get(`/second-hand-market`, { params });
}
