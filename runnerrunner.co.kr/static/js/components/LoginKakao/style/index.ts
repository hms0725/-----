import styled from "styled-components";

export const LoginToKakaoWrapper = styled.div`
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

export const LoginToKakaoTitle = styled.div`
  color: var(--Black-500, #202020);
  text-align: center;
  font-family: Pretendard;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 19.6px */
  
  > .sub {
    margin-top: 10px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 1.4;
  }
`;

export const LoginToKakaoOverlay = styled.div`
  top: 0;
  position: fixed;
  opacity: 0.3;
  background: #000;
  width: 100%;
  height: 100vh;
  z-index: 1001;
`;

export const LoginTokakaoButton = styled.div`
  margin-top: 30px;
  width: 100%;
  height: 40px;
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
  background: #6436E7;
`;
