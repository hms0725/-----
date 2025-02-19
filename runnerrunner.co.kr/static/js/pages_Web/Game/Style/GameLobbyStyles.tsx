import styled from "styled-components";
import { GameTabWrapperProps } from "../Lobby/GameLobbyTab";
import { GameTab } from "../Hook/useGameAction";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";

export const GameLobbyWrapper = styled.div`
  position: relative;
  margin-bottom: 137px;
  margin-top: 67px;
  text-align: center;
`;
export const GameLobbyBannerWrapper = styled.div`
  margin-top: 17px;
  width: 100%;
  position: relative;
  padding: 0px 16px;

  > img {
    width: 100%;
  }
  > .title {
    position: absolute;
    text-align: left;
    padding-left: 15px;
    bottom: 35px;
    color: #fff;

    font-family: Pretendard;
    font-size: 17px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  > .description {
    position: absolute;
    left: 30px;
    bottom: 30px;
    color: #fff;

    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
  }

  > .progress-dots {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    gap: 10px;
    > .dot {
      border-radius: 10.5px;
      opacity: 0.9;
      background: #fff;
      width: 10px;
      height: 10px;
      transition: all 0.4s ease;
    }

    > .dot.active {
      width: 31px;
      height: 10px;
      border-radius: 10.5px;
      background: #ffd200;
      transition: all 0.4s ease;
    }
  }
`;

export const GameLobbyTabWrapper = styled.div<GameTabWrapperProps>`
  position: relative;
  margin-top: 20px;
  width: 100%;
  height: 27px;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(
    0.6turn,
    rgb(56, 54, 35),
    rgb(186, 100, 58),
    rgb(122, 221, 235)
  );

  border-image-slice: 1;
  > .tab {
    flex: 1;
    position: relative;
    z-index: 1;
    cursor: pointer;
    transition: color 0.3s ease;

    > .title {
      color: white;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      transition: color 0.3s ease;
    }
  }

  // 이동하는 배경
  > .background {
    position: absolute;
    top: 0;
    left: ${({ activeTab }) =>
      activeTab === GameTab.TOURNAMENT ? "0%" : "50%"};
    width: 50%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 205, 87, 0) 0%,
      #f2bf49 127.22%,
      #e0ad35 297.87%,
      #b68411 553.12%
    );
    z-index: 0;
    transition: left 0.5s ease;
  }
`;

export const GameLobbyTournamentWrapper = styled.div`
  margin-top: 10px;
  position: relative;
  width: calc(100% - 32px);
  color: white;
  left: 16px;
  align-items: center;
  border-radius: 8px;
  gap: 10px;
  padding: 15px 0px;
  background: rgba(31, 33, 39, 0.6);
  display: flex;
  flex-direction: column;
`;
export const GameLobbyTournamentInfoWrapper = styled.div`
  position: relative;
  text-align: center;
  width: calc(100% - 20px);
  height: 53px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  background: rgba(255, 255, 255, 0.1);
  .register-info-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &.selected {
    border-radius: 12px;
    height: 315px;
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 12px;
      padding: 1px;
      background: linear-gradient(10deg, #ba643a, #ffffff, #7addeb, #836623);
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }
`;

export const GameLobbyTournamentGameInfoWrapper = styled.div`
  position: relative;
  margin-left: 16px;
  width: calc(100% - 32px);
  height: calc(100% - 90px);
  color: white;
  .back {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 8px;
    background-size: cover;
    background-image: url(/image-web/game/lobby/tournament_button.png);

    .top {
      margin: 20px 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      > .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > .title {
          text-align: left;
          color: #fff;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.32px;
        }

        > .button {
          max-height: 25px;
          padding: 6.5px 15px;
          border-radius: 15px;
          background: #ff0101;
          color: #fff;
          font-family: Pretendard;
          font-size: 10px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }

      > .player-left {
        max-width: 126px;
        padding: 6.5px 15.5px;
        border-radius: 15px;
        background: #ffd101;
        color: var(--kakao-logo, #000);
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    .bottom {
      position: relative;
      display: flex;
      flex-direction: column;
      margin: 20px 10px;

      .info {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .partition {
          width: 1px;
          height: 15px;
          background: #fff;
        }
        .column {
          .title {
            color: #fff;
            text-align: center;
            font-family: Pretendard;
            font-size: 10px;
            font-style: normal;
            font-weight: 300;
            line-height: normal;
            margin: 5px 5px;
          }
          .content {
            color: #fff;
            text-align: center;
            font-family: Pretendard;
            font-size: 10px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
        }
      }
      .button {
        width: 100%;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background: var(--Purple-300, #6436e7);
      }
    }
  }
`;

export const GameLobbyTournamentInfoCountWrapper = styled.div`
  width: 46px;
  height: 33px;
  margin: 10px;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  > .date {
    width: 46px;
    height: 11px;
    gap: 0px;
    opacity: 0px;
    font-family: Pretendard;
    font-size: 9px;
    font-weight: 600;
    line-height: 10.74px;
    letter-spacing: -0.02em;
    text-align: left;
    color: white;
  }
  > .count {
    height: 18px;
    padding: 2px 6px;
    gap: 2px;
    border-radius: 8px;
    background: rgba(255, 209, 1, 1);
    color: rgba(0, 0, 0, 1);
    font-family: Pretendard;
    font-size: 9px;
    font-weight: 600;
    line-height: 10.74px;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const GameLobbyTournamentInfoTitleWrapper = styled.div`
  width: 50%;
  height: 30px;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  .image-container {
    margin-right: 4px;
    width: 56px;
    height: 34px;
    float: left;
    display: block;
    img {
      height: 100%;
    }
  }

  > .title-column {
    display: block;
    float: left;
    width: calc(100% - 44px);
    > .title {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: Pretendard;
      font-size: 14px;
      font-weight: 600;
      line-height: 16.71px;
      letter-spacing: -0.02em;
      text-align: left;
      margin-bottom: 3px;
    }
    > .sub-title {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: Pretendard;
      font-size: 9px;
      font-weight: 400;
      line-height: 10.74px;
      letter-spacing: -0.02em;
      text-align: left;
    }
  }
`;
export const GameLobbyTournamentInfoTimeWrapper = styled.div`
  display: block;
  width: 65px;
  height: 100%;
  margin-right: 10px;
  color: white;
  > .time-wrapper {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > .title {
      color: white;
      text-align: center;
      font-family: Pretendard;
      font-size: 9px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .time {
      color: white;
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -2%;
    }
  }
`;

export const GameLobbyHoldemWrapper = styled.div`
  margin-top: 20px;
  position: relative;
  calc(100% - 32px);
  color: white;
  border-radius: 8px;
  padding-top: 20px;
  padding-bottom:40px;
  background: rgba(31, 33, 39, 0.6);
  display: flex;
  flex-direction: column;
  gap:10px;
`;

export const GameInfoItemWrapper = styled.div`
  width: 100%;
  padding: 4px 16px 0px 16px;

  > .item-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    > .button {
      padding: 7px 17px;
      color: #fff;
      font-family: Pretendard;
      font-size: 9px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.18px;
      border-radius: 8px;
      background: #6436e7;
    }
    > .left-wrapper {
      display: flex;
      flex-direction: row;
      gap: 17px;
      > .group-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: center;
        width: 46px;
        > .room {
          color: #fff;
          font-family: Pretendard;
          font-size: 9px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.18px;
        }

        > .member-row {
          display: flex;
          flex-direction: row;
          gap: 2px;
          align-item: center;
          padding: 2px 6px;
          color: var(--kakao-logo, #000);
          font-family: Pretendard;
          font-size: 9px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.18px;
          border-radius: 8px;
          background: #ffd101;

          > span {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }

      > .game-info-wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;

        > img {
          width: 30px;
          height: 30px;
        }

        > .game-info-box {
          display: flex;
          flex-direction: column;
          gap: 1px;
          > .value {
            color: #fff;
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: -0.28px;
          }

          > .buy-in {
            text-align: left;
            color: #fff;
            font-family: Pretendard;
            font-size: 9px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.18px;
          }
        }
      }
    }
  }
`;
