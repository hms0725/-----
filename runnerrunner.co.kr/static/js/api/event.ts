import instance from "../utils/network";
import { Area } from "./area";

export interface RunnerEvent {
  id: number;
  url: string;
  link: string;
  title: string;
  description: string;
  startAt: string;
  closeAt: string;
  backgroundColor: string;
  endYn: string;
  detail?: string;
}

export function runnerEventList(params?: {
  endYn?: "Y" | "N";
  type?: "HOME" | "EVENT" | null;
}): Promise<RunnerEvent[]> {
  return instance.get(
    `/runner-event/list?endYn=${params?.endYn}&type=${params?.type}`
  );
}

export function runnerEventDetail(id: number): Promise<RunnerEvent> {
  return instance.get("/runner-event/" + id);
}
