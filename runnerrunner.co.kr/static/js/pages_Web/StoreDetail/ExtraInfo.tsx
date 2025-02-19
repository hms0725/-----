// components/ExtraInfo.tsx
import React from "react";
import styled from "styled-components";
import { Cafe } from "../../../api/types";
import { LikeType } from "../../../api/like";
import { isPremiumAndVIP } from "../../../utils/common";

const ExtraInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 16px 30px;

  > .box {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;

    &:first-child {
      margin-top: 0;
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
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.32px;
      }
    }

    > .content-wrapper {
      padding: 16px 12px 16px 16px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      flex-grow: 1;
      border-radius: 8px;
      background: var(--Black-100, #f0f0f0);

      > .content-col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;

        > .content {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%;
          letter-spacing: -0.26px;
          word-break: break-word;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          white-space: pre-wrap;
        }

        > .admin-row {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;

          > .button {
            cursor: pointer;
            border-radius: 4px;
            border: 1px solid var(--Black-200, #b7b7b7);
            padding: 6px 16px;
            color: var(--Black-500, #202020);
            font-family: Pretendard;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
          }
        }
      }
    }
  }

  > .menu-wrapper {
    width: 100%;
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;

    > .item {
      cursor: pointer;
      border-radius: 8px;
      border: 1px solid var(--Black-100, #f0f0f0);
      width: var(--Pro2, 72px);
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;

      > img {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      > span {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
      }
    }
  }

  > .menu-wrapper.width60 {
    > .item {
      width: 60px;
    }
  }
`;
interface ExtraInfoProps {
  data: Cafe;
  onOpenCall: () => void;
  onToggleLike: (id: number, type: LikeType) => Promise<boolean | undefined>;
  onShare: () => void;
  onNavigate: () => void;
}

const ExtraInfo: React.FC<ExtraInfoProps> = ({
  data,
  onOpenCall,
  onToggleLike,
  onShare,
  onNavigate,
}) => {
  return (
    <ExtraInfoWrapper>
      <div className={"menu-wrapper " + (data.openChatUrl ? "width60" : "")}>
        <div className="item" onClick={onOpenCall}>
          <img src="/image-web/store/Phone.svg" />
          <span>전화</span>
        </div>
        <div
          className="item"
          onClick={() => onToggleLike(data.id, "CAFE" as LikeType)}
        >
          <img
            src={`/image-web/store/${data.like ? "Heart_on" : "Heart"}.svg`}
          />
          <span>즐겨찾기</span>
        </div>
        {data.openChatUrl && (
          <div
            className="item"
            onClick={() => {
              if (isPremiumAndVIP(data.pubType) && data.openChatUrl) {
                window.open(data.openChatUrl, "_blank");
              }
            }}
          >
            <img src="/image-web/store/Btn/Kakao.png" />
            <span>오픈채팅</span>
          </div>
        )}
        <div className="item" onClick={onNavigate}>
          <img src="/image-web/store/Navigation.svg" />
          <span>길안내</span>
        </div>
        <div className="item" onClick={onShare}>
          <img src="/image-web/store/Share.svg" />
          <span>공유</span>
        </div>
      </div>
    </ExtraInfoWrapper>
  );
};

export default ExtraInfo;
