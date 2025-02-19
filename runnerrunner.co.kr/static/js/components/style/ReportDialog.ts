import styled from "styled-components";

export const ReportMainWrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 9998;
  width: 100%;
  height: 100vh;
  background: var(--kakao-logo, #000);
  opacity: 0.3;
`;

export const Report24HourWrapper = styled.div`
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

  > .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 278px;
    height: 48px;
    border-radius: 8px;
    background: #d91818;
    color: #fff;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.165px;
  }
`;
export const ReportWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 32px 30px 24px 30px;
  width: 308px;
  height: 400px;
  border-radius: 12px;
  background: #fff;
  z-index: 9998;
  > .title {
    width: 100%;
    color: var(--Black-500, #202020);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 22.4px */
  }

  > .description {
    color: var(--Black-200, #b7b7b7);
    margin-top: 10px;
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > .button-wrapper {
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;

    > .cancel-button {
      width: 135px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--Purple-300, #6436e7);
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }

    > .report-button {
      width: 135px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      background: #d91818;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }
  }

  > .input-box {
    border-radius: 4px;
    margin-top: 8px;
    width: 100%;
    height: 84px;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    > textarea {
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      resize: none;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .report-list-wrapper {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 36px;
    row-gap: 16px;

    > .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;

      > span {
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 22.4px */
      }
    }
  }
`;
