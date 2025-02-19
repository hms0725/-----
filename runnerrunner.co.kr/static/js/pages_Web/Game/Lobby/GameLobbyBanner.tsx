import { useEffect, useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import { GameLobbyBannerWrapper } from "../Style/GameStyles";

export const GameLobbyBanner = () => {
  const { history } = useGameContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [list, setList] = useState([
    {
      img: "/image-web/game/lobby/holdem-banner.png",
      title: "언제 어디서나\n즐길 수 있는 홀덤 게임",
      description: "",
    },
    {
      img: "/image-web/game/lobby/tournament-banner.png",
      title: "무료 토너먼트에\n참여하고 GP 획득",
      description: "",
    },
    {
      img: "/image-web/game/lobby/free-tournament-banner.png",
      title: "다양한 토너먼트를 많은\n사람들과 즐기세요",
      description: "",
    },
  ]);
  useEffect(() => {
    if (list.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % list.length;
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(intervalId); // Clear the interval on component unmount
    }
  }, [list]);
  return (
    <GameLobbyBannerWrapper>
      <img src={list[currentIndex].img} />
      <div
        className="title"
        dangerouslySetInnerHTML={{
          __html: list[currentIndex].title.replace(/\n/g, "<br />"),
        }}
      ></div>
      <div className="description">{list[currentIndex].description}</div>
      <div className="progress-dots">
        {list.map((_, i) => (
          <div
            key={i}
            className={`dot ${currentIndex === i ? "active" : ""}`}
          />
        ))}
      </div>
    </GameLobbyBannerWrapper>
  );
};
