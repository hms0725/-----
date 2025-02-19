import { useEffect, useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import { GameBannerWrapper } from "../Style/GameStyles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import styled from "styled-components";
const Wrapper = styled.div`
  width: 100%;
  position: relative;
  > .progress-dots {
    z-index: 100;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    gap: 10px;
    > .dot {
      border-radius: 10.5px;
      opacity: 0.9;
      background: #fff;
      width: 10px;
      height: 10px;
      transition: all 0.4s ease;
    }

    > .dot.active {
      width: 31px;
      height: 10px;
      border-radius: 10.5px;
      background: #ffd200;
      transition: all 0.4s ease;
    }
  }
`;
export const GameBanner = () => {
  const { history } = useGameContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [list, setList] = useState([
    {
      img: "/image-web/game/banner1.png",
      title: "매일 두번 진행되는\n 무료 GP 토너먼트",
      description: "낮 2시 밤8시 토너먼트 참여하고 GP를 획득하세요",
    },
    {
      img: "/image-web/game/banner2.png",
      title: "러너 홀덤에서 다양한\n 홀덤 게임을 즐겨보세요!",
      description: "토너먼트 링게임",
    },
  ]);
  // useEffect(() => {
  //   if (list.length > 0) {
  //     const intervalId = setInterval(() => {
  //       setCurrentIndex((prevIndex) => {
  //         const nextIndex = (prevIndex + 1) % list.length;
  //         return nextIndex;
  //       });
  //     }, 3000);

  //     return () => clearInterval(intervalId); // Clear the interval on component unmount
  //   }
  // }, [list]);
  return (
    <Wrapper>
      <Swiper
        className="banner-swiper"
        onRealIndexChange={(swiper: any) =>
          setCurrentIndex(swiper.realIndex || 0)
        }
        loop={true}
        autoplay={{ delay: 3000 }}
        modules={[Autoplay]}
      >
        {list.map((item, index) => (
          <SwiperSlide key={index}>
            <GameBannerWrapper>
              <img src={item.img} />
              <div
                className="title"
                dangerouslySetInnerHTML={{
                  __html: item.title.replace(/\n/g, "<br />"),
                }}
              ></div>
              <div className="description">{item.description}</div>
            </GameBannerWrapper>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="progress-dots">
        {list.map((_, i) => (
          <div
            key={i}
            className={`dot ${currentIndex === i ? "active" : ""}`}
          />
        ))}
      </div>
    </Wrapper>
  );
};
