import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";

export const MyPageWrapper = styled.div`
  width: 100%;
  height: 100%
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: white;
  position: relative;
  margin-top: 48px;
  padding-bottom:24px;
  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
    overscroll-behavior: none;
  }
`;

export const MyPageHeader = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  z-index: 1000;
  flex-direction: row;
  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    .close {
      cursor: pointer;
      width: 20px;
      height: 20px;
      margin-top: 2px;

      > img {
        width: 100%;
        height: 100%; 
      }
    }

    .title {
      color: #444;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 600;

      @media ${MEDIA_DESKTOP} {
        font-size: 24px;
        font-weight: 700;
      }
    }
  }
  .right {
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

export const HorizontalBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(p) => p.theme.color.black100};
`;

export const MyProfileWrapper = styled.div<{
  scrollLock: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px 20px;
  ${(p) =>
    p.scrollLock
      ? `
    overflow-y: hidden;
  `
      : ``};

  > .profile-row {
    width: 100%;
    display: flex;
    flex-direction: row;

    justify-content: flex-start;
    gap: 16px;

    > .profile {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      background: gray;
      position: relative;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .edit {
        position: absolute;
        width: 24px;
        height: 24px;
        background-image: url(/image-web/Icon/Edit-Profile-Img.svg);
        bottom: 0;
        right: 0;
      }
    }

    > .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;

      > .info-top {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        > .address {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 15px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.3px;
        }
        > .tag-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 4px;

          > .tag {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 2px;
            border-radius: 2px;
            padding: 4px;
            border: 1px solid ${(p) => p.theme.color.purple100};

            > img {
              width: 16px;
            }

            color: ${(p) => p.theme.color.purple300};
            text-align: right;
            font-family: Pretendard;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: -0.24px;
          }
        }

        > .nickname {
          margin-top: 4px;
          color: ${(p) => p.theme.color.black400};
          font-family: Pretendard;
          font-size: 20px;
          font-style: normal;
          font-weight: 800;
          line-height: normal;
          letter-spacing: -0.4px;
        }
      }
    }
  }
`;

export const ButtonRowWrapper = styled.div`
  border-radius: 15px;
  background: #6436e7;
  margin-top: 20px;
  height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  > .bar {
    width: 1px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const ButtonWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
`;
export const TopButtonWrapper = styled(ButtonWrapper)`
  > span {
    text-align: center;
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  > img {
    width: 35px;
    height: 35px;
  }
`;

export const NoticeWrapper = styled.div`
  width: 100%;
  padding: 0 16px;

  > .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;

    > span {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.32px;
    }

    > .more-button {
      display: flex;
      flex-direction: row;
      gap: 4px;
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
  > .list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    > .item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      > .line {
        height: 1px;
        width: 100%;
        background: var(--Black-100, #f0f0f0);
      }

      > .info-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        > img {
          margin-left: 8px;
        }

        > .title {
          flex: 1;
          overflow: hidden;
          color: var(--Black-400, #444);
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }
    }
  }
`;
export const MenuWrapper = styled.div`
  padding: 20px 16px 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;

  > .row {
    cursor: pointer;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    > .title {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
      gap: 12px;

      > img {
        width: 24px;
        height: 24px;
      }
    }

    > .arrow {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }
  }
`;
export const CustomerServiceWrapper = styled.div`
  padding: 20px 16px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  > .title {
    width: 100%;
    text-align: left;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.32px;
  }

  > .grid-wrapper {
    margin-top: 12px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    row-gap: 6px;
  }
`;

export const CustomerButtonWrapper = styled(ButtonWrapper)`
  background: #6436e7;
  flex-direction: row;
  justify-content: flex-start;
  height: 45px;
  top: 587px;
  left: 16px;
  padding: 10px;
  gap: 5px;
  border-radius: 8px;
  font-size: 13px;
  > .icon-wrapper {
    width: 20px;
    height: 20px;
  }
`;

export const LogoutWrapper = styled.div`
  position: relative;
  width: calc(100% - 32px);
  height: 48px;
  left: 16px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;

  background: rgba(217, 217, 217, 1);
  color: white;
`;
