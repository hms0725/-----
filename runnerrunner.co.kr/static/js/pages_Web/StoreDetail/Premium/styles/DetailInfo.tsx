import styled from "styled-components";
import { InfoBoxWrapper } from "../../../../../components/common/InfoBoxWrapper";

export const DetailInfoBox = styled(InfoBoxWrapper)`
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  > .price-row {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      flex-shrink: 0;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.28px;
    }

    > .price {
      flex-shrink: 0;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.28px;
    }
  }
`;

export const BoxWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  padding: 0px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;

  > .title {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 700;
    line-height: 23.87px;
    letter-spacing: -0.02em;
    text-align: left;
  }

  > .title-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.28px;
    }

    > .button {
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

  > .box-wrapper-outer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    background: var(--Black-100, #f0f0f0);
    gap: 4px;
    border-radius: 8px;
    padding: 16px;

    > .box-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 18px;
      border-radius: 8px;
      word-break: break-word;

      > .content {
        flex-grow: 1;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%; /* 18.2px */
        letter-spacing: -0.26px;
        transition: max-height 0.3s;
      }

      > .button {
        cursor: pointer;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        object-fit: contain;
        transition: transform 0.3s;
        transform: rotate(180deg);
      }
    }

    > .box-wrapper.fold {
      > .content {
        max-height: 65px;
        overflow: hidden;
      }

      > .button {
        transform: rotate(0);
      }
    }

    > .admin-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
  }
`;

export const EventBoxWrapper = styled(BoxWrapper)`
  padding-left: 0px;
  padding-right: 0px;
  > .title {
    padding-left: 16px;
  }
  .swiper {
    width: 100%;
    height: 368px;
  }
`;

export const EventImageWrapper = styled.div`
  height: 368px;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
`;
