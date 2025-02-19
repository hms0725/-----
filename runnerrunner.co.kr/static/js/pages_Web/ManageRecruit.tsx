import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import { Cafe } from "../../api/types";
import { useHistory, useLocation } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../recoil/app";
import {
  getGenderLabel,
  getRecruitStateLabel,
  getRecruitTypeLabel,
  RecruitTypeLabels,
} from "../../utils/constants";
import { getMyJobList, Job, RecruitType } from "../../api/job";
import { getSellerCafeList } from "../../api/seller";
import { enqueueSnackbar } from "notistack";
import RegisterRecruit from "./Community/Recruit/RegisterRecruit";
import { ContentItemWrapper } from "./Community/Recruit";
import { MEDIA_DESKTOP } from "../../hooks/useScreenOrientation";
import useQueryParams from "../../hooks/useQueryParams";
import { isPremiumAndVIP } from "../../utils/common";

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
  padding-top: 148px;
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

  > .filter-wrapper {
    position: fixed;
    top: 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 96px;
    z-index: 11;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  }

  > .header {
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

    > .button {
      cursor: pointer;
      color: var(--Purple-300, #6436e7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
      @media ${MEDIA_DESKTOP} {
        padding: 11px 20px;
        font-size: 14px;
        color: white;
        font-weight: 700;
        border-radius: 12px;
        background: var(--Purple-300, #6436e7);
      }
    }

    > .button:active {
      background: #502bb5;
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
    padding: 16px;
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

const FilterWrapper = styled.div`
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
  padding: 12px;
  gap: 12px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
  z-index: 11;
  @media ${MEDIA_DESKTOP} {
    display: none;
  }

  > .type-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 1px;

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
          cursor: pointer;
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

  > .select-wrapper {
    cursor: pointer;
    position: relative;
    padding: 9px 12px 9px 8px;
    border-radius: 8px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #b7b7b7;

    > .select {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .arrow {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    > .search-list {
      position: absolute;
      left: 0;
      top: 40px;
      width: 100%;
      max-height: 375px;
      overflow: auto;
      padding: 16px 12px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      z-index: 3;

      > .item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;

        > .title {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;

          > .match {
            color: var(--Purple-300, #6436e7);
          }
        }

        > .address {
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }

      > .horizontal-bar {
        width: 100%;
        height: 1px;
        background: var(--Black-100, #f0f0f0);
      }
    }
  }
`;

interface ManageRecruitProps {
  onClose: () => void;
}

const ManageRecruit = ({ onClose }: ManageRecruitProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const history = useHistory();
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [showRegisterRecruit, setShowRegisterRecruit] = useState(false);
  const [list, setList] = useState<Job[]>([]);
  const { user } = useUserInfo(true);
  const [recruitType, setSelectedRecruitType] = useState<RecruitType>("");
  const [showStoreList, setShowStoreList] = useState<boolean>(false);
  const [showRegisterEdit, setShowRegisterEdit] = useState(-1);
  const [storeList, setStoreList] = useState<Cafe[]>([]);
  const [cafe, setCafe] = useState<Cafe | null>(null);

  const query = useQueryParams();

  useEffect(() => {
    if (!user) {
      return;
    }

    setLoading(true);

    getSellerCafeList({})
      .then((res) => {
        setStoreList((prev) => [...prev, res]);

        setCafe(res);
      })
      .catch((e: any) => {
        enqueueSnackbar(e.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const updateList = useCallback(() => {
    const recruitType = query.get("recruitType");
    if (recruitType) {
      setSelectedRecruitType(recruitType);
    }
    const storeId = query.get("storeId");

    setLoading(true);
    getMyJobList({
      recruitType: recruitType ? [recruitType] : [],
      storeId: storeId,
    })
      .then((list) => {
        setList(list);
      })
      .catch((e: any) => {
        enqueueSnackbar("채용 목록을 가져올 수 없습니다:" + e.message, {
          variant: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [recruitType, cafe]);

  useEffect(() => {
    updateList();
  }, []);

  const handleSetCafe = (cafe: Cafe) => {
    setCafe(cafe);
    query.set("storeId", cafe.id);

    history.replace({
      search: query.toString(),
      state: location.state,
    });

    updateList();
  };

  const handleSetRecruitType = (type: RecruitType) => {
    if (type) {
      setSelectedRecruitType(type);
      query.set("recruitType", type);
    } else {
      setSelectedRecruitType("");
      query.delete("recruitType");
    }

    history.replace({
      search: query.toString(),
      state: location.state,
    });

    updateList();
  };

  return (
    <>
      {showRegisterRecruit && (
        <RegisterRecruit
          mode="write"
          update={updateList}
          onClose={() => setShowRegisterRecruit(false)}
        />
      )}
      {showRegisterEdit > -1 && (
        <RegisterRecruit
          mode="edit"
          recruitId={showRegisterEdit}
          update={updateList}
          onClose={() => setShowRegisterEdit(-1)}
        />
      )}
      <SearchWrapper scrollLock={showFilter}>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">내 채용 관리</div>
          <div
            className="button"
            onClick={() => {
              if (user?.validate) {
                setShowRegisterRecruit(true);
              } else {
                enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
                  variant: "error",
                });
              }
            }}
          >
            채용 등록
          </div>
        </div>
        <FilterWrapper>
          <div
            className="select-wrapper"
            onClick={() => setShowStoreList(!showStoreList)}
          >
            <div className="select">
              {cafe ? cafe.cafeName : "홀덤펍을 선택해주세요"}
            </div>
            <div className="arrow">
              <img src="/image-web/Icon/Arrow%20down.svg" />
            </div>
            {showStoreList && (
              <div className="search-list">
                {storeList.map((item, idx) => (
                  <>
                    <div className="item" onClick={() => handleSetCafe(item)}>
                      <div className="title">{item.cafeName}</div>
                      <div className="address">
                        {item.newAddress} {item.detailAddress}
                      </div>
                    </div>
                    {idx !== storeList.length - 1 && (
                      <div className="horizontal-bar" />
                    )}
                  </>
                ))}
              </div>
            )}
          </div>
          <div className="type-row">
            <div className="type-wrapper-inner">
              <div className="type-wrapper">
                {RecruitTypeLabels.map(({ type, label }, i) => {
                  return (
                    <div
                      className={
                        "type " + (recruitType === type ? "selected" : "")
                      }
                      key={i}
                      onClick={() => handleSetRecruitType(type)}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FilterWrapper>
        {list.length > 0 ? (
          <div className="list">
            <div className="inner">
              {list.map((item, index) => {
                return (
                  <ContentItemWrapper
                    key={item.id}
                    onClick={() => {
                      history.push("/recruit/detail/" + item.id);
                    }}
                  >
                    {item.state === "DONE" && <div className="dim" />}
                    <div className="top-row">
                      <div className="pub-badge">
                        {isPremiumAndVIP(item.pubType) && (
                          <img src="/image-web/store/premium.png" />
                        )}
                        {item.pubType === "NORMAL" && (
                          <img src="/image-web/store/store_normal.png" />
                        )}
                      </div>
                      <div className="badge">
                        {getRecruitStateLabel(item.state)}
                      </div>
                      <div className="badge">
                        {getRecruitTypeLabel(
                          item.recruitType,
                          item.recruitTypeEtc
                        )}
                      </div>
                      {item.owner && (
                        <div
                          className="edit"
                          onClick={(e) => {
                            setShowRegisterEdit(item.id);
                            e.stopPropagation();
                          }}
                        >
                          수정
                        </div>
                      )}
                    </div>
                    <div className="info-wrapper">
                      <div className="title">{item.cafeName}</div>
                      <div className="info">{item.place}</div>
                      <div className="info">
                        성별: {getGenderLabel(item.gender)}
                      </div>
                      <div className="money">
                        시급: {item.hourlyPay.toLocaleString()}원
                      </div>
                    </div>
                  </ContentItemWrapper>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-wrapper">
            <img src="/image-web/None.png" />
            <span>
              등록한 채용공고가
              <br />
              없습니다.
            </span>
            <div
              className="button"
              onClick={() => {
                if (user?.validate) {
                  setShowRegisterRecruit(true);
                } else {
                  enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
                    variant: "error",
                  });
                }
              }}
            >
              채용 등록하기
            </div>
          </div>
        )}
      </SearchWrapper>
    </>
  );
};
export default ManageRecruit;
