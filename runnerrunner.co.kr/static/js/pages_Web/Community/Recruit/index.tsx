import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchFilter from "./SearchFilter";
import RegisterRecruit from "./RegisterRecruit";
import {
  Job,
  jobList,
  JobSearchParams,
  RecruitType,
  UserJob,
  userJobList,
} from "../../../../api/job";
import { enqueueSnackbar } from "notistack";
import {
  getDistanceKm,
  isPremiumAndVIP,
  parseJSON,
} from "../../../../utils/common";
import useGeoLocation from "../../../../hooks/useGeoLocation";
import {
  getGenderLabel,
  getRecruitSortLabel,
  getRecruitStateLabel,
  getRecruitTypeLabel,
  RecruitSortLabels,
  RecruitTypeLabels,
} from "../../../../utils/constants";
import useUserInfo from "../../../../hooks/useUserInfo";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";
import useQueryParams from "../../../../hooks/useQueryParams";
import useCities from "../../../../hooks/useCities";
import RegisterUserRecruit from "./RegisterUserRecruit";
import { Swiper, SwiperSlide } from "swiper/react";
import { WriteButton } from "../style/hand-board";
import { RecruitSortWrapper } from "./style";
import { CommunityCommonBannerWrapper } from "../style";
import { cafeDetail } from "../../../../api/cafe";

const RecruitWrapper = styled.div<{
  scrollLock: boolean;
}>`
  border-top: 1px solid #f0f0f0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
    `
      : `
      overflow-y: scroll;
    `}

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
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
  padding: 12px 0;
  gap: 12px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
  z-index: 11;

  > .type-row {
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
        cursor: pointer;
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
const ContentWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .swiper-wrappers {
    width: calc(100% - 32px); // 전체 너비에서 왼쪽 패딩 16px를 뺌
    margin-left: 16px; // left 대신 margin-left 사용
    padding-right: 16px; // 오른쪽 여백 16px 추가
  }

  .swiper-slides {
    width: 282px !important;
    height: 203px;
  }
  > .top-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    > .title {
      margin-left: 16px;
      color: #000;
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
    }
    > .list-wrapper {
      width: 100%;
    }
  }

  > .box {
    padding-top: 12px;
    padding-left: 10px;
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 15.4px */
    letter-spacing: -0.22px;
  }

  > .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    padding: 20px 16px;
    > .empty-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      gap: 12px;

      > img {
        margin-top: 10px;
        width: 180px;
        object-fit: contain;
      }

      > .empty-text {
        width: 100%;
        color: var(--Black-300, #808080);
        text-align: center;
        font-family: Pretendard;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
`;
export const ContentItemWrapper = styled.div<{
  selected?: boolean;
}>`
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  border-radius: 8px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  background: #fff;
  position: relative;
  padding: 12px;
  @media ${MEDIA_DESKTOP} {
    box-shadow: none;
    border-radius: 12px;
    border: 1px solid var(--Black-100, #f0f0f0);
    background: #fff;
    ${(p) =>
      p.selected
        ? `
        border: 2px solid var(--Purple-300, #6436E7);
        padding: 11px;
      `
        : `
      
      `}
  }

  > .dim {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
    border-radius: 8px;
  }

  > .top-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    position: relative;

    > .edit {
      right: 0;
      position: absolute;
      cursor: pointer;
      display: flex;
      width: 54px;
      height: 22px;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: var(--Black-100, #f0f0f0);
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .pub-badge {
      position: relative;
      width: 22px;
      height: 22px;
      border-radius: 39px;
      background: var(--Purple-100, #f0eaff);

      > img {
        width: 16px;
        height: 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
    }

    > .badge {
      padding: 4px 6px;
      border-radius: 16.667px;
      border: 1px solid var(--Purple-100, #f0eaff);
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  > .info-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }

    > .info {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.26px;
    }

    > .money {
      width: 100%;
      text-align: right;
      color: var(--Black-400, #444);
      text-align: right;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }
  }

  > .edit-button {
    cursor: pointer;
    position: absolute;
    top: 12px;
    right: 12px;
    border-radius: 10px;
    background: var(--Black-100, #f0f0f0);
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    width: 54px;
    height: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const BestItemWrapper = styled.div`
  width: 282px;
  height: 203px;
  border-radius: 8px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  position: relative;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  > .info-wrapper {
    position: absolute;
    bottom: 12px;
    left: 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    > .pub-info {
      display: flex;
      flex-direction: column;
      width: 258px;
      height: 64px;
      padding: 8px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);

      > .pub-name {
        color: #fff;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.26px;
      }

      > .place {
        margin-top: 2px;
        color: #fff;
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.22px;
      }

      > .pay {
        text-align: end;
        color: #fff;
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.22px;
      }
    }

    > .recruit-info {
      display: flex;
      flex-direction: row;
      gap: 4px;

      > .item {
        padding: 4px 6px;
        border-radius: 16.667px;
        background: #2d3034;
        color: #fff;
        font-family: Pretendard;
        font-size: 8px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
`;

interface RecruitPageProps {
  onClose?: () => void;
}

const RecruitPage = ({ onClose }: RecruitPageProps) => {
  const history = useHistory();
  const { user } = useUserInfo();
  const [showFilter, setShowFilter] = useState(false);
  const [showRegisterRecruit, setShowRegisterRecruit] = useState(false);
  const [showRegisterUserRecruit, setShowRegisterUserRecruit] = useState(false);
  const [showRegisterUserEdit, setShowRegisterUserEdit] = useState(-1);
  const [showRegisterEdit, setShowRegisterEdit] = useState(-1);
  const [showSortFilter, setShowSortFilter] = useState(false);
  const [showTypeSortFilter, setShowTypeSortFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [recruitType, setSelectedRecruitType] = useState<RecruitType>("");
  const [list, setList] = useState<any[]>([]);
  const [bestList, setBestList] = useState<any[]>([]);
  const [userList, setUserList] = useState<UserJob[]>([]);
  const [filter, setFilter] = useState<JobSearchParams>({});
  const [cafeDetailsCache, setCafeDetailsCache] = useState<Record<string, any>>(
    {}
  );
  const [stateInited, setStateinited] = useState(false);

  const { latitude, longitude } = useGeoLocation();
  const query = useQueryParams();
  const { provinces } = useCities();

  const refreshFilter = () => {
    setFilter({});
    setSelectedRecruitType("");
  };

  const transformType = (type: RecruitType) => {
    switch (type) {
      case "":
        return "전체";
      case "DEALER":
        return "딜러";
      case "PRACTICE_DEALER":
        return "연습딜러";
      case "SERVANT":
        return "서버";
      case "ETC":
        return "기타";
    }
  };

  const fetchRegularJobs = async (
    filter: JobSearchParams,
    latitude: number,
    longitude: number,
    recruitType?: string
  ) => {
    const response = await jobList({
      ...filter,
      recruitType: undefined,
      lat: latitude,
      lon: longitude,
    });

    // 프리미엄 목록 처리
    const premiumListings = response.filter((item) =>
      isPremiumAndVIP(item.pubType)
    );
    if (premiumListings.length > 0) {
      const detailedListings = await Promise.all(
        premiumListings.map(async (item) => {
          if (cafeDetailsCache[item.cafeId]) {
            return cafeDetailsCache[item.cafeId];
          }
          const details = await cafeDetail(item.cafeId);
          setCafeDetailsCache((prev) => ({
            ...prev,
            [item.cafeId]: details,
          }));
          return details;
        })
      );

      const enhancedPremiumListings = premiumListings.map((item, index) => ({
        ...item,
        images: detailedListings[index].images || [],
      }));
      setBestList(enhancedPremiumListings);
    }

    // recruitType에 따른 필터링
    const filteredListings = recruitType
      ? response.filter((item) => item.recruitType === recruitType)
      : response;

    setList(filteredListings);
  };

  // 사용자 채용 목록을 가져오는 함수
  const fetchUserJobs = async (
    filter: JobSearchParams,
    latitude: number,
    longitude: number
  ) => {
    const list = await userJobList({
      ...filter,
      recruitType: recruitType ? [recruitType] : undefined,
      lat: latitude,
      lon: longitude,
    });
    setUserList(list);
  };

  const updateList = useCallback(async () => {
    if (!stateInited) {
      return;
    }

    try {
      // 병렬로 두 요청을 처리
      await Promise.all([
        fetchRegularJobs(filter, latitude, longitude, recruitType),
        fetchUserJobs(filter, latitude, longitude),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      enqueueSnackbar(`채용 목록을 가져올 수 없습니다: ${errorMessage}`, {
        variant: "error",
      });
    }
  }, [stateInited, recruitType, filter, latitude, longitude, cafeDetailsCache]);

  const sortedList = useMemo(() => {
    if (list.length === 0) {
      return [];
    }

    const combinedList = [
      ...list.map((item) => ({ ...item, jobType: "pub" })), // 업체 구인정보
      ...userList.map((item) => ({ ...item, jobType: "user" })), // 개인 구직정보
    ];

    return combinedList.sort((a, b) => {
      if (selectedSort === "oldest") {
        return a.id - b.id;
      } else if (selectedSort === "nearest") {
        const distanceA = Number(
          getDistanceKm(latitude, longitude, a.lat, a.lon)
        );
        const distanceB = Number(
          getDistanceKm(latitude, longitude, b.lat, b.lon)
        );
        return distanceA - distanceB;
      } else if (selectedSort === "highNet") {
        return b.hourlyPay - a.hourlyPay;
      }

      return b.id - a.id;
    });
  }, [list, userList, selectedSort, latitude, longitude]);

  useEffect(() => {
    updateList();
  }, [updateList]);

  // URL 쿼리에서 상태 반영
  useEffect(() => {
    const recruitType = query.get("recruit_type");
    if (recruitType) {
      setSelectedRecruitType(recruitType);
    }

    const sort = query.get("sort");
    if (sort) {
      setSelectedSort(sort);
    }

    const filter = parseJSON(query.get("filter"));
    if (filter) {
      setFilter(filter);
    }

    setStateinited(true);
  }, []);

  // URL 쿼리 수정
  useEffect(() => {
    if (recruitType) query.set("recruit_type", recruitType);
    if (selectedSort) query.set("sort", selectedSort);

    query.set("filter", JSON.stringify(filter));

    history.replace({ search: query.toString() });
  }, [recruitType, selectedSort, filter]);

  return (
    <>
      {showFilter && (
        <SearchFilter
          provinces={provinces}
          filter={filter}
          onApplyFilter={setFilter}
          onClose={() => setShowFilter(false)}
        />
      )}
      {showRegisterRecruit && (
        <RegisterRecruit
          mode="write"
          update={updateList}
          onClose={() => setShowRegisterRecruit(false)}
        />
      )}
      {showRegisterUserRecruit && (
        <RegisterUserRecruit
          mode="write"
          update={updateList}
          onClose={() => setShowRegisterUserRecruit(false)}
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
      {showRegisterUserEdit > -1 && (
        <RegisterUserRecruit
          mode="edit"
          recruitId={showRegisterUserEdit}
          update={updateList}
          onClose={() => setShowRegisterUserEdit(-1)}
        />
      )}
      <RecruitWrapper scrollLock={false}>
        <div className="inner">
          <ContentWrapper>
            {/* <CommunityCommonBannerWrapper>
              <div className="banner">
                <span>
                  실시간 채용
                  <br />
                  가이드
                </span>
                <img
                  src="/image-web/community/banner-job.png"
                  alt="banner-icon"
                />
              </div>
            </CommunityCommonBannerWrapper> */}
            {bestList.length > 0 && (
              <div className="top-wrapper">
                <div className="title">
                  {user ? user.nickname : "고객"}님을 위한
                  <br /> 눈 여겨 볼만한 채용 👀
                </div>
                <div className="list-wrapper">
                  <Swiper
                    className="swiper-wrappers"
                    centeredSlides={false}
                    style={{ marginRight: "20px" }}
                    spaceBetween={10}
                    slidesPerView="auto"
                  >
                    {bestList.map((item, index) => {
                      return (
                        <SwiperSlide
                          className="swiper-slides"
                          key={`best-${item.id}`}
                        >
                          <BestItemWrapper
                            onClick={() => {
                              history.push(
                                "/recruit/detail/" + item.id + "/pub"
                              );
                            }}
                          >
                            <img
                              src={
                                item.images?.[0].imageUrl ||
                                "https://dfesoodpx4jgd.cloudfront.net/cafe/default.png"
                              }
                              alt={item.cafeName}
                            />
                            <div className="info-wrapper">
                              <div className="recruit-info">
                                <div className="item">
                                  {getRecruitStateLabel(item.state)}
                                </div>
                                <div className="item">
                                  {getRecruitTypeLabel(
                                    item.recruitType,
                                    item.recruitTypeEtc
                                  )}
                                </div>
                                <div className="item">
                                  {getGenderLabel(item.gender)}
                                </div>
                              </div>
                              <div className="pub-info">
                                <div className="pub-name">{item.cafeName}</div>
                                <div className="place">{item.place}</div>
                                <div className="pay">
                                  시급 : {item.hourlyPay.toLocaleString()}원
                                </div>
                              </div>
                            </div>
                          </BestItemWrapper>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>
            )}

            <RecruitSortWrapper>
              <img
                src="/image-web/search/refresh.svg"
                alt="새로고침"
                onClick={() => refreshFilter()}
              />
              <div
                className="item"
                style={{ flex: 1 }}
                onClick={() => {
                  setShowTypeSortFilter(!showTypeSortFilter);
                  setShowSortFilter(false);
                }}
              >
                <span>{transformType(recruitType)}</span>
                <img src="/image-web/Icon/Arrow down.svg" alt="드롭다운" />
                {showTypeSortFilter && (
                  <div className="sort-popup">
                    {RecruitTypeLabels.map(({ type, label }, i) => {
                      return (
                        <div
                          className={
                            "item " + (recruitType === type ? "selected" : "")
                          }
                          key={i}
                          onClick={() => setSelectedRecruitType(type)}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div
                className="item"
                onClick={() => {
                  setShowSortFilter(!showSortFilter);
                  setShowTypeSortFilter(false);
                }}
              >
                <span>{getRecruitSortLabel(selectedSort)}</span>
                <img src="/image-web/Icon/Arrow down.svg" alt="드롭다운" />
                {showSortFilter && (
                  <div className="sort-popup">
                    {RecruitSortLabels.map(({ type, label }, i) => {
                      return (
                        <div
                          className={
                            "item " + (selectedSort === type ? "selected" : "")
                          }
                          key={i}
                          onClick={() => setSelectedSort(type)}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <img
                src="/image-web/search/detail.svg"
                alt="필터"
                onClick={() => setShowFilter(true)}
              />
            </RecruitSortWrapper>
            <div className="box">
              <li>러너러너 회원이면 누구나 채용등록 가능합니다.</li>
              <li>
                각 채용 항목들에 대해서 러너 소프트에 책임과 권한이 없음을
                알려드립니다.
              </li>
            </div>
            <div className="content">
              {sortedList.length === 0 && (
                <div className="empty-wrapper">
                  <img src="/image-web/None.png" />
                  <div className="empty-text">채용 정보가 없습니다.</div>
                </div>
              )}
              {sortedList.map((item, index) => {
                return (
                  <ContentItemWrapper
                    key={`${item.jobType}-${item.id}`}
                    onClick={() => {
                      history.push(
                        "/recruit/detail/" + item.id + "/" + item.jobType
                      );
                    }}
                  >
                    {item.state === "DONE" && <div className="dim" />}
                    <div className="top-row">
                      {item.jobType === "pub" && (
                        <div className="pub-badge">
                          {isPremiumAndVIP(item.pubType) && (
                            <img src="/image-web/store/premium.png" />
                          )}
                          {!isPremiumAndVIP(item.pubType) && (
                            <img src="/image-web/store/store_normal.png" />
                          )}
                        </div>
                      )}
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
                            if (item.jobType === "pub") {
                              setShowRegisterEdit(item.id);
                            } else {
                              setShowRegisterUserEdit(item.id);
                            }
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
          </ContentWrapper>
        </div>
        {user && (user.role === "ROLE_USER" || user.role === "ROLE_SELLER") && (
          <WriteButton
            onClick={() => {
              if (user?.validate) {
                if (user?.role && user.role === "ROLE_USER") {
                  setShowRegisterUserRecruit(true);
                }
                if (user.role && user.role === "ROLE_SELLER") {
                  setShowRegisterRecruit(true);
                }
              } else {
                enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
                  variant: "error",
                });
              }
            }}
          >
            <img src="/image-web/market/write.svg" alt="글 작성" />
          </WriteButton>
        )}
      </RecruitWrapper>
    </>
  );
};
export default RecruitPage;
