import styled from "styled-components";

export const PremiumStoreListWrapper = styled.div<{
  show: boolean;
  isTop: boolean;
}>`
  ${(props) => (props.isTop ? "top: 114px;" : "")}

  background-color: white;
  z-index: 101;
  margin-top: 20px;
  ${(props) => (props.show ? "" : "overflow:hidden;")}
  ${(props) => (props.isTop ? "padding-top: 48px;" : "")}
  
  transition: height 0.3s ease;
  width: 100%;
  &:nth-child(1) {
    padding-top: 70px;
  }

  > .bar {
    background: var(--Black-100, #f0f0f0);
    margin-top: 12px;
    width: 100%;
    height: 8px;
  }
  > .title {
    margin-left: 16px;
    color: #000;
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    letter-spacing: -0.4px;
  }
  > .line {
    position: relative;
    left: 50%;
    top: 5px;
    width: 40px;
    height: 5px;
    background: rgb(100, 54, 231);
    border-radius: 2.5px;
  }

  .list {
    .inner {
      margin: 12px 0px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
`;

export const PremiumStoreInfoTopWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  border-radius: 8px;

  > .info {
    position: relative;
    height: 100%;
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    color: white;
    flex: 1;
    padding: 16px 16px 0px;

    > .review-box {
      display: flex;
      flex-direction: row;
      gap: 5px;
      > .premium {
        width: 13px;
        height: 13px;
        top: 8px;
        left: 8px;
      }
      > .review-count {
        margin-left: 5px;
        color: #d9d9d9;
        text-align: center;
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.22px;
      }

      > .review-score {
        text-align: left;
        font-family: Pretendard;
        margin-left: 1px;
        font-weight: 700;
        font-size: 12px;
        margin-bottom: 2px;
        font-style: normal;
      }
    }
    > .title-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      text-align: center;
      margin-bottom: 2px;
      > .name {
        display: flex;
        gap: 5px;
        font-family: Pretendard;
        font-size: 16px;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: -0.02em;
        text-align: left;
      }
      > svg {
        pointer-events: visible;
      }
    }

    > .status-row {
      margin-top: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2px;
      color: white;
      > span {
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > span.bold {
        font-weight: 600;
      }
    }
  }
`;
export const PremiumStoreInfoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  overflow: hidden;
  gap: 12px;
  width: calc(100% - 32px);
  height: 162px;
  background: #fff;
  left: 50%;
  transform: translateX(-50%);
  > .thumbnail {
    width: 100%;
    height: 162px;
    background: gray;
    border-radius: 8px;
    overflow: hidden;
    position: absolute;
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 12px;
      padding: 1px;
      background: linear-gradient(
        259.19deg,
        rgba(0, 0, 0, 0.3) 42.53%,
        #000000 83.07%
      );
    }
    > .cover {
      border-radius: 8px;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

export const PremiumStoreInfoBottomWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  padding: 16px 12px;

  > .state {
    position: absolute;
    top: 84px;
    left: 12px;
    color: #fff;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding: 2.5px 5px;
    border-radius: 6px;
    background: #6436e7;
  }

  > .info {
    width: 90%;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.5);
    padding: 6px 10px;
    backdrop-filter: blur(2px);
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 2px;
    color: white;

    > .address {
      width: 90%;
      font-family: Pretendard;
      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: 13px;
      letter-spacing: -2%;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .info-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      gap: 8px;

      > .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 2px;

        > .icon {
          width: 16px;
          height: 16px;
        }

        > .text {
          color: #fff;
          font-family: Pretendard;
          font-size: 11px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.22px;
        }
      }
    }
  }
`;
export const PremiumStoreCircle = styled.svg`
  position: absolute;
  transform: rotate(0.25turn);
  width: 57px;
  height: 57px;
  background: #1b143f;
  border-radius: 438px;

  circle {
    fill: none;
    stroke-width: 8;
  }

  .background {
    stroke: #6d6d6d;
  }

  .progress {
    transition: stroke-dashoffset 0.35s;
    transform: scaleX(-1);
    transform-origin: center;
  }
`;

export const PremiumStoreTournamentInfoWrapper = styled.div<{ isIng: boolean }>`
  position: absolute;
  right: 16px;
  bottom: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 57px;
  height: 57px;
  border-radius: 57px;
  background: #d9d9d9;
  > .timer-info {
    position: absolute;
    display: flex;
    flex-direction: column;
    > .time {
      color: #fff;
      font-family: Pretendard;
      font-size: 11px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.22px;
    }

    > .lv {
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 9px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.18px;
    }
  }

  > span {
    position: absolute;
    color: #7d7d7d;
    text-align: center;
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.22px;
  }
`;
