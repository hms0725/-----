import instance from "../utils/network";

export function attendanceCheck(): Promise<{ code: number; message: any }> {
  return instance.post(`/attendance`);
}
