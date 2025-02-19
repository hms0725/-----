import { atom } from "recoil";

export interface ReportProps {
  title: string;
  type: string;
  description: string;
  reportType: string;
  reportId: number;
  afterReport: () => void;
}

export const reportState = atom<ReportProps | null>({
  key: "report",
  default: null,
});
