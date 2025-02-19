import { useState } from "react";

export interface AttendanceCheckResponse {
  value: number;
  isCheck: boolean;
}

export const useAttendanceDialog = () => {
  const [data, setData] = useState<AttendanceCheckResponse[]>([]);

  const openAttendanceDialog = (data: AttendanceCheckResponse[]) => {
    setData(data);
  };

  const closeAttendanceDialog = () => {
    setData([]);
  };

  return {
    attendanceList: data,
    setAttendanceList: setData,
    openAttendanceDialog,
    closeAttendanceDialog,
  };
};
