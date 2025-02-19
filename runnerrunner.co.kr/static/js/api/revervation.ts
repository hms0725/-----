import instance from "../utils/network";
import { CommonResponse, ReservationResponse } from "./types";

export interface TournamentReservationParams {
  reservationId: string;
  nickName: string;
  phoneNumber: string;
  userId?: number;
  root: string;
}

export function registerReservation(
  data: TournamentReservationParams
): Promise<CommonResponse> {
  return instance.post("/seller/reservation/register", data);
}

export function getReservation(id: string): Promise<ReservationResponse> {
  return instance.get("/seller/reservation/" + id);
}

export function getCurrentReservations(
  id: string
): Promise<{ nickname: string }[]> {
  return instance.get(`/seller/reservation/current_nicknames/${id}`);
}
