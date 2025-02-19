import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import FilterPopup from "./Search/Components/FilterPopup";
import LocationSheet from "../../components/web/LocationSheet";
import { useHistory } from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import useUserInfo from "../../hooks/useUserInfo";
import { useSetRecoilState } from "recoil";
import usePubSearchFilter from "../../hooks/usePubSearchFilter";
import EmptyView from "../../components/common/EmptyView";
import { loadingState } from "../../recoil/app";
import Pagination from "../../components/web/Pagination";
import {
  HistoryItemReq,
  historyItems,
  LikeItemReq,
  likeItems,
} from "../../api/member";

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
  padding-top: 110px;

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
      gap: 20px;
      width: 100%;
      padding-bottom: 100px;
    }
  }
`;

export const BackButton = styled.div`
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-top: 2px;

  img {
    width: 100%;
    height: 100%;
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
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  background: white;
  width: 100%;
  height: 48px;
  color: ${(p) => p.theme.color.black400};
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  gap: 10px;
`;
const FilterWrapper = styled.div`
  z-index: 106;
  position: fixed;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  top: 60px;
  flex-shrink: 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
  border-bottom: 1.5px solid #dedede;
  box-sizing: border-box;

  > .type-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    > .type {
      width: 50%;
      padding: 0 16px;
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 700;
      color: #e2e2e2;
      padding: 12px 0;

      &.select {
        border-bottom: 1.5px solid #000;
        color: #000;
      }
    }
  }
`;
const StoreInfoWrapper = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background: var(--Black-100, #f0f0f0);
  box-sizing: border-box;

  &:first-child {
    margin-top: 20px;
  }

  > .top {
    align-items: left;
    font-family: Pretendard;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  > .bottom {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;

    > .pub-box {
      width: 100%;
      height: 43px;
      padding: 10px 15px;
      border-radius: 8px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > .left {
        display: flex;
        align-items: center;
        gap: 10px;

        > .logo {
          width: 23px;
          height: 23px;
          border-radius: 50%;

          > img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }

        > .name {
          font-family: Pretendard;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
        }
      }

      > .point {
        font-family: Pretendard;
        font-size: 14px;
        font-weight: 600;

        > span {
          color: #808080;
        }
      }
    }
  }
`;

const HistoryWrapper = styled.div`
  > .content {
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    background: var(--Black-100, #f0f0f0);
    box-sizing: border-box;
    margin: 20px 0;

    > .title {
      font-family: Pretendard;
      font-size: 15px;
      font-weight: 600;
      text-align: left;
      margin-bottom: 10px;
    }

    > .bottom {
      display: flex;
      flex-direction: column;
      gap: 8px;

      > .item-box {
        width: 100%;
        height: 48px;
        padding: 10px 15px;
        border-radius: 8px;
        background: #fff;
        display: flex;
        flex-direction: column;

        &.open {
          height: 120px;
        }

        > .item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          > .left {
            display: flex;
            gap: 15px;
            align-items: center;

            > .date {
              font-family: Pretendard;
              font-size: 10px;
              font-weight: 600;
            }

            > .pub-box {
              display: flex;
              flex-direction: column;

              > .name {
                font-family: Pretendard;
                font-size: 15px;
                font-weight: 600;
                text-align: left;
              }

              > .info {
                font-family: Pretendard;
                font-size: 10px;
                font-weight: 400;
                text-align: left;
                color: #808080;
              }
            }
          }

          > .rank-box {
            height: 20px;
            padding: 2px 10px;
            gap: 2px;
            border-radius: 8px;
            background: #ffd101;
            display: flex;
            align-items: center;
            justify-content: space-between;

            > img {
              width: 9.5px;
            }

            > .rank {
              font-family: Pretendard;
              font-size: 10px;
              font-weight: 600;
            }
          }
        }

        > .info-box {
          margin-top: 15px;
          width: 99%;
          height: 50px;
          border-radius: 8px;
          display: flex;
          background: #6436e7;
          align-items: center;
          justify-content: center;
          padding: 10px;

          > .item-box {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;

            > .header {
              font-family: Pretendard;
              font-size: 10px;
              font-weight: 400;
              text-align: center;
              color: #fff;
            }

            > .item {
              font-family: Pretendard;
              font-size: 11px;
              font-weight: 700;
              text-align: center;
              color: #fff;
            }
          }
        }
        > .info-box .item-box:not(:last-child) {
          border-right: 0.5px solid #ffffff80;
        }
      }
    }
  }
`;
const UseCafe = () => {
  const history = useHistory();
  const [showFilter, setShowFilter] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [list, setList] = useState<LikeItemReq[]>([]);
  const [historyList, setHistoryList] = useState<HistoryItemReq[]>([]);
  const { user } = useUserInfo(true);

  const setLoading = useSetRecoilState(loadingState);

  const { latitude, longitude } = useGeoLocation();
  const { filter, setFilter } = usePubSearchFilter();
  const [selectType, setSelectType] = useState<string>("pub");
  const [isHistoryOpen, setIsHistoryOpen] = useState<number>(-1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

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
        setList(list);
      })
      .catch((e: any) => {})
      .finally(() => {
        setLoading(false);
      });
    historyItems()
      .then((list) => {
        setTotalCount(list.length);
        setHistoryList(list);
      })
      .catch((e: any) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [filter, user, latitude, longitude]);

  useEffect(() => {
    updateList();
  }, [updateList]);

  const handleHistoryOpen = (index: number) => {
    if (isHistoryOpen === index) {
      setIsHistoryOpen(-1);
      return;
    }
    setIsHistoryOpen(index);
  };

  const handlePage = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

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
          <div>MY PUB</div>
        </Header>
        <FilterWrapper>
          <div className="type-row">
            <div
              className={`type ${selectType === "pub" ? "select" : ""}`}
              onClick={() => setSelectType("pub")}
            >
              매장
            </div>
            <div
              className={`type ${selectType === "history" ? "select" : ""}`}
              onClick={() => setSelectType("history")}
            >
              히스토리
            </div>
          </div>
        </FilterWrapper>
        <div className="list">
          {selectType === "pub" ? (
            list.length === 0 ? (
              <EmptyView>이용중인 매장이 없습니다.</EmptyView>
            ) : (
              <div className="inner">
                {list.map((list, aIndex) => {
                  return (
                    <StoreInfoWrapper key={aIndex}>
                      <div className="top">{list.area}</div>
                      <div className="bottom">
                        {list.cafes.map((item, index) => (
                          <div key={index} className="pub-box">
                            <div className="left">
                              {item.coverImageUrl ? (
                                <div className="logo">
                                  <img src={item.coverImageUrl} />
                                </div>
                              ) : (
                                <img src="/image-web/mypub/logo.svg" />
                              )}

                              <div className="name">{item.cafeName}</div>
                            </div>
                            <div className="point">
                              {Number(item.point).toLocaleString()}{" "}
                              <span>POINT</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </StoreInfoWrapper>
                  );
                })}
              </div>
            )
          ) : historyList.length === 0 ? (
            <EmptyView>참여한 게임이 없습니다.</EmptyView>
          ) : (
            <HistoryWrapper>
              <div className="content">
                <div className="title">히스토리</div>
                <div className="bottom">
                  {historyList.map((item, index) => (
                    <div
                      className={`item-box ${
                        isHistoryOpen === index ? "open" : ""
                      }`}
                      key={index}
                    >
                      <div
                        className="item"
                        onClick={() => handleHistoryOpen(index)}
                      >
                        <div className="left">
                          <div className="date">
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="pub-box">
                            <div className="name">{item.pubName}</div>
                            <div className="info">{item.tournamentTitle}</div>
                          </div>
                        </div>
                        <div className="rank-box">
                          <img src="/image-web/human.svg" />
                          <div className="rank">
                            {item.tournamentEntry}/{item.rank ? item.rank : "-"}
                            위
                          </div>
                        </div>
                      </div>
                      {isHistoryOpen === index && (
                        <div className="info-box">
                          <div className="item-box">
                            <div className="header">리앤트리</div>
                            <div className="item">
                              {Number(item.reBuyInCount).toLocaleString()}
                            </div>
                          </div>
                          <div className="item-box">
                            <div className="header">애드온</div>
                            <div className="item">
                              {Number(item.addOnCount).toLocaleString()}
                            </div>
                          </div>
                          <div className="item-box">
                            <div className="header">사용포인트</div>
                            <div className="item">
                              {Number(item.totalPointsSpent).toLocaleString()}
                            </div>
                          </div>
                          <div className="item-box">
                            <div className="header">획득포인트</div>
                            <div className="item">
                              {Number(item.pointsWon).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {totalPages >= 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePage}
                />
              )}
            </HistoryWrapper>
          )}
        </div>
      </SearchWrapper>
    </>
  );
};
export default UseCafe;
