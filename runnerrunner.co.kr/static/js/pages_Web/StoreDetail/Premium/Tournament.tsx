import React from "react";
import styled from "styled-components";
import { PubTournament, TimerInfoState } from "../../../../api/types";
import { useHistory } from "react-router-dom";

const TournamentWrapper = styled.div<{ progress: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 20px;
  padding: 16px;
  width: 100%;
  border-radius: 8px;

  background: white;
  color: black;

  .col {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .row {
    justify-content: space-between;
    display: flex;
    flex-direction: row;
  }

  .content {
    width: 100%;
    .line {
      border: 1px solid rgba(0, 0, 0, 1);
    }
  }

  .current {
    color: black;
    background: rgba(236, 240, 243, 1);
    height: 41px;
    border-radius: 8px;
    flex: 1;
  }

  .next {
    color: white;
    background: rgba(217, 217, 217, 1);
    height: 41px;
    border-radius: 8px;
    flex: 1;
  }

  .blind-col {
    gap: 5px;
    .blind-name {
      padding: 6px 6px 0px 6px;
      width: 100%;
      font-family: Pretendard;
      font-size: 8px;
      font-weight: 500;
      line-height: 9.55px;
      text-align: left;
    }

    .blind {
      padding: 5px;
      font-family: Pretendard;
      font-size: 10px;
      font-weight: 600;
      line-height: 11.93px;
      text-align: left;
    }
  }

  .time-lv {
    justify-content: start;

    .time-box {
      position: relative;
      margin-top: 12px;
      width: 73px;
      height: 73px;
      border-radius: 14px;
      background: rgba(100, 54, 231, 1);
      display: flex;
      justify-content: center;
      align-items: center;

      .donut-container {
        position: relative;
        top: 8px;
        left: 8px;
        width: 57px;
        height: 57px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .donut-border {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        border: 4px solid transparent;
        border-color: white;
      }

      .donut-progress {
        position: absolute;
        right: 0px;
        transform: rotateZ(${(props) => 360 - (360 * props.progress) / 100}deg);
      }

      .time {
        color: white;
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        top: 28px;
        left: 18px;
      }
    }
    .lv-col {
      margin-top: 12px;
      margin-left: 12px;
      justify-content: space-between;
      flex: 1;
      .lv {
        font-family: Pretendard;
        font-size: 20px;
        font-weight: 600;
        line-height: 23.87px;
        letter-spacing: -0.02em;
        text-align: left;
      }
      .break {
        font-family: Pretendard;
        font-size: 10px;
        font-weight: 400;
        line-height: 11.93px;
        text-align: left;
      }

      .break-time {
        margin-top: 4px;
        font-family: Pretendard;
        font-size: 15px;
        font-weight: 700;
        line-height: 17.9px;
        text-align: left;
      }
    }
  }

  .title {
    font-family: Pretendard;
    font-size: 15px;
    font-weight: 700;
    line-height: 17.9px;
    text-align: left;
  }

  .player {
    font-family: Pretendard;
    font-size: 10px;
    font-weight: 300;
    line-height: 11.93px;
    text-align: right;
    span {
      font-family: Pretendard;
      font-size: 10px;
      font-weight: 600;
      line-height: 11.93px;
      text-align: right;
    }
  }
`;
const ReservationButton = styled.div<{ isOpen: boolean }>`
  position: relative;
  border-radius: 8px;
  color: white;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 600;
  line-height: 17.9px;
  letter-spacing: -0.16500000655651093px;
  text-align: center;
  padding: 8.5px 0px;
  margin-top: 12px;

  background: ${(p) =>
    p.isOpen
      ? "var(--Purple-300, rgba(100, 54, 231, 1))"
      : "rgba(217, 217, 217, 1)"};
`;
const CircularProgress = styled.svg`
  width: 57px;
  height: 57px;
  border-radius: 50%;
  transform: rotate(0.25turn);

  circle {
    fill: none;
    stroke-width: 8;
  }

  .background {
    stroke: #fff;
  }

  .progress {
    transition: stroke-dashoffset 0.35s;
    transform: scaleX(-1);
    transform-origin: center;
  }
`;

interface TournamentInfoProps {
  item: PubTournament;
  timer: TimerInfoState;
}

const PremiumExtraInfo: React.FC<TournamentInfoProps> = ({ item, timer }) => {
  const history = useHistory();

  const canReservation = (pubTournament: PubTournament): boolean => {
    return pubTournament.reservation
      ? pubTournament.registerDeadlineLevel >
        pubTournament.timeInfo.currentLevel.level
        ? true
        : false
      : false;
  };

  const radius = 28.5;
  const circumference = 2 * Math.PI * radius;

  return (
    <TournamentWrapper progress={timer?.progress ? timer?.progress : 0}>
      <div className="content">
        <div className="row">
          <div className="title">{item.title}</div>
          <div className="player">
            PLAYERS{" "}
            <span>{` ${item.userCount}/${
              item.entryUserCount + item.reBuyInUserCount + item.adOnUserCount
            }`}</span>
          </div>
        </div>
        <div className="row time-lv">
          <div className="time-box">
            <CircularProgress>
              <circle className="background" r={28.5} cx="28.5" cy="28.5" />
              <circle
                className="progress"
                r={28.5}
                cx="28.5"
                cy="28.5"
                stroke="url(#gradient)"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={
                  timer.currentLevel.type === "READY"
                    ? 0
                    : (circumference * -timer.progress) / 100
                }
              />
              <defs>
                <radialGradient
                  id="gradient"
                  cx="95%"
                  cy="50%"
                  r="80%"
                  fx="100%"
                  fy="50%"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="49.5%" stopColor="#FF8787" />
                  <stop offset="100%" stopColor="#FF0000" />
                </radialGradient>
              </defs>
            </CircularProgress>
            <div className="time">{timer.remainingTimeInCurrentLevel}</div>
          </div>

          <div className="col lv-col">
            <div className="lv">
              {timer.currentLevel.type === "BREAK"
                ? "BREAK"
                : timer.currentLevel.type === "READY"
                ? "준비중"
                : `LV ${timer.currentLevel.level}`}
            </div>
            <div className="row blind-col">
              <div className="col current">
                <div className="blind-name">
                  {`${
                    timer.currentLevel.type === "READY" ? "시작" : "현재"
                  } BLIND`}{" "}
                </div>
                <div className="blind">
                  {timer.currentLevel.type === "BREAK"
                    ? "BREAK"
                    : `${timer.currentLevel.smallBlind} / ${timer.currentLevel.bigBlind} (${timer.currentLevel.ante})`}
                </div>
              </div>
              <div className="col next">
                <div className="blind-name">다음 BLIND</div>
                <div className="blind">
                  {timer.nextLevel.type === "BREAK"
                    ? "BREAK"
                    : `${timer.nextLevel.smallBlind} / ${timer.nextLevel.bigBlind} (${timer.nextLevel.ante})`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReservationButton
          isOpen={canReservation(item)}
          onClick={() => {
            if (canReservation(item))
              history.push(`/reservation/${item.reservation!.id}`);
          }}
        >
          {!item.isEnd && !item.timerDto
            ? item.reservation
              ? `예약하기 (${item.numberOfReservation}명 예약중)`
              : "시작 준비 중"
            : `${canReservation(item) ? "현재 엔트리" : "레지마감"} ${
                item.userCount
              }/${
                item.adOnUserCount + item.entryUserCount + item.reBuyInUserCount
              }`}
        </ReservationButton>
      </div>
    </TournamentWrapper>
  );
};

export default PremiumExtraInfo;
