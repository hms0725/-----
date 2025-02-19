import { useState } from "react";
import {
  GameRankBannerWrapper,
  GameRankPodiumWrapper,
} from "../Style/GameStyles";
import { useGameContext } from "../Hook/GameContext";

export const GameRankPodium = () => {
  const { seasonRanking } = useGameContext();
  const imageUrl = "/image-web/game/";
  const tierUrl = imageUrl + "tier/";
  const rankImageUrl = imageUrl + "rank/";
  const frameImageUrls = [
    "",
    `${rankImageUrl}first_frame.png`,
    `${rankImageUrl}second_frame.png`,
    `${rankImageUrl}third_frame.png`,
  ];
  return (
    <GameRankPodiumWrapper>
      {[2, 1, 3].map((item) => (
        <div className="podium">
          <div className={"podium-" + item}>
            <div className="rank">{item}</div>
          </div>
          {seasonRanking?.topThree[item - 1] && (
            <div className="info-row">
              <div className="nick">
                <img
                  className="tier"
                  alt="티어"
                  src={`${tierUrl}${
                    seasonRanking.topThree[item - 1].tier || "BRONZE"
                  }.png`}
                ></img>
                {seasonRanking.topThree[item - 1].nickName}
              </div>
              <div className="point">
                {seasonRanking.topThree[item - 1].point}
                <span>RP</span>
              </div>
            </div>
          )}
          {seasonRanking?.topThree[item - 1] && (
            <div className="profile-row">
              <img
                className="frame"
                alt="순위"
                src={frameImageUrls[item]}
              ></img>
              <img
                className="profile"
                src={
                  seasonRanking.topThree[item - 1].profile ??
                  "/image-web/default_profile.png"
                }
                alt="프로필"
              ></img>
            </div>
          )}
        </div>
      ))}
    </GameRankPodiumWrapper>
  );
};
