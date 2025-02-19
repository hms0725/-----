import instance from "../utils/network";

export interface NoticeData {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PopupNoticeData {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  displayOrder: number;
  webImage: string;
  appImage: string;
  webUrl: string;
  appUrl: string;
}

export function noticeList(): Promise<NoticeData[]> {
  return instance.get("/notice");
}

export function getPopupNoticeList(): Promise<PopupNoticeData[]> {
  return instance.get("/popup-notice/today-list");
}
