import instance from "../utils/network";
import { CommonResponse } from "./types";

export function authLogin(data: {
  textId?: string;
  password?: string;
  loginType?: string;
  accessToken?: string;
}): Promise<{
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}> {
  return instance.post("/auth/login", data);
}

export interface UserInfo {
  id: number;
  textId: string;
  email: string;
  username: string;
  nickname: string;
  phoneNumber: string;
  phoneNumberEnc: string;
  birthday: string;
  gender: string;
  role: string;
  grade: string;
  expireType: string;
  profileImageUrl: string | null;
  accessToken: string;
  accountInfo: string | null;
  accountBank: string | null;
  accountOwner: string | null;
  ticketCount: number;
  dailyTicketCount: number;
  kakaoId: number | null;
  naverId: number | null;
  googleId: number | null;
  appleId: number | null;
  exit: boolean;
  validate: boolean;
  agree1: boolean;
  agree2: boolean;
  agree3: boolean;
  agree4: boolean;
  agree5: boolean;
  areaProvince?: string;
  areaCity?: string;
}

export interface RegisterResponse {
  code: number;
  message: string;
  payload: UserInfo;
}

export function authDetail(): Promise<UserInfo> {
  return instance.get("/auth/detail");
}

interface SignUpRequest {
  textId: string;
  username: string;
  password: string;
  phoneNumber: string;
  nickname: string;
  birthYear: string;
  birthMonth: string;
  birthDate: string;
  gender: string | null;
  expireType: string;
  isAgree1: boolean;
  isAgree2: boolean;
  isAgree3: boolean;
  isAgree4: boolean;
  isAgree5: boolean;
  isAllAgree: boolean;
  isValidate: boolean;
  recommendNickname: string;
  signupType: string;
  accessToken: string;
  areaProvinceId?: number;
  areaCityId?: number;
  role: string;
}

export interface UseRPHistoryInterface {
  ownerId: number;
  ownerName: string;
  pointProductType: string;
  points: number;
  createdAt: string;
}

export interface ChargeHistoryInterface {
  chargeProduct: string;
  createdAt: string;
  ownerId: number;
  ownerName: string;
  points: number;
}
export interface ChargeHistoryResultInterface {
  totalCount: number;
  list: ChargeHistoryInterface[];
}
export interface UseRPHistoryResultInterface {
  totalCount: number;
  historyList: UseRPHistoryInterface[];
}

export function authSignUp(data: SignUpRequest): Promise<RegisterResponse> {
  return instance.post("/auth/signup", data);
}

export function authUpdate(
  data: any,
  image?: File
): Promise<{
  code: number;
  message: string;
  payload: any;
}> {
  return instance.put("/auth/update", data);
}

export function authPassword(data: {
  textId: string;
  newPassword: string;
}): Promise<CommonResponse> {
  return instance.patch("/auth/password", data);
}

export function editNickname(data: {
  nickname: string;
}): Promise<CommonResponse> {
  return instance.put("/nest/auth/changeNickname", data);
}

export function authExit(params: { userId: number }): Promise<CommonResponse> {
  return instance.delete("/auth/exit", { params });
}

export function authVerifiedTextId(params: {
  textId: string;
}): Promise<CommonResponse> {
  return instance.get("/auth/verified/textId", { params });
}

export function authVerifiedNickname(params: { nickname: string }): Promise<{
  verified: boolean;
}> {
  return instance.get("/auth/verified/nickname", { params });
}

export function authFindByNickname(params: {
  nickname: string;
}): Promise<UserInfo> {
  return instance.get("/auth/findByNickname", { params });
}

export function authVerifiedFindByPhoneNumber(data: {
  phoneNumber: string;
}): Promise<CommonResponse> {
  return instance.post("/auth/verified/findByPhoneNumber", data);
}

export function shootAgree(): Promise<CommonResponse> {
  return instance.post("/auth/shootAgree");
}

interface IamportCertResponse {
  isAlreadyExistUser: boolean;
  data: {
    birth: number;
    birthday: string;
    carrier: string;
    certified: true;
    certified_at: number;
    foreigner: boolean;
    foreigner_v2: boolean;
    gender: string;
    imp_uid: string;
    merchant_uid: string;
    name: string;
    origin: string;
    pg_provider: string;
    pg_tid: string;
    phone: string;
    unique_in_site: string;
    unique_key: string;
  };
  isAlreadyExitUser: boolean;
  userId?: number;
  nickname?: string;
  textId?: string;
}

export function iamportCertifications(data: {
  impUid: string;
  merchantUid: string;
}): Promise<IamportCertResponse> {
  return instance.post("/iamport/certifications", data);
}

export function iamportFindCertifications(data: {
  impUid: string;
  merchantUid: string;
}): Promise<IamportCertResponse> {
  return instance.post("/iamport/find/certifications", data);
}

export function updateProfileImage(
  image: File | null,
  user: {
    id: number;
  }
): Promise<CommonResponse> {
  const formData = new FormData();
  formData.append("image", image ? image : "null");
  formData.append(
    "user",
    new Blob([JSON.stringify(user)], { type: "application/json" })
  );

  return instance.put("/auth/update/profile-image", formData);
}

export function getUseRPHistory(): Promise<UseRPHistoryResultInterface> {
  return instance.get("/user-message/useHistoryList");
}

export function getChargeHistory(): Promise<ChargeHistoryResultInterface> {
  return instance.get("/user-message/chargeList");
}

export function getNaverToken(code: string): Promise<string> {
  return instance.get("/snslogin/getNaverToken", { params: { code } });
}

export function getGoogleToken(code: string): Promise<string> {
  return instance.get("/snslogin/getGoogleToken", { params: { code } });
}

export interface ChangeForKakaoRequest {
  textId: string;
}

export function changeForKakaoApi(
  data: ChangeForKakaoRequest
): Promise<CommonResponse> {
  return instance.put("/nest/auth/change-for-kakao", data);
}
