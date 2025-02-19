import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../../../hooks/useScreenOrientation";

export const CouponWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100%;
  min-hight: 100svh;

  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  > .header {
    top: 0;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 11;
    background: white;
    @media ${MEDIA_DESKTOP} {
      position: static;
      bottom: unset;
      right: unset;
      left: unset;
      top: unset;
      transform: unset;
      height: unset;
      padding: 0;
      max-width: unset;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--Black-200, #b7b7b7);
      margin-bottom: 20px;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    > .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      @media ${MEDIA_DESKTOP} {
        bottom: unset;
        right: unset;
        left: unset;
        top: unset;
        position: static;
        transform: unset;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
`;

export const CouponTabWrapper = styled.div`
  z-index: 12;
  background: white;
  position: fixed;
  top: 47px;
  width: 100%;
  height: 28px;
  display: flex;
  flex-direction: row;
`;

export const CouponTabItem = styled.div<{ isSelected: boolean }>`
  flex: 1;
  hight: 18px;
  padding-bottom: 10px;
  background: white;

  color: ${(props) =>
    props.isSelected ? "var(--Black-400, #444)" : "#DEDEDE"};
  border-bottom: 1px solid
    ${(props) => (props.isSelected ? "#121212" : "#DEDEDE")};
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const CouponListWrapper = styled.div`
  width: 100%;
  display: flex;
  height: auto;
  min-height: 100vh;
  overflow-y: auto;
  flex-direction: column;
  gap: 12px;
  padding: 47px 16px 30px;
`;

export const CouponItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  > .left-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f2f2f2;
    border-radius: 12px 0px 0px 12px;
    > .type {
      width: fit-content;
      margin-top: 16px;
      margin-left: 16px;
      padding: 4px 8px;
      border-radius: 3px;
      background: linear-gradient(94deg, #6436e7 -1.37%, #ed00b9 116.07%);
      color: #fff;
      font-family: Pretendard;
      font-size: 6px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .title {
      margin-top: 5px;
      margin-left: 16px;
      color: #121212;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 15px; /* 107.143% */
    }

    > .date-title {
      margin-top: 17px;
      margin-left: 16px;
      color: #121212;
      font-family: Pretendard;
      font-size: 8px;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }

    > .date {
      margin-bottom: 16px;
      margin-left: 16px;
      color: #121212;
      font-family: Pretendard;
      font-size: 8px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  > .right-box {
    width: 139px;
    height: 104px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: linear-gradient(
      145deg,
      #6436e7 10.99%,
      #5e2be3 41.31%,
      #ed00b9 118.87%
    );

    > .dot-wrapper {
      position: absolute;
      top: 7.5px;
      right: -3.5px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      > .dot {
        width: 7px;
        height: 7px;
        background: white;
        border-radius: 7px;
      }
    }

    > img {
      width: 83px;
      height: 83px;
      border-radius: 83px;
      object-fit: cover;
      object-position: center;
    }
  }
`;
