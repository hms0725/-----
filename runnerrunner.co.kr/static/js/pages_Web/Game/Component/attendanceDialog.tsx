import { useEffect, useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import {
  AttendanceDialogHeader,
  AttendanceDialogWrapper,
  AttendanceRewardItem,
  AttendanceRewardListWrapper,
} from "../Style/AttendanceDialogStyles";

export const AttendanceDialog = () => {
  const { attendanceList, closeAttendanceDialog, getUserTicket } =
    useGameContext();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const totalValue = attendanceList.reduce(
      (sum, item) => sum + item.value,
      0
    );
    setTotal(totalValue);
  }, []);
  return (
    <AttendanceDialogWrapper>
      <div className="content">
        <div className="wrapper">
          <AttendanceDialogHeader>
            <div className="title">출석 체크 이벤트</div>
            <img
              alt="취소"
              src="/image-web/game/popup/attendance/cancel.svg"
              onClick={() => {
                getUserTicket();
                closeAttendanceDialog();
              }}
            />
          </AttendanceDialogHeader>
          <div className="description">
            매일 방문하셔서 출석 도장을 찍어주세요!
            <br /> 출석 횟수에 따라 한주{" "}
            <span>최대 {total.toLocaleString()}GP</span>을 드립니다!
          </div>

          <AttendanceRewardListWrapper>
            {attendanceList.map((item, index) => (
              <AttendanceRewardItem key={index}>
                <div className="day">{index + 1}일차</div>
                {item.isCheck ? (
                  <img
                    src="/image-web/game/popup/attendance/chip_active.png"
                    alt="칩"
                  />
                ) : (
                  <img
                    src="/image-web/game/popup/attendance/chip.png"
                    alt="칩"
                  />
                )}
                {item.isCheck ? (
                  <div className="label check">지급완료</div>
                ) : (
                  <div className="label">{item.value.toLocaleString()} GP</div>
                )}
              </AttendanceRewardItem>
            ))}
          </AttendanceRewardListWrapper>
        </div>
      </div>
    </AttendanceDialogWrapper>
  );
};
