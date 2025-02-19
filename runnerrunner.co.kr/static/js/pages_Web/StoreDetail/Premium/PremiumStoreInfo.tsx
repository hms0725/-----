// components/StoreInfo.tsx
import React from "react";
import styled from "styled-components";
import { getGameTypeString } from "../../../../utils/constants";
import {
  getKoreanNumber,
  getDistanceKm,
  isPremium,
  isVIP,
} from "../../../../utils/common";
import { Cafe } from "../../../../api/types";

const StoreInfoWrapper = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px 16px 0;
  color: white;

  > .top {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title-box {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      text-align: center;
      > .title {
        color: white;
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.32px;
      }
    }

    > .tag {
      padding: 4px 10px;
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

      color: white;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 14px;
      background: linear-gradient(
        103.15deg,
        #6c36d6 -22.02%,
        #955fff 54.56%,
        #ccb2ff 102.58%
      );
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

    > .address {
      color: white;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.28px;
    }
    > .info-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
      > .item {
        padding: 0 6px;
        height: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        border-radius: 16.667px;
        background: rgba(100, 54, 231, 1);
      }
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
      color: white;
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
`;

interface StoreInfoProps {
  data: Cafe;
  rate: number;
  latitude: number;
  longitude: number;
}

const PremiumStoreInfo: React.FC<StoreInfoProps> = ({
  data,
  rate,
  latitude,
  longitude,
}) => {
  return (
    <StoreInfoWrapper>
      <div className="top">
        <div className="title-box">
          <div className="title">{data.cafeName}</div>
        </div>
        {isVIP(data.pubType) && (
          <div className="tag">
            <img src="/image-web/store/premium_badge.svg" />
            프리미엄
          </div>
        )}
        {data.pubType === "NORMAL" && <div className="tag normal">일반</div>}
      </div>
      <div className="title-wrapper">
        <div className="address">
          {data.newAddress} {data.detailAddress}
        </div>
        <div className="info-row">
          <div className="item">{getGameTypeString(data.gameTypes)}</div>
          {data.buyIn && (
            <div className="item">
              바이인 : {getKoreanNumber(data.buyIn ?? 0)} ~{" "}
              {data.buyInMax ? getKoreanNumber(data.buyInMax ?? 0) : ""}
            </div>
          )}
        </div>
      </div>
      <div className="count-wrapper">
        <div className="item">
          <img src="/image-web/store/Icon/Heart/small-white.svg" />
          {data.likeCount.toLocaleString()}
        </div>
        <div className="item">
          <img src="/image-web/store/Icon/Map%20pin/small-white.svg" />
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

export default PremiumStoreInfo;
