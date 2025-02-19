import styled from "styled-components";
import useQuickButtons from "../../../../hooks/useQuickButtons";
import { Cafe } from "../../../../api/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { navigationTargetState } from "../../../../recoil/store";
import { useSearchContext } from "../Hook/SearchContext";
import { getKoreanNumber, getDistanceKm } from "../../../../utils/common";
import { getGameTypeString } from "../../../../utils/constants";
import { useEffect, useState } from "react";
import { useUI } from "../Hook/UIContext";
import { useStore } from "../Hook/StoreContext";
import { geoCoordState } from "../../../../recoil/geo";
const PubMoreWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 20px 50px;
  z-index: 9999;
  background-color: white;
  border-radius: 12px 12px 0px 0px;

  > .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex: 1;

    > .tag-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      > img {
        width: 20px;
      }
      > .tag-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        > .tag {
          padding: 4px 6px;
          color: var(--Purple-300, #6436e7);
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
      > .review-box {
        display: flex;
        flex-direction: row;
        > .premium {
          width: 13px;
          height: 13px;
          top: 8px;
          left: 8px;
        }
        > .review-count {
          width: 18px;
          text-align: center;
          font-family: Pretendard;
          margin-left: 1px;
          font-weight: 700;
          font-size: 12px;
          margin-bottom: 2px;
          font-style: normal;
        }
      }
    }
    > .title-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
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
      > img {
        pointer-events: visible;
        width: 16px;
        height: 16px;
      }
    }

    > .address {
      margin-top: 4px;
      color: ${(p) => p.theme.color.black300};
      font-family: Pretendard;

      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: 13px;
      letter-spacing: -2%;
    }
    > .status-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2px;

      > span {
        color: ${(p) => p.theme.color.black300};
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > span.bold {
        color: ${(p) => p.theme.color.black400};
      }
    }
    > .info-row {
      margin-top: 4px;
      width: 100%;
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
        gap: 1px;

        > .icon {
          filter: grayscale(100%) opacity(50%);
          width: 16px;
          height: 16px;
        }

        > .text {
          color: #868686;
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.28px;
        }
      }
    }
  }
  > .menu-wrapper {
    width: 100%;
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

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

      > .button {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
        color: var(--Black-200, #b7b7b7);
        text-align: right;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.26px;

        > img {
          cursor: pointer;
          object-fit: contain;
          width: 16px;
          height: 16px;
        }
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
          line-height: 140%; /* 18.2px */
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

        > .createdAt {
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

      > img {
        height: 99px;
        flex-shrink: 0;
        width: 70px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #fff;
        background: url(<path-to-image>) lightgray 50% / contain no-repeat;
      }
    }
  }
`;
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 반투명한 검정색 */
  z-index: 9998; /* 팝업 바로 뒤에 오도록 설정 */
`;

interface PubMoreProps {
  cafe: Cafe;
}

const PubMore = ({ cafe }: PubMoreProps) => {
  const { setShowMoreOption, showMoreOption } = useUI();
  const { setSelectedStore } = useStore();
  const { openPhoneCall, toggleLike, shareLink } = useQuickButtons();
  const setNavigationTarget = useSetRecoilState(navigationTargetState);
  const { latitude, longitude } = useRecoilValue(geoCoordState);
  const [like, setLike] = useState(false);
  useEffect(() => {
    setLike(cafe.like);
  }, []);
  return (
    <>
      {showMoreOption && (
        <Backdrop
          onClick={() => {
            setShowMoreOption(false);
            setSelectedStore(null);
          }}
        />
      )}
      <PubMoreWrapper>
        <div className="info">
          <div className="tag-row">
            <div className="tag-box">
              <span className="tag">{getGameTypeString(cafe.gameTypes)}</span>
              {cafe.buyIn && (
                <span className="tag">
                  바이인 : {getKoreanNumber(cafe.buyIn)} ~{" "}
                  {cafe.buyInMax ? getKoreanNumber(cafe.buyInMax) : ""}
                </span>
              )}
            </div>
            <img
              src="/image-web/Holdem%20Now/Icon/Close.svg"
              onClick={() => {
                setShowMoreOption(false);
                setSelectedStore(null);
              }}
            />
          </div>
          <div className="title-row">
            <div className="name">{cafe.cafeName}</div>
          </div>
          <div className="address">
            {cafe.newAddress} {cafe.detailAddress}
          </div>

          <div className="info-row">
            <div className="item">
              <img className="icon" src="/image-web/Icon/Heart/small.svg" />
              <span className="text">{cafe.likeCount}</span>
            </div>
            <div className="item">
              <img className="icon" src="/image-web/Icon/Map%20pin/small.svg" />
              <span className="text">
                {getDistanceKm(latitude, longitude, cafe.lat, cafe.lon)} km
              </span>
            </div>
          </div>
        </div>
        <div className="menu-wrapper">
          <div
            className="item"
            onClick={() => {
              setShowMoreOption(false);
              setSelectedStore(null);
              openPhoneCall(
                cafe.cafeName,
                cafe.vcn ? cafe.vcn : cafe.phoneNumber
              );
            }}
          >
            <img src="/image-web/search/Icon/phone.svg" />
            <span>전화</span>
          </div>
          <div
            className="item"
            onClick={async () => {
              await toggleLike(cafe?.id!, "CAFE");
              setLike(!like);
            }}
          >
            <img
              src={`/image-web/search/Icon/${like ? "like_on" : "like"}.svg`}
            />
            <span>즐겨찾기</span>
          </div>
          <div
            className="item"
            onClick={() => {
              setShowMoreOption(false);
              setSelectedStore(null);
              setNavigationTarget(cafe);
            }}
          >
            <img src="/image-web/store/Navigation.svg" />
            <span>길안내</span>
          </div>
          <div
            className="item"
            onClick={() => {
              shareLink();
            }}
          >
            <img src="/image-web/store/Share.svg" />
            <span>공유</span>
          </div>
        </div>
      </PubMoreWrapper>
    </>
  );
};

export default PubMore;
