import styled from "styled-components";

export const MenuInfoWrapper = styled.div`
  position: relative;
  width: calc(100% - 32px);
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 84px;

  > div {
    position: relative;
    width: 100%;

    .title-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-weight: 700;
        line-height: 23.87px;
        letter-spacing: -0.02em;
        text-align: left;
      }

      > .info-box {
        cursor: pointer;
        color: #c4c4c4;
        text-align: center;
        width: 60px;
        height: 20px;
        border-radius: 15px;
        border: 1px solid #c4c4c4;
        font-family: Pretendard;
        font-size: 10px;
        font-weight: 600;
        line-height: 17px;
      }
    }

    > .menu-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0px;
      padding-bottom: 20px;

      > .no-menu {
        width: 100%;
        margin-top: 20px;
        text-align: center;
        font-size: 16px;
        color: var(--Black-400, #444);
        grid-column: 1 / -1;
      }
    }
  }
`;

export const RankWrapper = styled.div<{
  isFixed: boolean;
  isPass: boolean;
  width: number;
}>`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: var(--Black-100, #f0f0f0);
  gap: 7px;
  position: relative;

  > .rank-box {
    display: flex;
    width: 100%;
    height: 46px;
    padding: 10px 15px;
    gap: 74px;
    border-radius: 8px;
    background: #fff;
    align-items: center;
    justify-content: space-between;
    transition: transform 0.5s ease, opacity 0.5s ease;

    &.blur {
      filter: blur(2px);
    }

    &.my-rank {
      border: 2px solid #6436e7;
      position: fixed;
      width: ${({ width }) => width - 32}px;
      top: ${({ isPass }) => (isPass ? "7%" : "80%")};
      z-index: 1;
      opacity: ${({ isFixed }) => (isFixed ? 1 : 0)};
      transition: opacity 0.3s ease;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 13px;
    }

    &.border {
      border: 2px solid #6436e7;
      padding: 8px 13px;
    }

    > .box {
      flex: 1;
      display: flex;
      gap: 10px;
      font-family: Pretendard;
      font-size: 10px;
      font-weight: 700;
      align-items: center;

      > .rank {
        width: 30px;
      }

      > .name {
        font-family: Pretendard;
        font-size: 12px;
        font-weight: 700;
        text-align: left;
      }

      > .icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Pretendard;
        font-size: 7px;
        font-weight: 600;
        gap: 3px;
      }

      > .score {
        font-family: Pretendard;
        font-size: 9px;
        font-weight: 600;
        flex: 0.55;
        text-align: right;

        > span {
          font-size: 12px;
        }
      }
    }

    .box:nth-of-type(2) {
      justify-content: flex-end;
    }
  }
`;

export const RankPopup = styled.div`
  width: 90%;
  box-sizing: border-box;
  border-radius: 12px;
  background: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  padding: 30px 20px;

  > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .title {
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 800;
    }
  }

  > .rank-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 7px;
    padding: 20px 0;

    > .rank {
      height: 50px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      padding: 10px;
      justify-content: space-between;

      &.i0 {
        background: linear-gradient(
          90deg,
          #ffa071 1.27%,
          #a04e25 63.84%,
          #d69555 122.1%
        );
      }
      &.i1 {
        background: linear-gradient(
          90deg,
          #c9d1d6 1.27%,
          #a9b0b5 63.84%,
          #767d82 122.1%
        );
      }
      &.i2 {
        background: linear-gradient(
          90deg,
          #ffcd57 1.27%,
          #e0ad35 63.84%,
          #b68411 122.1%
        );
      }
      &.i3 {
        background: linear-gradient(
          90deg,
          #f1e5fd 1.27%,
          #543482 63.84%,
          #bd97fa 122.1%
        );
      }
      &.i4 {
        grid-column: span 2;
        background: linear-gradient(
          90deg,
          #aeff02 1.27%,
          #543482 63.84%,
          #ff0000 122.1%
        );
        padding: 10px 15px;
      }

      > .left {
        display: flex;
        align-items: center;
        gap: 8px;

        > .name {
          font-family: Pretendard;
          font-size: 10px;
          font-weight: 800;
          color: #fff;

          &.master {
            font-family: Pretendard;
            font-size: 15px;
            font-weight: 800;
          }
        }
      }

      > .value {
        font-family: Pretendard;
        font-size: 9px;
        font-weight: 600;
        text-align: center;
        color: #fff;

        > span {
          font-family: Pretendard;
          font-size: 8px;
          font-weight: 600;
          color: #c9c9c9;
        }
      }
    }
  }

  > .info-box {
    > .title {
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 10px;
    }

    > .info {
      background: #f0f0f0;
      width: 100%;
      border-radius: 8px;
      padding: 20px;

      > .sub-title {
        font-family: Pretendard;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 12px;
      }

      > .rank {
        display: flex;
        padding-bottom: 15px;
        border-bottom: 1px solid #fff;
        margin-bottom: 15px;

        > .box {
          width: 17%;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Pretendard;
          font-size: 7px;
          font-weight: 600;
          color: #8f8f8f;

          > .point {
            font-family: Pretendard;
            font-size: 10px;
            font-weight: 600;
            color: #121212;
          }
        }
      }

      > .point {
        font-family: Pretendard;
        font-size: 10px;
        font-weight: 600;
        margin-bottom: 15px;
      }
    }
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
`;
