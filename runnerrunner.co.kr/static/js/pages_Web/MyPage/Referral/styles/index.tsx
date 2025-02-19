import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../../../hooks/useScreenOrientation";

export const ReferralWrapper = styled.div<{ scrollLock: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100%;
  min-hight: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
  
  `}
  @media ${MEDIA_DESKTOP} {
    position: static;
    max-width: unset;
    top: unset;
    left: unset;
    padding-top: 0;
    height: unset;
  }
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
export const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 20px 30px;
  height: calc(100% - 113px);
  @media ${MEDIA_DESKTOP} {
    padding: 16px 0;
  }
`;
export const EventInfoWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 203px;

  background: rgba(100, 54, 231, 1);

  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const EventInfoContentWrapper = styled.div`
  position: relative;
  width: 245px;
  height: 150px;
  top: 26px;
  margin-bottom: 26px;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const EventTitleWrapper = styled.div`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 21.48px;
  text-align: center;
  color: white;
`;

export const EventImageRowWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 66px;
  align-items: center;
  justify-content: center;
`;

export const EventColWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const EventImageWrapper = styled.div`
  .image-box {
    width: 72px;
    height: 72px;
    border-radius: 72px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 72px;
    }
  }

  .target {
  }
`;

export const EventRewardWrapper = styled.div`
  position: relative;
  height: 34px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Pretendard;
  font-size: 11.22px;
  font-weight: 600;
  line-height: 12.02px;
  text-align: left;
  color: rgba(100, 54, 231, 1);
`;

export const DashBar = styled.div`
  position: absolute;
  top: 95px;
  width: 131px;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  border-top: 1px dashed rgba(255, 255, 255, 1);
`;

export const ShareButton = styled.div`
  position: relative;
  width: calc(100% - 32px);
  left: 16px;
  margin-top: 20px;
  padding: 15px;

  background: rgba(31, 159, 129, 1);
  border-radius: 8px;

  font-family: Pretendard;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.17px;
  text-align: center;
  color: white;
`;
