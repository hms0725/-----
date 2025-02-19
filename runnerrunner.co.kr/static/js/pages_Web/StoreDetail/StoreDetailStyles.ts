import styled from "styled-components";

export const StoreDetailWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  overscroll-behavior: none;
  > div {
    scroll-margin-top: 108px;
  }

  ${(p) =>
    p.scrollLock
      ? `
        overflow-y: hidden;
    `
      : `
      overflow-y: scroll;
    `}
  > .header {
    z-index: 101;
    transition: all 0.1s ease-in-out;
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
    justify-content: flex-start;
    padding: 0 20px;
    gap: 8px;

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      transition: all 0.1s ease-in-out;
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      opacity: 0;
    }

    > .button {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      cursor: pointer;
      color: var(--Black-200, #b7b7b7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }

  > .header.show {
    background: white;

    > .title {
      opacity: 1;
    }

    > .close {
      svg {
        path {
          stroke: var(--Black-400, #444);
        }
      }
    }
  }
`;
export const HorizontalBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--Black-100, #f0f0f0);
`;
