import styled from "styled-components";

export const ChangeForKakaoWrapper = styled.div`
  z-index: 1001;
  width: 332px;
  padding: 30px 15px 24px 15px;
  border-radius: 12px;
  background: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
`;

export const ChangeForKakaoTitle = styled.div`
  color: var(--Black-500, #202020);
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
`;

export const ChangeForKakaoSubTitle = styled.div`
  color: #808080;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 16.8px */
  margin-top: 8px;
  margin-bottom: 30px;
`;

export const ChangeForKakaoOverlay = styled.div`
  top: 0;
  position: fixed;
  opacity: 0.3;
  background: #000;
  width: 100%;
  height: 100vh;
  z-index: 1001;
`;

export const ChangeForKakaoInputWrapper = styled.div`
  width: 100%;
  padding: 15px 12px;
  border-radius: 8px;
  border: 1px solid var(--Black-100, #f0f0f0);
  margin-bottom: 6px;
  > input {
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;
    width: 100%;
    outline: none;
    border: none;
  }
`;

export const ChangeForKakaoInputLabel = styled.div<{ success: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  color: ${(p) => p.theme.color.purple200};
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 20px;
  > svg {
    > circle {
      transition: all 0.3s;
      fill: ${(p) =>
        p.success ? p.theme.color.purple200 : p.theme.color.black200};
    }
  }
`;

export const ChangeForKakaoButton = styled.div<{ success: boolean }>`
  margin-top: 10px;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.165px;
  border-radius: 8px;
  background: ${(p) => (p.success ? "#6436E7" : "#D1C3F8")};
`;
