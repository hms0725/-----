import styled from "styled-components";

export const GameCommonPopupWrapper = styled.div`
  position: fixed;
  top: 0px;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;

  > .content {
    position: fixed;
    width: 308px;

    border: 1px solid transparent;

    border-radius: 12px;
    background-image: linear-gradient(#000, #000),
      linear-gradient(
        to right,
        #ba643a 25%,
        #ffffff 50%,
        #7addeb 75%,
        #836623 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    > .wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 24px 15px;
      > .cancel {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      > .title {
        white-space: pre-line;
        text-align: center;
        width: 155px;
        color: #fff;
        text-align: center;
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 28px */
      }

      > .button {
        margin-top: 35px;
        width: 100%;
        height: 48px;
        border-radius: 8px;
        background: var(--Purple-300, #6436e7);
        display: flex;
        justify-content: center;
        align-items: center;
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
  }
`;
