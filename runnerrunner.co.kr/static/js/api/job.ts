import instance from "../utils/network";
import { CommonResponse, PubType } from "./types";

export type RecruitState = "EMPLOYING" | "DONE" | "";
export type RecruitType = "DEALER" | "PRACTICE_DEALER" | "SERVANT" | "ETC" | "";

export interface Job {
  benefits: string;
  cafeId: number;
  cafeName: string;
  contactInfo: string;
  email: string;
  endDate: string;
  gender: string;
  hourlyPay: number;
  id: number;
  place: string;
  provinceId: number;
  recruitType: RecruitType;
  recruitTypeEtc: string | null;
  state: RecruitState;
  workingDaysTime: string;
  ageLimits: number[];
  owner: boolean;
  createdAt: string;
  additionalInfo: string;
  lat: number;
  lon: number;
  pubType: PubType;
}
export interface UserJob {
  benefits: string;
  userId: number;
  cafeName: string;
  nickname: string;
  contactInfo: string;
  email: string;
  endDate: string;
  gender: string;
  hourlyPay: number;
  id: number;
  place: string;
  recruitType: RecruitType;
  recruitTypeEtc: string | null;
  state: RecruitState;
  workingDaysTime: string;
  ageLimits: number[];
  owner: boolean;
  createdAt: string;
  additionalInfo: string;
}

export interface JobSearchParams {
  provinces?: number[];
  stateType?: RecruitState[];
  recruitType?: RecruitType[];
  lat?: number;
  lon?: number;
  fromDistance?: number;
  toDistance?: number;
  minHourlyPay?: number;
  maxHourlyPay?: number;
}

export function jobList(data: JobSearchParams): Promise<Job[]> {
  return instance.post("/job-opening/list", data);
}

export function userJobList(data: JobSearchParams): Promise<UserJob[]> {
  return instance.post("/job-opening/user/list", data);
}

export function jobDetail(id: number, userId?: number): Promise<Job> {
  return instance.get("/job-opening/" + id, { params: { userId } });
}

export function userJobDetail(id: number, userId?: number): Promise<UserJob> {
  return instance.get("/job-opening/user/" + id, { params: { userId } });
}

export interface JobRegisterParams {
  cafeId: number;
  place: string;
  recruitType: string;
  recruitTypeEtc?: string;
  workingDaysTime: string;
  gender: string;
  hourlyPay: number;
  ageLimits: number[];
  benefits: string;
  contactInfo: string;
  email: string;
  additionalInfo: string;
  state: string;
}
export interface UserJobRegisterParams {
  userId: number;
  cafeName: string;
  place: string;
  recruitType: string;
  recruitTypeEtc?: string;
  workingDaysTime: string;
  gender: string;
  hourlyPay: number;
  ageLimits: number[];
  benefits: string;
  contactInfo: string;
  email: string;
  additionalInfo: string;
  state: string;
}

export interface JobReportRequest {
  jobId: number;
  type: string;
  description: string;
}
export interface JobUpdateParams extends JobRegisterParams {
  id: number;
}
export interface UserJobUpdateParams extends UserJobRegisterParams {
  id: number;
}
export function jobRegister(data: JobRegisterParams): Promise<CommonResponse> {
  return instance.post("/job-opening/register", data);
}

export function jobUpdate(data: JobUpdateParams): Promise<CommonResponse> {
  return instance.put("/job-opening/update", data);
}

export function jobDelete(id: number): Promise<CommonResponse> {
  return instance.delete("/job-opening/delete", { params: { id } });
}

export function userJobRegister(
  data: UserJobRegisterParams
): Promise<CommonResponse> {
  return instance.post("/job-opening/user/register", data);
}

export function reportJob(body: JobReportRequest) {
  return instance.put(`/job-opening/user/report`, body);
}

export function userJobUpdate(
  data: UserJobUpdateParams
): Promise<CommonResponse> {
  return instance.put("/job-opening/user/update", data);
}

export function userJobDelete(id: number): Promise<CommonResponse> {
  return instance.delete("/job-opening/user/delete", { params: { id } });
}

export function getMyJobList(data: {
  recruitType?: RecruitType[];
  storeId?: number;
}): Promise<Job[]> {
  return instance.post("/job-opening/myList", data);
}
