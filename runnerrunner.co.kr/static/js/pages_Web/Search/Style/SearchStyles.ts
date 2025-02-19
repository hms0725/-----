import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";
export const Wrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 69px;
`;
export const Header = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0);
  z-index: 102;
  flex-direction: row;

  @media ${MEDIA_DESKTOP} {
    display: none;
  }
  > div {
    display: flex;
    align-items: center;
    .close {
      cursor: pointer;
      width: 20px;
      height: 20px;
      margin-top: 2px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      margin-left: 5px;
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
`;
export const SearchWrapper = styled.div<{
  scrollLock: boolean;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(0, 0, 0, 0);
  position: relative;

  ${(p) =>
    p.scrollLock
      ? `
    overflow-y: hidden;
  `
      : `
    overflow-y: scroll;
  `}

  > .count {
    z-index: 10;
    position: absolute;
    right: 16px;
    top: 55px;
    padding: 9px 12px;
    border-radius: 15px;
    background: #f0f0f0;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
    color: #8d8d8d;
    text-align: right;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  > #map {
    flex-grow: 1;
    width: 100%;

    > #city {
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 20px;
      background: #fff;
      display: flex;
      flex-direction: row;
      gap: 8px;
      color: var(--Purple-300, #6436e7);
      text-align: center;
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      z-index: 10;
      position: absolute;
      left: 16px;
      top: 55px;
      > img {
        width: 7px;
      }
    }

    &[data-hide="true"] {
      display: none;
    }
  }

  > .list {
    width: 100%;
    padding: 0 16px;
    flex-grow: 1;

    > .inner {
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      width: 100%;
      padding-bottom: 70px;
      > .premium {
        cursor: pointer;
        width: 100%;
        border-radius: 8px;
        background: var(--Purple-100, #f0eaff);
        height: 43px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.32px;
        > img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
`;

export const AddressBar = styled.div<{ show: boolean; isScrolled: boolean }>`
  position: fixed;
  max-width: 500px;
  left: 50%;
  height: 50px;
  transform: translateX(-50%);
  top: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 102;
  width: 100%;
  padding: 7px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${(props) => (props.isScrolled ? "white" : "")};

  > .box.map {
    background: #fff;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
  }

  > .box {
    flex-grow: 1;
    cursor: pointer;
    flex-shrink: 0;
    width: 100px;
    padding: 10px 12px;
    border-radius: 15px;
    background: #f0f0f0;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    outline: none;
    border: none;
    text-align: left;

    &::placeholder {
      color: var(--Black-200, #b7b7b7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  > .box.flex {
  }
`;

export const FilterWrapper = styled.div<{ show: boolean }>`
  margin-top: 20px;
  position: relative;
  flex-shrink: 0;
  z-index: 102;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: space-between;
  padding: ${(props) => (props.show ? "0px" : "48px")} 0px 12px 0px;
  gap: 12px;
  background: rgba(0, 0, 0, 0);

  > .title {
    margin-left: 16px;
    color: #000;
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    letter-spacing: -0.4px;
  }

  > .type-row {
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    gap: 10px;

    > .sort-box {
      z-indx: 101;
      background-color: white;
      display: flex;
      flex-direction: row;
      gap: 5px;
      > .sort-wrapper {
        width: 110px;
        height: 30px;
        position: relative;
        padding: 7px 8px 7px 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2px;
        border-radius: 15px;
        border: 1px solid ${(p) => p.theme.color.black200};
        color: ${(p) => p.theme.color.black500};
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 800;
        line-height: normal;

        > .title.long {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 10px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }
        > span {
          cursor: pointer;
        }

        > .dim {
          top: 0;
          left: -12px;
          position: absolute;
          width: 4px;
          height: 30px;
          background: linear-gradient(
            270deg,
            #fff 0%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        > .sort-popup {
          width: max-content;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 12px;
          position: absolute;
          right: 0;
          top: 36px;
          z-index: 105;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);

          > .item {
            width: 100%;
            cursor: pointer;
            padding: 8px 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 15px;
            border: 1px solid var(--Black-100, #f0f0f0);
            color: var(--Black-500, #202020);
            font-family: Pretendard;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
          }

          > .item.selected {
            color: #fff;
            font-family: Pretendard;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            background: var(--Purple-300, #6436e7);
          }
        }
      }
    }
  }

  > .filter-row-inner {
    width: 100%;
    max-width: 100%;
    overflow-x: scroll;

    > .filter-row {
      padding-left: 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;

      > .item {
        cursor: pointer;
        white-space: nowrap;
        padding: 7px 12px;
        color: ${(p) => p.theme.color.black500};
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        border-radius: 15px;
        background: ${(p) => p.theme.color.black100};
      }

      > .item.selected {
        color: var(--Purple-300, #6436e7);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
`;

export const MapInfoWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  position: fixed;
  bottom: 174px;
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 16px 8px;
  gap: 12px;

  > .button-row {
    width: 100%;
    height: 36px;
    position: relative;

    > .button {
      position: absolute;
      top: 0;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: #fff;
      filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
    }
    > .button.current {
      right: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;

      background: #6436e7;

      > .icon {
        width: 24px;
        height: 24px;
      }
    }
    > .button.right {
      right: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;

      > .icon {
        width: 24px;
        height: 24px;
      }
    }

    > .button.center {
      left: 50%;
      transform: translateX(-50%);
      color: ${(p) => p.theme.color.black500};
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      padding: 10px 12px;
      border-radius: 24px;

      > .icon {
        width: 16px;
        height: 16px;
      }
    }
  }
`;
export const FloatButton = styled.div`
  z-index: 125;
  position: fixed;
  right: 16px;
  bottom: 98px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

export const StoreListWrapper = styled.div<{ show: boolean; empty: boolean }>`
  height: ${(props) => (props.show ? "" : "20%")};
  overflow: ${(props) => (props.show ? "" : "hidden")};
  transition: height 0.3s ease;
  width: 100%;
  margin-bottom: 69px;
  > .line {
    position: relative;
    left: 50%;
    top: 5px;
    width: 40px;
    height: 5px;
    background: rgb(100, 54, 231);
    border-radius: 2.5px;
  }

  > .list {
    width: 100%;
    padding: 12px 17px;
    display: flex;
    flex-wrap: wrap;
    margin-top: -20px;
  }

  .list > * {
    margin-top: ${(props) => (props.empty ? "50%" : "20px")};
    margin-right: 8px;
  }

  .list > *:nth-child(2n) {
    margin-right: 0;
  }
`;

export const StoreInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: calc(50% - 4px);
  border-radius: 8px;
  box-sizing: border-box;
  > .cover {
    width: 100%;
    padding-bottom: 100%; /* 1:1 비율을 위해 100% */
    overflow: hidden;
    position: relative;

    > .img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px 8px;
      object-fit: cover;
    }

    > .more {
      position: absolute;
      pointer-events: visible;
      border-radius: 11px;
      background: white;
      width: 22px;
      height: 22px;
      bottom: 6px;
      right: 6px;
    }
  }

  > .bottom {
    margin-top: 2px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    > .title {
      color: #000;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    > .address {
      color: #808080;
      font-family: Pretendard;
      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .info-row {
      width: 100%;
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      gap: 8px;

      > .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 2px;

        > .icon {
          width: 16px;
          height: 16px;
        }

        > .text {
          color: ${(p) => p.theme.color.black400};
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.26px;
        }
      }
    }
  }
`;

export const MapStoreInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);

  > .top {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;

    > .thumbnail {
      width: 80px;
      height: 114px;
      background: gray;
      border-radius: 8px;
      overflow: hidden;
      position: relative;

      > .cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      > .premium {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 8px;
        left: 8px;
      }
    }

    > .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      flex: 1;

      > .tag-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;

        > .tag {
          padding: 4px 6px;
          color: ${(p) => p.theme.color.purple300};
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          border-radius: 16.667px;
          border: 1px solid ${(p) => p.theme.color.purple100};
          white-space: nowrap;
        }
      }
      > .title-row {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        text-align: center;
        > .name {
          margin-top: 8px;
          color: ${(p) => p.theme.color.black400};
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.32px;
        }
        > .review-box {
          margin-right: 13px;
          display: flex;
          flex-direction: row;
          > .star {
            font-family: Pretendard;
            margin-left: 5px;
            color: gold;
            font-size: 12px;
            margin-bottom: 2px;
            font-style: normal;
          }
          > .review-count {
            font-family: Pretendard;
            margin-left: 1px;
            font-size: 12px;
            margin-bottom: 2px;
            font-style: normal;
          }
        }
      }

      > .address {
        margin-top: 6px;
        color: ${(p) => p.theme.color.black300};
        font-family: Pretendard;

        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.26px;
      }

      > .info-row {
        margin-top: 12px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;

        > .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 2px;

          > .icon {
            width: 16px;
            height: 16px;
          }

          > .text {
            color: ${(p) => p.theme.color.black400};
            font-family: Pretendard;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -0.26px;
          }
        }
      }
    }
  }

  > .bottom {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .status-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2px;

      > span {
        color: ${(p) => p.theme.color.black300};
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > span.bold {
        color: ${(p) => p.theme.color.black400};
      }
    }

    > .button-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;

      > img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  }
`;

export const MapBannerWrapper = styled.div`
  position: absolute;
  top: calc(100% - 90px);
  transition: top 1s ease;
  width: 100%;
  height: 100%;
  background-color: white;
  height: 100vh;
  margin: -20px;

  z-index: 101;
  > .image-row {
    padding: 0 16px;
    position: relative;
    top: 20px;
    margin-bottom: 40px;
    text-align: center;
    > img {
      width: 100%;
    }
  }
  > .line {
    position: relative;
    transform: translateX(-50%);
    left: 50%;
    top: 10px;
    width: 40px;
    height: 5px;
    background: rgb(100, 54, 231);
    border-radius: 2.5px;
  }
`;
