import instance from "../utils/network";
import { Cafe, CommonResponse } from "./types";

export function getSellerCafeList(data: {
  page?: number;
  size?: number;
}): Promise<Cafe> {
  return instance.get("/seller/pub/seller");
}

export function sellerAddMessage(
  data: { nowMessage: string; cafeId: number },
  coverImages: File[]
): Promise<CommonResponse> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  for (let file of coverImages) {
    formData.append("coverImages", file);
  }

  return instance.post("/seller/cafe/addMessage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function sellerMessageUpdate(
  data: { nowMessage: string; id: number; pubId: number },
  coverImages: File[]
): Promise<CommonResponse> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  for (let file of coverImages) {
    formData.append("coverImages", file);
  }

  return instance.put("/seller/cafe/messageUpdate", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function sellerMessageDelete(params: {
  messageId: number;
  pubId: number;
}): Promise<CommonResponse> {
  return instance.delete("/seller/cafe/messageDelete", { params });
}
