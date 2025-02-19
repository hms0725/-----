import styled from "styled-components";

export const CouponDetailWrapper = styled.div`
  position: fixed;
  z-index: 122;
  padding: 20px 15px;
  width: 308px;
  border-radius: 12px;
  background: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  > img {
    margin-top: 10px;
    width: 100%;
    max-height: 300px;
  }

  > .info-wrapper {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    > .type {
      padding: 4px 14px;
      border-radius: 15px;
      background: linear-gradient(94deg, #6436e7 -1.37%, #ed00b9 116.07%);
      color: #fff;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .close-at {
      color: #121212;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 300;
      line-height: normal;

      > span {
        margin-left: 5px;
        font-weight: 600;
      }
    }
  }

  > .notice-wrapper {
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    > .title {
      color: #121212;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .description {
      color: #121212;
      text-align: right;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }
  }

  > .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    > .title {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 22.4px */
    }
  }
`;

export const CouponDetailOverlay = styled.div`
  position: fixed;
  top: 0;
  z-index: 121;
  width: 100%;
  height: 100vh;
  opacity: 0.3;
  background: var(--kakao-logo, #000);
`;
