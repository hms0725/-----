import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";

export const GameRankWrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow-y: auto;
  left: 16px;
  width: calc(100% - 32px);

  > .banner {
    position: relative;
    margin-top: 50px;
    width: 100%;
  }
  > .rank-wrapper {
    position: relative;
    width: 100%;
    border-radius: 8px;
    background: rgba(31, 33, 39, 0.6);
    margin-bottom: 140px;

    > .info {
      z-index: 100;
      position: absolute;
      top: 16px;
      right: 16px;
      border-radius: 15px;
      border: 1px solid #c4c4c4;
      padding: 4px 7px;
      color: #c4c4c4;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;

export const GameRankBannerWrapper = styled.div`
  margin-top: 67px;
  width: 100%;
  position: relative;

  > img {
    width: 100%;
  }

  > .title {
    position: absolute;
    left: 10px;
    bottom: 47px;
    color: #fff;

    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  > .description {
    position: absolute;
    left: 10px;
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

export const GameRankPodiumWrapper = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  color: white;
  display: flex;
  > img {
    width: 100%;
  }
  > .podium {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    width: 33%;
    text-align: center;
    .rank {
      margin-top: 10px;
      color: #000;
      text-align: center;
      font-family: Pretendard;
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      opacity: 0.6;
    }

    .point {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      color: #fff;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;

      > span {
        color: #fff;
        margin-left: 2px;
        text-align: center;
        font-family: Pretendard;
        font-size: 9px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.18px;
      }
    }

    .nick {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.26px;
      img {
        width: 30px;
        margin-right: 2px;
      }
    }

    .profile-row {
      position: relative;
      height: 118px;
      .frame {
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translate(-50%);
        width: 108px;
        height: 120px;
      }
      .profile {
        position: absolute;
        top: 47px;
        left: 50%;
        transform: translate(-50%);
        width: 43px;
        height: 43px;
        border-radius: 43px;
      }
    }

    > .podium-1 {
      border-radius: 15px 15px 0px 0px;
      background: linear-gradient(
        0deg,
        rgba(228, 238, 244, 0) 0%,
        #bec4c6 101.51%
      );

      height: 50%;
    }
    > .podium-2 {
      border-radius: 15px 15px 0px 0px;
      background: linear-gradient(
        0deg,
        rgba(255, 249, 113, 0) 0%,
        #ffe345 101.51%
      );
      height: 40%;
    }
    > .podium-3 {
      border-radius: 15px 15px 0px 0px;
      background: linear-gradient(
        0deg,
        rgba(160, 78, 37, 0) 0%,
        #d69555 101.51%
      );
      height: 30%;
    }
  }
`;

export const GameRankListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: white;
  > .empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;

    > img {
      margin-top: 80px;
      width: 180px;
      object-fit: contain;
    }

    > .empty-text {
      width: 100%;
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .filter {
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding-bottom: 8px;
    > .sort-wrapper {
      flex-shrink: 0;
      position: relative;
      padding: 7px 8px 7px 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 2px;
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

      > span {
        cursor: pointer;
      }

      > .dim {
        top: 0;
        left: -12px;
        position: absolute;
        width: 4px;
        height: 30px;
        background: linear-gradient(
          270deg,
          #fff 0%,
          rgba(255, 255, 255, 0) 100%
        );
      }

      > .sort-popup {
        width: max-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 12px;
        position: absolute;
        right: -20px;
        top: 36px;
        z-index: 9999;
        border-radius: 8px;
        background: #2e2d2f;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);

        > .item {
          width: 100%;
          cursor: pointer;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          border: 1px solid #c8c8c8;
          color: rgba(217, 217, 217, 0.85);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }

        > .item.selected {
          border: none;
          color: #fff;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          background: var(--Purple-300, #6436e7);
        }
      }
    }
  }

  .item.no {
    text-align: center;
    width: 40px;
    flex-shrink: 0;
    @media ${MEDIA_DESKTOP} {
      width: 40px;
      height: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--Black-300, #808080);
      text-align: center;
      leading-trim: both;
      text-edge: cap;
      font-family: "yg-jalnan";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      border-radius: 20px;
      background: var(--Black-100, #f0f0f0);
    }
  }

  .item.nickname {
    text-align: center;
    width: 120px;
    flex-shrink: 0;
  }

  > .inner {
    flex-grow: 1;
    margin-top: 10px;
    width: 100%;
    max-height: calc(100% - 1px);
    overflow-y: scroll;

    > .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 7px;

      > .no-data {
        font-size: 12px;
        width: 100%;
        text-align: center;
        padding: 20px;
        color: #b7b7b7;
      }
    }
  }

  > .pagination-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 25px;
    padding-bottom: 10px;
    @media ${MEDIA_DESKTOP} {
      border-top: 1px solid #b7b7b7;
      width: ;
    }
    > .button {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid var(--Purple-100, #f0eaff);
      background: #fff;
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-400, #444);
        border: none;
      }

      > svg {
        width: 20px;
        height: 20px;
      }
    }

    > .button.selected {
      border: 1px solid var(--Purple-300, #6436e7);
      color: var(--Purple-300, #6436e7);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 142.857% */
      @media ${MEDIA_DESKTOP} {
        border: none;
      }
    }

    > .button.disabled {
      opacity: 0.2;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`;

export const GameRankItemWrapper = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  justify-content: space-between;
  @media ${MEDIA_DESKTOP} {
    padding: 12px;
    border-top: 1px solid var(--Gray-100, #f0f0f0);
  }
  .nickname {
    width: 30%;
    display: flex;
    align-items: center;
    .profile {
      width: 30px;
      height: 30px;
      border-radius: 30px;
      margin-right: 10px;
    }
  }

  > .tier {
    display: flex;
    flex-direction: column;
    gap: 1px;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    > img {
      width: 25px;
      height: 25px;
    }

    > span {
      color: #dedede;
      text-align: center;
      font-family: Pretendard;
      font-size: 7px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.14px;
    }
  }

  > .item {
    &.point {
      text-align: end;
      width: 40%;

      > span {
        font-size: 9px;
      }
    }

    &.no {
      text-align: start;
    }

    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;
