import instance from "../utils/network";

export interface AppUpdate {
  id: number;
  os: string;
  version: string;
  update: boolean;
  appId: string;
}

export interface BasicInfo {
  deviceId: string;
  os: string;
  version: string;
}

export function getAppUpdate(): Promise<AppUpdate[]> {
  return instance.get("/app-update/list");
}
