import styled from "styled-components";

export const ReportNavigateWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  padding: 30px 16px 60px 16px;
  border-radius: 12px 12px 0px 0px;
  background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;

  > .button {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #121212;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.165px;
  }

  > .button.block {
    background: #f0f0f0;
  }
  > .button.report {
    color: white;
    background: #d91818;
  }
  > .button.close {
    background: #fff;
  }
`;
export const ReportNavigationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 0.3;
  z-index: 14;
  background: var(--kakao-logo, #000);
`;

export const ReportPopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 54px 15px 24px 15px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 32px;
  z-index: 9998;
  > span {
    color: var(--Black-500, #202020);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 22.4px */
  }

  > .button-wrapper {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 278px;
    > .button {
      color: var(--Purple-300, #6436e7);
      flex: 1;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      border-radius: 8px;
    }

    > .button.red {
      color: white;
      background: #d91818;
    }
  }
`;
