import styled from "styled-components";

export const GameMyPageHistoryWrapper = styled.div`
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;

  > .title {
    color: #fff;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
    line-height: 140%;
    padding-bottom: 12px;
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
        left: 0;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px;
        position: absolute;
        overflow-y: auto;
        max-height: 162px;

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
          color: #fff;
          border: none;
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

  > .history-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;

    > .item {
      display: flex;
      flex-direction: row;
      padding: 10px;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      > .info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
        > .date {
          color: #fff;
          font-family: Pretendard;
          font-size: 9px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.18px;
        }

        > .result-wrapper {
          display: flex;
          flex-direction: row;
          gap: 8px;

          > img {
            height: 30px;
          }
          > .result {
            display: flex;
            flex-direction: column;
            gap: 2px;
            > .rank {
              color: #fff;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
              letter-spacing: -0.28px;
            }
            > .title {
              color: #dedede;
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

      > .point {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #fff;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
        > span {
          margin-left: 2px;
          color: #dedede;
          text-align: center;
          font-family: Pretendard;
          font-size: 9px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.18px;
        }
      }
    }
  }
`;

export const GameMyPageRanksWrapper = styled.div`
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  > .title {
    color: #fff;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
    line-height: 140%; /* 22.4px */
  }

  > .rank-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    width: 100%;

    > .item {
      padding: 10px;
      display: flex;
      flex-direction: row;
      gap: 5px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      align-items: center;
      > img {
        width: 25px;
        height: 25px;
      }
      > .count {
        color: #fff;
        text-align: right;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
      }
      > .other {
        color: #faff00;
        text-align: center;
        font-family: Pretendard;
        font-size: 9px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.18px;
      }
    }
  }
`;
export const GameMyPageRankingPointWrapper = styled.div`
  padding-top: 22px;
  width: 100%;
  display: flex;
  flex-direction: column;

  > .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-bottom: 8px;

    > .title {
      color: #fff;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 800;
      line-height: 140%; /* 16.8px */
    }

    > img {
      width: 20px;
      height: 20px;
    }
  }

  > .bar-wrapper {
    width: 100%;
    height: 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.3);
    > .bar {
      height: 100%;
      border-radius: 8px;
    }

    > .bar.BRONZE {
      background: linear-gradient(
          90deg,
          #ffa071 1.27%,
          #a04e25 63.84%,
          #d69555 122.1%
        ),
        rgba(255, 255, 255, 0.8);
    }
    > .bar.SILVER {
      background: linear-gradient(
        90deg,
        #c9d1d6 1.27%,
        #a9b0b5 63.84%,
        #767d82 122.1%
      );
    }
    > .bar.GOLD {
      background: linear-gradient(
        90deg,
        #ffcd57 1.27%,
        #e0ad35 63.84%,
        #b68411 122.1%
      );
    }
    > .bar.PLATINUM {
      background: linear-gradient(
        90deg,
        #bef7ff 1.27%,
        #57cfe0 63.84%,
        #1ca8e1 122.1%
      );
    }
    > .bar.DIAMOND {
      background: linear-gradient(
          90deg,
          #f1e5fd 1.27%,
          #543482 63.84%,
          #bd97fa 122.1%
        ),
        linear-gradient(90deg, #bef7ff 1.27%, #57cfe0 63.84%, #1ca8e1 122.1%);
    }
    > .bar.MASTER {
      background: linear-gradient(
          90deg,
          #aeff02 1.27%,
          #543482 63.84%,
          #f00 122.1%
        ),
        linear-gradient(90deg, #f1e5fd 1.27%, #543482 63.84%, #bd97fa 122.1%),
        linear-gradient(90deg, #bef7ff 1.27%, #57cfe0 63.84%, #1ca8e1 122.1%);
    }
  }

  > .bottom {
    padding-top: 4px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > .point {
      color: #fff;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 800;
      line-height: 140%; /* 14px */
    }

    > .description {
      color: #fff;

      text-align: right;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 300;
      line-height: 140%;

      > span {
        color: #fff;
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 700;
        line-height: 140%;
      }
    }
  }
`;
