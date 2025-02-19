// components/StoreInfo.tsx
import React from "react";
import styled from "styled-components";
import { getGameTypeString } from "../../../utils/constants";
import {
  getKoreanNumber,
  getDistanceKm,
  isPremium,
  isVIP,
} from "../../../utils/common";
import { Cafe } from "../../../api/types";

const StoreInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px 16px 0;

  > .top {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .info-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;

      > .item {
        padding: 0 6px;
        height: 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--Purple-300, #6436e7);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        border-radius: 16.667px;
        border: 1px solid var(--Purple-100, #f0eaff);
      }
    }

    > .tag {
      padding: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 2px;

      > img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }

      color: var(--Purple-200, #8359f7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 14px;
      border: 1.5px solid #6c36d6;
      background: var(--Purple-100, #f0eaff);
    }

    > .tag.affiliate {
      border: 1.5px solid #f2f7ff;
      color: #176ced;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      background: transparent;
    }

    > .tag.normal {
      border: 1.5px solid var(--Black-100, #f0f0f0);
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      background: transparent;
    }
  }

  > .title-wrapper {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;
    > .title-box {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      text-align: center;
      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.32px;
      }
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

    > .address {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.28px;
    }
  }

  > .count-wrapper {
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
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.28px;

      > img {
        width: 16px;
        height: 16px;
      }
    }
  }

  > .bottom {
    margin-top: 20px;
    width: 100%;
    height: 1px;
    background: var(--Black-200, #b7b7b7);
  }
`;

interface StoreInfoProps {
  data: Cafe;
  rate: number;
  latitude: number;
  longitude: number;
}

const StoreInfo: React.FC<StoreInfoProps> = ({
  data,
  rate,
  latitude,
  longitude,
}) => {
  return (
    <StoreInfoWrapper>
      <div className="top">
        <div className="info-row">
          <div className="item">{getGameTypeString(data.gameTypes)}</div>
          {data.buyIn && (
            <div className="item">
              바이인 : {getKoreanNumber(data.buyIn ?? 0)} ~{" "}
              {data.buyInMax ? getKoreanNumber(data.buyInMax ?? 0) : ""}
            </div>
          )}
        </div>
        {isPremium(data.pubType) && (
          <div className="tag">
            <img src="/image-web/store/premium.png" />
            프리미엄
          </div>
        )}
        {isVIP(data.pubType) && (
          <div className="tag">
            <img src="/image-web/store/premium.png" />
            VIP
          </div>
        )}
        {data.pubType === "NORMAL" && <div className="tag normal">일반</div>}
      </div>
      <div className="title-wrapper">
        <div className="title-box">
          <div className="title">{data.cafeName}</div>
          <div className="star">★</div>
          <div className="review-count">{rate.toFixed(1)}</div>
        </div>
        <div className="address">
          {data.newAddress} {data.detailAddress}
        </div>
      </div>
      <div className="count-wrapper">
        <div className="item">
          <img src="/image-web/store/Icon/Heart/small.svg" />
          {data.likeCount.toLocaleString()}
        </div>
        <div className="item">
          <img src="/image-web/store/Icon/Map%20pin/small.svg" />
          {getDistanceKm(
            latitude,
            longitude,
            data.lat || 0,
            data.lon || 0
          ).toLocaleString()}
          km
        </div>
      </div>
    </StoreInfoWrapper>
  );
};

export default StoreInfo;
