import instance from "../utils/network";
import {CommonResponse} from "./types";

export function referralLogRegister(
  data: {
    referralName: string;
    newUserName: string;
    textId: string;
  }
):
  Promise<void> {
  return instance.post('/referral-log/register', data)
}

interface FriendRecommendRequest {
  userId: number;
  userNickname: string;
  friendId: number;
  friendNickname: string;
  rebuy: any;
  gameMoney: any;
}

export interface FriendRecommendUseItem   {
  id: number,
  userId: number,
  rebuy: number,
  gameMoney: number,
  createDt: string,
  updateDt: string
}

export interface FriendRecommendItem {
  id: number;
  userId: number;
  userNickname: string;
  friendId: number;
  friendNickname: string;
  rebuy: number;
  gameMoney: number;
  createDt: string;
  updateDt: string;
}

export function friendRecommendRegister(
  data: FriendRecommendRequest
): Promise<CommonResponse> {
  return instance.post('/friend-recommend/register', data);
}

export function friendRecommendRemove(
  data: FriendRecommendRequest
): Promise<CommonResponse> {
  return instance.post('/friend-recommend/remove', data);
}

export function friendRecommendSumRebuy(): Promise<number> {
  return instance.post('/friend-recommend/sumRebuy');
}

export function friendRecommendSumGamemoney(): Promise<number> {
  return instance.post('/friend-recommend/sumGamemoney');
}

export function getFriendRecommendList(data: {
  userId: number
}): Promise<FriendRecommendItem[]>{
  return instance.get(`/friend-recommend/list/${data.userId}`);
}

export function getFriendRecommendUseList(data: {
  userId: number
}): Promise<FriendRecommendUseItem[]>{
  return instance.get(`/friend-recommend-use/list/${data.userId}`);
}
export function addFriendRecommendRegister(data:{
  userId: number,
  rebuy: number,
  gameMoney: number
}): Promise<any> {
  return instance.post(`/friend-recommend-use/register`,data)
}

export function getFriendRecommendCount(): Promise<{
  count: number
}>{
  return instance.get(`/friend-recommend/count`)
}
