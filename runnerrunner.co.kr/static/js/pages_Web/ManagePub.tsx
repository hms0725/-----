import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import FilterPopup from "./Search/Components/FilterPopup";
import LocationSheet from "../../components/web/LocationSheet";
import { Cafe } from "../../api/types";
import { useHistory } from "react-router-dom";
import {
  getDistanceKm,
  getKoreanNumber,
  getOpStatusText,
  getOpTimeText,
} from "../../utils/common";
import useGeoLocation from "../../hooks/useGeoLocation";
import useQuickButtons from "../../hooks/useQuickButtons";
import { getGameTypeString } from "../../utils/constants";
import useUserInfo from "../../hooks/useUserInfo";
import { useSetRecoilState } from "recoil";
import { navigationTargetState } from "../../recoil/store";
import usePubSearchFilter from "../../hooks/usePubSearchFilter";
import { getSellerCafeList } from "../../api/seller";
import { loadingState } from "../../recoil/app";
import { MEDIA_DESKTOP } from "../../hooks/useScreenOrientation";

const SearchWrapper = styled.div<{
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
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
  
  `} @media ${MEDIA_DESKTOP} {
    position: static;
    max-width: unset;
    top: unset;
    left: unset;
    padding-top: 0;
    height: unset;
  }

  > .header {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
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
      max-width: unset;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--Black-200, #b7b7b7);
      margin-bottom: 20px;
      box-shadow: unset;
    }

    > .search-wrapper {
      display: flex;
      flex-grow: 1;
      border-radius: 8px;
      background: var(--Black-100, #f0f0f0);
      padding: 10px 12px;
      color: var(--Black-200, #b7b7b7);
      text-align: center;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .cancel {
      flex-shrink: 0;
      cursor: pointer;
      color: var(--Black-400, #444);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
      margin-left: 13px;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    > .search {
      cursor: pointer;
      width: 16px;
      height: 16px;
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

  ${(p) =>
    p.scrollLock
      ? `
    overflow-y: hidden;
  `
      : `
    overflow-y: scroll;
  `}
  > .list {
    width: 100%;
    padding: 0 16px;
    flex-grow: 1;
    @media ${MEDIA_DESKTOP} {
      padding: 0;
    }

    > .inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      width: 100%;
      padding-bottom: 100px;
      @media ${MEDIA_DESKTOP} {
        padding: 0;
      }
    }
  }

  > .empty-wrapper {
    width: 100%;
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;

    > img {
      width: 180px;
      height: 180px;
    }

    > span {
      margin-top: 12px;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    > .affiliate-text {
      margin-top: 24px;
      color: #000;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button {
      cursor: pointer;
      margin-top: 16px;
      padding: 10px;
      border-radius: 8px;
      background: var(--Purple-100, #f0eaff);
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button:active {
      background: #502bb5;
    }
  }
`;
const StoreInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);

  &:first-child {
    margin-top: 20px;
  }

  @media ${MEDIA_DESKTOP} {
    box-shadow: unset;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 0;
    &:first-child {
      margin-top: 0px;
    }
  }

  > .top {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      align-items: flex-start;
    }

    > .thumbnail {
      width: 80px;
      height: 114px;
      background: gray;
      border-radius: 8px;
      overflow: hidden;
      @media ${MEDIA_DESKTOP} {
        width: 110px;
        height: 110px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
          @media ${MEDIA_DESKTOP} {
            font-size: 14px;
            border: none;
            padding: 0;
          }
        }
      }

      > .name {
        margin-top: 8px;
        color: ${(p) => p.theme.color.black400};
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.32px;
        @media ${MEDIA_DESKTOP} {
          font-size: 18px;
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
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
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

interface ManagePubProps {
  onClose: () => void;
}

const ManagePub = ({ onClose }: ManagePubProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const history = useHistory();
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [list, setList] = useState<Cafe[]>([]);
  const { user } = useUserInfo(true);
  const [showStoreList, setShowStoreList] = useState<boolean>(false);
  const setNavigationTarget = useSetRecoilState(navigationTargetState);

  const { latitude, longitude } = useGeoLocation();
  const { openPhoneCall, toggleLike, shareLink } = useQuickButtons();
  const {
    filter,
    setFilter,
    togglePubType,
    toggleGameType,
    setSortType,
    isSelectedPubType,
    isSelectedGameType,
    isSelectedSortType,
  } = usePubSearchFilter();

  useEffect(() => {
    setLoading(true);
    getSellerCafeList({})
      .then((res) => {
        setList((prev) => [...prev, res]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLike = useCallback(
    async (id: number) => {
      setLoading(true);
      const liked = await toggleLike(id, "CAFE");
      if (typeof liked === "boolean") {
        const idx = list.findIndex((item) => item.id === id);
        if (idx !== -1) {
          const newList = list.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                like: liked,
              };
            } else {
              return item;
            }
          });

          setList(newList);
        }
      }
      setLoading(false);
    },
    [list, toggleLike]
  );

  return (
    <>
      {showFilter && (
        <FilterPopup
          currentFilter={filter}
          onApplyFilter={setFilter}
          onClose={() => setShowFilter(false)}
        />
      )}
      <LocationSheet />
      <SearchWrapper scrollLock={showFilter}>
        {showSearchbar ? (
          <div className="header">
            <div
              className="search-wrapper"
              onClick={() => {
                setShowStoreList(true);
              }}
            >
              원하는 홀덤 펍을 검색해보세요
            </div>
            <div
              className="cancel"
              onClick={() => {
                setShowSearchbar(false);
              }}
            >
              취소
            </div>
          </div>
        ) : (
          <div className="header">
            <div className="close" onClick={onClose}>
              <img src="/image-web/Icon/Back.svg" alt="close" />
            </div>
            <div className="title">내 홀덤펍 관리</div>
          </div>
        )}
        {list.length > 0 ? (
          <div className="list">
            <div className="inner">
              {list.map((item, index) => {
                return (
                  <StoreInfoWrapper
                    key={item.id}
                    onClick={() => history.push("/store/" + item.id)}
                  >
                    <div className="top">
                      <div className="thumbnail">
                        {item.images[0] && (
                          <img src={item.images[0].imageUrl} />
                        )}
                      </div>
                      <div className="info">
                        <div className="tag-row">
                          <span className="tag">
                            {getGameTypeString(item.gameTypes)}
                          </span>
                          {item.buyIn && (
                            <span className="tag">
                              바이인 : {getKoreanNumber(item.buyIn)} ~{" "}
                              {item.buyInMax
                                ? getKoreanNumber(item.buyInMax)
                                : ""}
                            </span>
                          )}
                        </div>
                        <div className="name">{item.cafeName}</div>
                        <div className="address">
                          {item.newAddress} {item.detailAddress}
                        </div>
                        <div className="info-row">
                          <div className="item">
                            <img
                              className="icon"
                              src="/image-web/Icon/Heart/small.svg"
                            />
                            <span className="text">
                              {item.likeCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="item">
                            <img
                              className="icon"
                              src="/image-web/Icon/Map%20pin/small.svg"
                            />
                            <span className="text">
                              {getDistanceKm(
                                latitude,
                                longitude,
                                item.lat,
                                item.lon
                              )}{" "}
                              km
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="status-row">
                        {item.operatingDays && item.operatingStartTime && (
                          <span className="bold">
                            {getOpStatusText(
                              item.operatingDays,
                              item.operatingStartTime,
                              item.operatingEndTime
                            )}
                          </span>
                        )}
                        <span>
                          {getOpTimeText(
                            item.operatingDays,
                            item.operatingStartTime,
                            item.operatingEndTime
                          )}
                        </span>
                      </div>
                      <div
                        className="button-row"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src="/image-web/Icon/Phone.svg"
                          onClick={() =>
                            openPhoneCall(
                              item.cafeName,
                              item.vcn ? item.vcn : item.phoneNumber
                            )
                          }
                        />
                        <img
                          src={`/image-web/Icon/${
                            item.like ? "Heart_on" : "Heart"
                          }.svg`}
                          onClick={() => handleLike(item.id)}
                        />
                        <img
                          src="/image-web/Icon/Navigation.svg"
                          onClick={() => setNavigationTarget(item)}
                        />
                        <img
                          src="/image-web/Icon/Share.svg"
                          onClick={() => shareLink()}
                        />
                      </div>
                    </div>
                  </StoreInfoWrapper>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-wrapper">
            <img src="/image-web/None.png" />
            <span>
              관리중인 홀덤펍이
              <br />
              없습니다.
            </span>
            <div className="affiliate-text">운영중인 홀덤펍이 있으신가요?</div>
            <div
              className="button"
              onClick={() => {
                //TODO: 제휴 신청하기
              }}
            >
              제휴 신청하기
            </div>
          </div>
        )}
      </SearchWrapper>
    </>
  );
};
export default ManagePub;
