import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import FilterPopup from "./Search/Components/FilterPopup";
import LocationSheet from "../../components/web/LocationSheet";
import { likeItems } from "../../api/like";
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
import {
  getGameTypeString,
  getPubSortLabel,
  PubSortTypeLabels,
  PubTypeLabels,
} from "../../utils/constants";
import useUserInfo from "../../hooks/useUserInfo";
import { useSetRecoilState } from "recoil";
import { navigationTargetState } from "../../recoil/store";
import usePubSearchFilter from "../../hooks/usePubSearchFilter";
import EmptyView from "../../components/common/EmptyView";
import { loadingState } from "../../recoil/app";
import { BackButton } from "./useCafe";

const SearchWrapper = styled.div<{
  scrollLock: boolean;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: white;
  position: relative;
  padding-top: 103px;

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

    > .inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      width: 100%;
      padding-bottom: 100px;
    }
  }
`;

const Header = styled.div`
  position: fixed;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  background: white;
  width: 100%;
  height: 48px;
  color: ${(p) => p.theme.color.black400};
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  gap: 8px;
`;
const FilterWrapper = styled.div`
  z-index: 106;
  position: fixed;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  top: 48px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  gap: 12px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);

  > .type-row {
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    > .type-wrapper-inner {
      flex-grow: 1;
      overflow-x: scroll;

      > .type-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;

        > .type {
          flex-shrink: 0;
          width: fit-content;
          color: ${(p) => p.theme.color.purple300};
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          padding: 7px 12px;
          border-radius: 15px;
          border: 1px solid ${(p) => p.theme.color.purple300};
          background: white;
        }

        > .type.selected {
          color: #fff;
          background: ${(p) => p.theme.color.purple300};
        }
      }
    }

    > .sort-wrapper {
      flex-shrink: 0;
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
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;

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
          font-size: 10.5px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          border-radius: 16.667px;
          border: 1px solid ${(p) => p.theme.color.purple100};
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
    justify-content: flex-end;

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
const Favorite = () => {
  const history = useHistory();
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [list, setList] = useState<Cafe[]>([]);
  const { user } = useUserInfo(true);

  const setNavigationTarget = useSetRecoilState(navigationTargetState);
  const setLoading = useSetRecoilState(loadingState);

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

  const handleLike = async (id: number) => {
    setLoading(true);
    await toggleLike(id, "CAFE");
    setList((v) => {
      const item = v.find((x) => x.id === id);
      if (!item) {
        return v;
      }

      if (item.like) {
        return v.filter((x) => x.id !== id);
      } else {
        const newItem = { ...item, like: !item.like };

        return v.map((x) => (x.id === id ? newItem : x));
      }
    });
    setLoading(false);
  };

  const updateList = useCallback(() => {
    if (!user?.id) {
      return;
    }

    const searchFilter = { ...filter };
    if (searchFilter.buyInFrom) searchFilter.buyInFrom *= 10000;
    if (searchFilter.buyInTo) searchFilter.buyInTo *= 10000;

    setLoading(true);
    likeItems({
      userId: user.id,
      itemType: "CAFE",
      ...searchFilter,
      lat: latitude,
      lon: longitude,
    })
      .then((list) => {
        setTotalCount(list.length);
        setList(list);
      })
      .catch((e: any) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [filter, user, latitude, longitude]);

  useEffect(() => {
    updateList();
  }, [updateList]);

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
        <Header>
          <BackButton onClick={() => history.push("/")}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </BackButton>
          <span className="title">즐겨찾기한 홀덤펍</span>
        </Header>
        <FilterWrapper>
          <div className="type-row">
            <div
              className="sort-wrapper"
              onClick={() => setShowSortFilter(!showSortFilter)}
            >
              <div className="dim" />
              <span>{getPubSortLabel(filter.sort)}</span>
              <img src="/image-web/Icon/Arrow%20down.svg" />
              {showSortFilter && (
                <div className="sort-popup">
                  {PubSortTypeLabels.map(({ type, label }, i) => {
                    return (
                      <div
                        className={
                          "item " + (isSelectedSortType(type) ? "selected" : "")
                        }
                        key={i}
                        onClick={() => setSortType(type)}
                      >
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <img
              id="상세"
              alt="상세"
              className="detail"
              src={`/image-web/search/detail.svg`}
              onClick={() => setShowFilter(true)}
            />
          </div>
        </FilterWrapper>
        <div className="list">
          {list.length === 0 ? (
            <EmptyView>즐겨찾기 한 펍이 없습니다.</EmptyView>
          ) : (
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
          )}
        </div>
      </SearchWrapper>
    </>
  );
};
export default Favorite;
