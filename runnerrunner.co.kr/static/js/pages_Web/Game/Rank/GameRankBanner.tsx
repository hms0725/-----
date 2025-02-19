import { useState } from "react";
import { GameRankBannerWrapper } from "../Style/GameStyles";

export const GameRankBanner = () => {
  const [currentIndex] = useState(0);
  const [list] = useState([
    {
      img: "/image-web/game/rank/rank_banner.png",
      title: "토너먼트에 참여하고\n러너홀덤 랭커에 도전 하세요!",
      description: "더이상의 자세한 설명은 없다",
    },
  ]);

  return (
    <GameRankBannerWrapper>
      <img alt="배너" src={list[currentIndex].img} />
      <div
        className="title"
        dangerouslySetInnerHTML={{
          __html: list[currentIndex].title.replace(/\n/g, "<br />"),
        }}
      ></div>
      <div className="description">{list[currentIndex].description}</div>
    </GameRankBannerWrapper>
  );
};
