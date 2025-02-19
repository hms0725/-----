import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";

export const ModifyProfileWrapper = styled.div<{
  scrollLock: boolean;
}>`
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
  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
    @media ${MEDIA_DESKTOP} {
      margin-top: 20px;
      border-top: 2px solid var(--Black-200, #808080);
    }
  }

  > .floating-button-wrapper {
    background: transparent;
    position: fixed;
    bottom: 48px;
    padding: 30px 24px 48px;
    width: 100%;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    @media ${MEDIA_DESKTOP} {
      position: static;
      max-width: unset;
      top: unset;
      left: unset;
      bottom: unset;
      padding: 0;
      transform: unset;
    }
  }

  > .header {
    top: 0;
    position: fixed;
    width: 100%;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
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
export const HorizontalBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(p) => p.theme.color.black100};
  @media ${MEDIA_DESKTOP} {
    background: ${(p) => p.theme.color.black300};
    height: 2px;
  }
`;
export const DefaultInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px 30px;
  background: white;
  @media ${MEDIA_DESKTOP} {
    padding: 20px 0;
  }

  > .title {
    width: 100%;
    text-align: left;
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
    @media ${MEDIA_DESKTOP} {
      font-size: 18px;
    }
  }

  > .sub-title {
    width: 100%;
    text-align: left;
    margin-top: 8px;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;
export const TextBox = styled.div`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--Black-200, #b7b7b7);
  background: var(--Black-100, #f0f0f0);
  color: var(--Black-300, #808080);
  text-align: left;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  flex-grow: 1;
`;
export const BasicInfoWrapper = styled(DefaultInfoWrapper)`
  > .box {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    @media ${MEDIA_DESKTOP} {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    > .item {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 8px;
      @media ${MEDIA_DESKTOP} {
        gap: 0;
      }
      > .title {
        width: 80px;
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-align: left;
        flex-shrink: 0;
      }
    }
  }
`;
export const VerificationWrapper = styled(DefaultInfoWrapper)`
  > .verified-box {
    border-radius: 8px;
    background: var(--Purple-100, #f0eaff);
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 6px;
    padding: 12px 0;

    > .title {
      padding: 4px 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 4px;
      color: var(--Purple-300, #6436e7);
      text-align: right;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;

      > img {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }
    }

    > .description {
      color: var(--Black-300, #808080);
      text-align: right;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.24px;
    }
  }

  > .no-box {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 12px;

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }

    > .description {
      color: var(--Black-300, #808080);
      text-align: right;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.24px;
    }

    > .button {
      margin-top: 8px;
      gap: 4px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 14px 16px;
      color: var(--Black-400, #444);
      text-align: right;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
      border-radius: 24px;
      border: 1px solid var(--Black-300, #808080);

      > img {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }
    }
  }
`;
export const AdditionalInfoWrapper = styled(DefaultInfoWrapper)`
  padding-bottom: 73px;
  @media ${MEDIA_DESKTOP} {
    padding-bottom: 0;
  }
  > .input-box {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 30px;

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }

    > input {
      width: 100%;
      margin-top: 20px;
      padding: 10px 12px;
      border-radius: 4px;
      border: 1px solid var(--Black-200, #b7b7b7);
      background: var(--Black-100, #f0f0f0);
      outline: none;
      color: var(--Black-300, #808080);
      text-align: left;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    > .description {
      margin-top: 12px;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.24px;
      text-align: left;
    }

    > .list {
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 12px;

      > .row {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        gap: 12px;

        > .checkbox {
          width: 20px;
          height: 20px;
          flex-shrink: 0;

          > circle {
            transition: all 0.3s;
            fill: ${(p) => p.theme.color.black200};
          }
        }

        > .checkbox.checked {
          > circle {
            fill: ${(p) => p.theme.color.purple300};
          }
        }

        > .checkbox.disabled {
          cursor: not-allowed;

          > path {
            stroke: ${(p) => p.theme.color.black200};
          }

          > circle {
            fill: ${(p) => p.theme.color.black300};
          }
        }

        > .text {
          flex-grow: 1;
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.28px;
        }

        > .button {
          padding-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
          color: var(--Black-200, #b7b7b7);
          text-align: right;
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          letter-spacing: -0.26px;
        }

        > .quit {
          border: #d91818 solid 1px;
          color: #d91818;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          padding: 5px 10px;
        }
      }
    }

    > .radio-row {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 30px;

      > .item {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;

        > .text {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.28px;
        }

        .border {
          transition: all 0.3s;
          stroke: ${(p) => p.theme.color.black200};
        }

        .inner {
          transition: all 0.3s;
          fill: transparent;
        }
      }

      > .item.selected {
        .border {
          stroke: ${(p) => p.theme.color.purple300};
        }

        .inner {
          fill: ${(p) => p.theme.color.purple300};
        }
      }
    }

    > .withdraw-button {
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 600;
      line-height: 19.09px;
      letter-spacing: -0.02em;
      text-align: left;
      color: rgba(128, 128, 128, 1);
    }
    > .edit-button {
      cursor: pointer;
      width: 100%;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      border-radius: 8px;
      text-align: center;
      padding: 15px 0;
      background: var(--Purple-300, #6436e7);
      margin-top: 30px;
    }
    > .edit-button:active {
      background: #502bb5;
    }
  }

  > .input-box.top {
    margin-top: 20px;
  }
`;

export const PasswordButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 16px;

  > .button {
    position: relative;
    flex: 1;
    padding: 8px 12px 8px 12px;
    border-radius: 4px;
    background: #ffffff;
    border: 1px solid var(--Black-200, #b7b7b7);

    font-family: Pretendard;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.71px;
    text-align: center;
    color: var(--Black-300, #808080);
  }
`;
