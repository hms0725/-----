import { useEffect, useState } from "react";
import {
  getSecondHandMarket,
  getSecondHandMarketNotice,
  SecondHandMarketNoticeResponse,
  SecondHandMarketResponse,
} from "../../../../api/second-hand-market";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";
import styled, { keyframes } from "styled-components";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../../utils/network";
import { useHistory } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import WriteMarket from "./WriteBox";
import SecondHandMarketNotice from "./SecondHandMarketNotice";
import { useRecoilValue } from "recoil";
import { geoCoordState } from "../../../../recoil/geo";
import { getMarketLabel, MarketSortLabels } from "../../../../utils/constants";
import { userState } from "../../../../recoil/auth";
import { CommunityCommonBannerWrapper } from "../style";

const PageWrapper = styled.div`
  border-top: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`;

const NoticeWrapper = styled.div`
  padding: 9px 16px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 31px;

  > .notice-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    height: 31px;
  }
  > .sort-wrapper {
    z-index: 3;
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

    > span {
      cursor: pointer;
    }

    > .dim {
      top: 0;
      left: -12px;
      position: absolute;
      width: 4px;
      height: 30px;
      background: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
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
      z-index: 9999;
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
`;

const fadeIn = keyframes`
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
`;

const NoticeItem = styled.div<{ isVisible: boolean }>`
  display: flex;
  align-items: center;
  position: absolute;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 3s ease-in-out;
  transition: opacity 3s ease-in-out;

  > .icon {
    padding: 8px 13px;
    border-radius: 15px;
    background: var(--Purple-300, #6436e7);
    color: white;
    font-size: 13px;
  }

  > .title {
    margin-left: 5px;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
  }
`;

const Banner = styled.div`
  width: 100%;
  margin-bottom: 10px;

  img {
    width: 100%;
    object-fit: cover;
  }
`;

const MarketWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 16px;
  gap: 12px;
`;
const MarketItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  gap: 12px;

  > .image-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    > img {
      width: 92px;
      height: 92px;
      border-radius: 4px;
    }
  }

  > .content-wrapper {
    width: 100%;
    height: 92px;
    display: flex;
    flex-direction: column;
    position: relative;

    > .top {
      width: 100%;
      margin-top: 1px;
      font-family: "Pretendard";
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.02em;
      color: #444444;
      margin-bottom: 9px;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .middle {
      display: flex;
      flex-direction: row;
      gap: 4px;
      font-family: "Pretendard";
      font-style: normal;
      font-weight: 350;
      font-size: 13px;
      line-height: 16px;
      letter-spacing: -0.02em;

      color: #808080;
    }

    > .bottom {
      margin-bottom: 1px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      position: absolute;
      bottom: 0;

      > .price {
        font-family: "Pretendard";
        font-style: normal;
        font-weight: 700;
        font-size: 13px;
        line-height: 16px;

        letter-spacing: -0.02em;

        color: #444444;
      }

      > .icon-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;

        > .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 4px;
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%; /* 19.6px */
          letter-spacing: -0.28px;

          > img {
            width: 16px;
            height: 16px;
            object-fit: contain;
          }
        }
      }
    }
  }
`;
const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  width: 100%;
  height: 48px;
  color: ${(p) => p.theme.color.black400};
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  gap: 8px;
  @media ${MEDIA_DESKTOP} {
    display: none;
  }

  > .close {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }

  > .title {
    flex: 1;
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
`;

const EmptyWrapper = styled.div`
  padding: 60px 0 220px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  @media ${MEDIA_DESKTOP} {
    display: none;
  }

  > .empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;

    > img {
      width: 180px;
      object-fit: contain;
      filter: grayscale(10%) brightness(95%);
    }

    > .empty-text {
      width: 100%;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  margin-top: 20px;
  > .best-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px;
    > .title {
      color: #000;
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
    }

    > .list-wrapper {
      display: flex;
      flex-direction: row;
      gap: 8px;

      > .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        > img {
          border-radius: 8px;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
        }

        > .title {
          width: 100%;
          height: 32px;
          color: #000;
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }

        > .price {
          color: #000;
          font-family: Pretendard;
          font-size: 13px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }
    }
  }
`;

const WriteButton = styled.div`
  z-index: 2;
  position: fixed;
  right: 16px;
  bottom: 50px;
  width: 50px;
  height: 50px;
  background-color: var(--Purple-300, #6436e7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    position: absolute;
    width: 70%;
    height: 70%;
  }
`;

const SecondHandMarket = () => {
  const [noticeList, setNoticeList] = useState<
    SecondHandMarketNoticeResponse[]
  >([]);
  const [marketList, setMarketList] = useState<SecondHandMarketResponse[]>([]);

  const [bestList, setBestList] = useState<SecondHandMarketResponse[]>([]);

  //필터링에 필요한 값
  const [order, setOrder] = useState(4);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [province, setProvince] = useState<number | null>(null);
  const [city, setCity] = useState<number | null>(null);
  const [street, setStreet] = useState<number | null>(null);
  const [onSale, setOnSale] = useState(true);
  const [noticeShow, setNoticeShow] = useState(false);

  const [showWrite, setShowWrite] = useState(false);

  const { latitude, longitude } = useRecoilValue(geoCoordState);

  const [showSortFilter, setShowSortFilter] = useState(false);
  const user = useRecoilValue(userState);

  const history = useHistory();

  //공지 사항 슬라이더
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  const getNoticeList = async () => {
    getSecondHandMarketNotice().then((res) => {
      setNoticeList(res);
    });
  };

  const getMarketItemList = async () => {
    getSecondHandMarket(
      province ?? null,
      city ?? null,
      street ?? null,
      order ?? null,
      minPrice ?? null,
      maxPrice ?? null,
      onSale ?? null,
      latitude ?? null,
      longitude ?? null
    ).then((res) => {
      const latestBest = [...res]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 2);

      setBestList(latestBest);

      const remainingList = res.filter(
        (item) => !latestBest.some((best) => best.id === item.id)
      );
      setMarketList(remainingList);
    });
  };

  useEffect(() => {
    getNoticeList();
  }, []);

  useEffect(() => {
    if (noticeList.length === 0) return;
    const interval = setInterval(() => {
      setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % noticeList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [noticeList]);

  useEffect(() => {
    getMarketItemList();
  }, [order, minPrice, maxPrice, onSale, province, city, street, showWrite]);
  return (
    <>
      {showWrite && (
        <WriteMarket onClose={() => setShowWrite(false)} mode={"write"} />
      )}
      {noticeShow && (
        <SecondHandMarketNotice onClose={() => setNoticeShow(false)} />
      )}
      {user && (
        <WriteButton
          onClick={() => {
            const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
            if (!accessToken) {
              history.push("/login", { redirect: window.location.href });
              enqueueSnackbar("로그인이 필요한 서비스 입니다.", {
                variant: "error",
              });
            } else {
              if (user?.validate) {
                setShowWrite(true);
              } else {
                enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
                  variant: "error",
                });
              }
            }
          }}
        >
          <img src="/image-web/market/write.svg" />
        </WriteButton>
      )}

      <PageWrapper>
        <ContentWrapper>
          {/* <CommunityCommonBannerWrapper>
            <div className="banner">
              <span>
                내 주변
                <br />
                중고품 찾기
              </span>
              <img
                src="/image-web/community/banner-cart.png"
                alt="banner-icon"
              />
            </div>
          </CommunityCommonBannerWrapper> */}
          {noticeList.length > 0 && (
            <NoticeWrapper>
              <div
                className="notice-container"
                onClick={() => setNoticeShow(true)}
              >
                {noticeList.map((notice, index) => (
                  <NoticeItem
                    key={notice.id}
                    isVisible={currentNoticeIndex === index}
                  >
                    <span className="icon">공지</span>
                    <span className="title">{notice.title}</span>
                  </NoticeItem>
                ))}
              </div>
              <div
                className="sort-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSortFilter(!showSortFilter);
                }}
              >
                <div className="dim" />
                <span>{getMarketLabel(order)}</span>
                <img src="/image-web/Icon/Arrow%20down.svg" />
                {showSortFilter && (
                  <div className="sort-popup">
                    {MarketSortLabels.map(({ index, label }, i) => {
                      return (
                        <div
                          className={
                            "item " + (order === index ? "selected" : "")
                          }
                          key={i}
                          onClick={() => setOrder(index)}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </NoticeWrapper>
          )}

          {marketList.length === 0 ? (
            <EmptyWrapper>
              <div className="empty-wrapper">
                <img src="/image-web/None.png" />
                <div className="empty-text">
                  아직 매물이 없습니다.
                  <br />첫 매물을 등록해보세요!
                </div>
              </div>
            </EmptyWrapper>
          ) : (
            <MarketWrapper>
              {marketList.map((market) => (
                <MarketItem
                  key={market.id}
                  onClick={() => {
                    history.push(`/second-hand-market/detail/${market.id}`);
                  }}
                >
                  <div className="image-box">
                    <img src={market.imageList[0]} />
                  </div>
                  <div className="content-wrapper">
                    <div className="top">
                      <span>{market.title}</span>
                    </div>

                    <div className="middle">
                      <span className="area">
                        {market.areaProvinceName + " " + market.areaCityName}
                      </span>
                      ·
                      <span className="date">
                        {moment(market.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="bottom">
                      <span className="price">
                        {market.price.toLocaleString()} 원
                      </span>
                      <div className="icon-wrapper">
                        <div className="item">
                          {market.like ? (
                            <img
                              src="/image-web/Icon/Heart/small.svg"
                              alt="좋아요"
                            />
                          ) : (
                            <img
                              src="/image-web/Icon/Heart/small-gray.svg"
                              alt="좋아요"
                            />
                          )}

                          <span>{market.likeCount.toLocaleString()}</span>
                        </div>
                        <div className="item">
                          <img src="/image-web/Holdem%20Now/Icon/comment/small.svg" />
                          <span>{market.commentCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </MarketItem>
              ))}
            </MarketWrapper>
          )}
        </ContentWrapper>
      </PageWrapper>
    </>
  );
};

export default SecondHandMarket;
