import { useState } from "react";
import {
  CompetitionType,
  KoreaRegion,
  WorldRegion,
} from "../../../api/competition";
import { useCompetitionContext } from "./hook/competitionContext";
import {
  CompetitionBodyWrapper,
  CompetitionHorizontalBar,
  CompetitionTournamentDropDownBox,
  CompetitionTournamentHeader,
  CompetitionTournamentMainBanner,
  CompetitionTournamentSelector,
  CompetitionTournamentTypeWrapper,
  CompetitionTournamentWrapper,
} from "./styles";
import CompetitionItem from "./component/competitionItem";
import Pagination from "../../../components/web/Pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const CompetitionTournament = () => {
  const {
    competitionList,
    page,
    setPage,
    year,
    setYear,
    month,
    setMonth,
    type,
    setType,
    lastPage,
    isSelectedType,
    showCountByType,
    getKoreanRegion,
    region,
    setRegion,
  } = useCompetitionContext();
  const [isMonthSelect, setIsMonthSelect] = useState(false);
  const [isYearSelect, setIsYearSelect] = useState(false);
  const [isRegionSelect, setIsRegionSelect] = useState(false);
  const [currenBannerIndex, setCurrentBannerIndex] = useState(0);
  const years = [2024, 2025, 2026];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const regionList =
    type === CompetitionType.INTERNATIONAL
      ? Object.values(WorldRegion)
      : Object.values(KoreaRegion);
  const handleSelectType = (type: CompetitionType) => {
    setRegion(null);
    setIsMonthSelect(false);
    setIsRegionSelect(false);
    setIsYearSelect(false);
    setType(type);
  };
  const banners = [
    "https://d10avy7otljqld.cloudfront.net/competition-banner/1.jpg",
    "https://d10avy7otljqld.cloudfront.net/competition-banner/2.jpg",
    "https://d10avy7otljqld.cloudfront.net/competition-banner/3.jpg",
  ];
  return (
    <CompetitionTournamentWrapper>
      <div className="banner-swiper">
        <Swiper
          className="banner-swiper"
          onRealIndexChange={(swiper: any) =>
            setCurrentBannerIndex(swiper.realIndex || 0)
          }
          loop={banners.length > 1}
          autoplay={{ delay: 4000 }}
          modules={[Autoplay]}
        >
          {banners.map((item, i) => (
            <SwiperSlide key={i}>
              <CompetitionTournamentMainBanner src={item} alt="메인 배너" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="page-wrapper">
          <span>{currenBannerIndex + 1}</span> / {banners.length}
        </div>
      </div>

      <CompetitionTournamentHeader>
        <div className="header">
          <div className="title">토너먼트 정보</div>
          <div className="date-box">
            <CompetitionTournamentSelector
              onClick={() => {
                setIsMonthSelect(false);
                setIsRegionSelect(false);
                setIsYearSelect(!isYearSelect);
              }}
            >
              <div className="value">{`${year}년`}</div>
              <img src="/image-web/competition/drop-down.svg" alt="drop-down" />
              {isYearSelect && (
                <CompetitionTournamentDropDownBox>
                  {years.map((item, index) => (
                    <div
                      className={`item ${item === year && "active"}`}
                      key={index}
                      onClick={() => {
                        setYear(item);
                        setPage(1);
                      }}
                    >
                      {item}년
                    </div>
                  ))}
                </CompetitionTournamentDropDownBox>
              )}
            </CompetitionTournamentSelector>
            <CompetitionTournamentSelector
              onClick={() => {
                setIsYearSelect(false);
                setIsRegionSelect(false);
                setIsMonthSelect(!isMonthSelect);
              }}
            >
              <div className="value">{`${month}월`}</div>
              <img src="/image-web/competition/drop-down.svg" alt="drop-down" />
              {isMonthSelect && (
                <CompetitionTournamentDropDownBox style={{ left: "-30px" }}>
                  {months.map((item, index) => (
                    <div
                      className={`item ${item === month && "active"}`}
                      key={index}
                      onClick={() => {
                        setMonth(item);
                        setPage(1);
                      }}
                    >
                      {item}월
                    </div>
                  ))}
                </CompetitionTournamentDropDownBox>
              )}
            </CompetitionTournamentSelector>
          </div>
        </div>
        <CompetitionTournamentTypeWrapper>
          <div
            className={`item ${isSelectedType(CompetitionType.PUB)}`}
            onClick={() => {
              handleSelectType(CompetitionType.PUB);
              setPage(1);
            }}
          >
            펍 대회
          </div>
          <div
            className={`item ${isSelectedType(CompetitionType.DOMESTIC)}`}
            onClick={() => {
              handleSelectType(CompetitionType.DOMESTIC);
              setPage(1);
            }}
          >
            국내 대회
          </div>
          <div
            className={`item ${isSelectedType(CompetitionType.INTERNATIONAL)}`}
            onClick={() => {
              handleSelectType(CompetitionType.INTERNATIONAL);
              setPage(1);
            }}
          >
            해외 대회
          </div>
        </CompetitionTournamentTypeWrapper>
      </CompetitionTournamentHeader>
      <CompetitionHorizontalBar />
      <CompetitionBodyWrapper>
        <div className="header">
          {showCountByType()}
          <CompetitionTournamentSelector
            onClick={() => {
              setIsYearSelect(false);
              setIsMonthSelect(false);

              setIsRegionSelect(!isRegionSelect);
            }}
          >
            <div className="value">{`${getKoreanRegion(region)}`}</div>
            <img src="/image-web/competition/drop-down.svg" alt="drop-down" />
            {isRegionSelect && (
              <CompetitionTournamentDropDownBox
                style={{ left: "-25px", maxHeight: "250px" }}
              >
                {regionList.map((item, index) => (
                  <div
                    key={index}
                    className={`item ${
                      region === null && item === "ALL"
                        ? "active"
                        : region === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      if (item === "ALL") {
                        setRegion(null);
                      } else {
                        setRegion(item);
                      }

                      setIsRegionSelect(false);
                    }}
                  >
                    {getKoreanRegion(item)}
                  </div>
                ))}
              </CompetitionTournamentDropDownBox>
            )}
          </CompetitionTournamentSelector>
        </div>
        <div className="list-wrapper">
          {competitionList.map((item, index) => (
            <CompetitionItem key={index} data={item} />
          ))}
        </div>

        {lastPage > 1 && (
          <Pagination
            currentPage={page}
            totalPages={lastPage}
            onPageChange={setPage}
          />
        )}
      </CompetitionBodyWrapper>
    </CompetitionTournamentWrapper>
  );
};

export default CompetitionTournament;
