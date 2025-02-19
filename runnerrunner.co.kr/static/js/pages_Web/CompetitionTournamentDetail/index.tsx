import { useHistory, useParams } from "react-router-dom";
import {
  CompetitionEventItem,
  CompetitionEventListWrapper,
  CompetitionTournamentDetailWrapper,
  CompetitionTournamentPosterWrapper,
} from "./style";
import { useEffect, useState } from "react";
import {
  CompetitionTournamentDetailResponse,
  getCompetitionTournamentById,
} from "../../../api/competition";
import ImageViewer from "../../../components/ImageViewer";
import { Swiper, SwiperSlide } from "swiper/react";
import moment from "moment";

type CompetitionEvent = {
  name: string;
  date: string;
  buyIn: string | number;
  registrationEndLevelString: string;
  durations: string;
  startingStack: number;
};

const CompetitionTournamentDetail = () => {
  const [data, setData] = useState<CompetitionTournamentDetailResponse | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const param = useParams();
  const detailId = (param as any).id;

  const history = useHistory();
  const getDetail = async () => {
    const id = +detailId;
    const res = await getCompetitionTournamentById(id);
    setData(res);
  };

  useEffect(() => {
    getDetail();
  }, []);

  function formatDateToKorean(dateString: string) {
    const date = new Date(dateString);

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = weekDays[date.getDay()];

    return `${month}월 ${day}일(${dayOfWeek})`;
  }

  const getStatus = (date: string): string => {
    const targetDate = new Date(date);

    // 시와 분을 가져와서 두 자리 숫자로 포맷팅
    const hours = targetDate.getHours().toString().padStart(2, "0");
    const minutes = targetDate.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };
  const groupEventsByDate = (events: CompetitionEvent[]) => {
    return events.reduce((groups, event) => {
      const dateKey = formatDateToKorean(event.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    }, {} as Record<string, CompetitionEvent[]>);
  };

  const getStatusInfo = () => {
    if (!data) return "진행중";
    const now = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (now < startDate) {
      return "진행 예정";
    } else if (now >= startDate && now <= endDate) {
      return "진행중";
    } else {
      return "마감";
    }
  };

  return (
    <CompetitionTournamentDetailWrapper>
      <div className="header">
        <img
          src="/image-web/Icon/Back.svg"
          alt="close"
          onClick={() => history.goBack()}
        />
        <div className="title">{data?.title}</div>
      </div>
      {selectedImageIndex !== -1 && (
        <ImageViewer
          images={data?.posters || []}
          defaultIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
      <CompetitionTournamentPosterWrapper>
        <Swiper
          slidesPerView={1}
          className="swiper-container"
          onSlideChange={(swiper: any) => setCurrentIndex(swiper.realIndex)}
        >
          {data?.posters.map((url, i) => (
            <SwiperSlide key={i} className="swiper-slide">
              <img
                src={url}
                alt={`Slide ${i}`}
                onClick={() => setSelectedImageIndex(i)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="progress-dots">
          {data?.posters.map((_, i) => (
            <div
              key={i}
              className={`dot ${currentIndex === i ? "active" : ""}`}
            />
          ))}
        </div>
      </CompetitionTournamentPosterWrapper>
      <CompetitionEventListWrapper>
        {data?.competitionEvents && data.competitionEvents.length > 0 ? (
          Object.entries(groupEventsByDate(data.competitionEvents)).map(
            ([date, events]) => (
              <div key={date}>
                <div className="date">{date}</div>
                {events.map((item, index) => (
                  <CompetitionEventItem key={index}>
                    <div className="item">
                      <div className="header">
                        <div className="title">{item.name}</div>
                        <div className="doing">{getStatus(item.date)} ~</div>
                      </div>

                      <div className="info-wrapper">
                        <div className="row">
                          <div className="item">
                            <div>바이인</div>
                            <div className="value">{item.buyIn}</div>
                          </div>
                          <div className="item">
                            <div>레지 마감 레벨</div>
                            <div className="value">
                              {item.registrationEndLevelString}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="item">
                            <div>듀레이션</div>
                            <div className="value">
                              {item.durations + "min"}
                            </div>
                          </div>
                          <div className="item">
                            <div>시작 스택</div>
                            <div className="value">
                              {item.startingStack === 0
                                ? "-"
                                : item.startingStack.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CompetitionEventItem>
                ))}
              </div>
            )
          )
        ) : (
          <div className="base-wrapper">
            <div className="status">{getStatusInfo()}</div>
            <div className="title">{data?.title}</div>
            <div className="location">{data?.location}</div>
            <div className="date">
              {moment(data?.startDate).format("YYYY년 MM월 DD일 HH시 mm분")} ~{" "}
              {moment(data?.endDate).format("YYYY년 MM월 DD일 HH시 mm분")}
            </div>
          </div>
        )}
      </CompetitionEventListWrapper>
    </CompetitionTournamentDetailWrapper>
  );
};

export default CompetitionTournamentDetail;
