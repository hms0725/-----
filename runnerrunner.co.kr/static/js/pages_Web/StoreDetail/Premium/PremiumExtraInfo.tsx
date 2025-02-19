// components/ExtraInfo.tsx
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Cafe, PubTournament } from "../../../../api/types";
import { calculateTimeAtStart, calculateTimes } from "../../../../utils/timer";
import Tournament from "./Tournament";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";

// SwiperCore.use([Navigation]);

const ExtraInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 0px 30px;
  background: rgba(36, 15, 96, 1);
  color: white;
  overflow: hidden;
  > .box {
    width: 100%;
  }
  > .title-row {
    padding: 0px 16px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      font-family: Pretendard;
      font-size: 20px;
      font-weight: 700;
      line-height: 23.87px;
      text-align: left;
    }

    > .ing {
      font-family: Pretendard;
      font-size: 12px;
      font-weight: 300;
      line-height: 14.32px;
      text-align: right;
    }
  }

  .swiper {
    width: calc(100% - 16px); // 전체 너비에서 왼쪽 패딩 16px를 뺌
    margin-left: 16px; // left 대신 margin-left 사용
    padding-right: 16px; // 오른쪽 여백 16px 추가
    overflow: visible;
  }
`;

export const EmptyTournament = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 16px;
  width: 100%;
  border-radius: 8px;
  height: 182px;
  background: #d9d9d9;
  color: white;
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

interface ExtraInfoProps {
  data: Cafe;
  currentTime: Date;
}

const PremiumExtraInfo: React.FC<ExtraInfoProps> = ({ data, currentTime }) => {
  const [tournamentList, setTournamentList] = useState<PubTournament[]>([]);
  const swiperRef = useRef<SwiperCore>();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!data) return;

    const list = [];
    const onTournamentList = data.pubTournamentList;
    for (var tournament of onTournamentList) {
      if (tournament.timerDto) {
        const time = calculateTimes(tournament.timerDto, tournament.structure);
        if (time && time.overStack < 1) {
          tournament.timeInfo = time;
          list.push(tournament);
        }
      } else {
        const startDate = new Date(tournament.startDate);
        const time = calculateTimeAtStart(
          startDate,
          new Date(tournament.createdAt),
          tournament.structure[0],
          tournament.structure[1]
        );
        tournament.timeInfo = time;
        if (
          tournament.timeInfo.remainingTimeInCurrentLevel.indexOf("NaN") === -1
        )
          list.push(tournament);
      }
    }
    setTournamentList(list);
  }, [data, currentTime]);

  useEffect(() => {
    if (swiperRef.current && tournamentList.length > 0 && count === 0) {
      const index = getVisibleSlideIndex();
      if (
        !swiperRef.current.destroyed &&
        swiperRef.current.activeIndex !== index
      ) {
        swiperRef.current.slideTo(index, 0);
      }
      setCount(count + 1);
    }
  }, [tournamentList]);

  const canReservation = (pubTournament: PubTournament): boolean => {
    return pubTournament.reservation
      ? pubTournament.registerDeadlineLevel >
        pubTournament.timeInfo.currentLevel.level
        ? true
        : false
      : false;
  };

  const getVisibleSlideIndex = (): number => {
    for (let i = 0; i < tournamentList.length; i++) {
      if (canReservation(tournamentList[i])) {
        return i;
      }
    }
    return 0;
  };

  return (
    <>
      <ExtraInfoWrapper>
        <div className="title-row">
          <div className="title">진행중인 게임</div>
          <div className="ing">{`게임 ${data.pubTournamentList.length} 진행중`}</div>
        </div>
        <div className="box">
          <Swiper
            onSwiper={(swiper: any) => (swiperRef.current = swiper)}
            slidesPerView={1.1}
            centeredSlides={false}
            spaceBetween={12}
            className="swiper"
          >
            {tournamentList.length === 0 && (
              <SwiperSlide className="swiper-slide">
                <EmptyTournament>
                  진행중인
                  <br /> 토너먼트 정보가 없습니다.
                </EmptyTournament>
              </SwiperSlide>
            )}
            {tournamentList.map((item, i) => {
              return (
                <SwiperSlide key={i} className="swiper-slide">
                  <Tournament item={item} timer={item.timeInfo}></Tournament>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </ExtraInfoWrapper>
    </>
  );
};

export default PremiumExtraInfo;
