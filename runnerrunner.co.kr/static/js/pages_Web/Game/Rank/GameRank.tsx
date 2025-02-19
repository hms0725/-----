import { useGameContext } from "../Hook/GameContext";
import { GameRankWrapper } from "../Style/GameStyles";

import { GameRankBanner } from "./GameRankBanner";
import { GameRankList } from "./GameRankList";
import { GameRankPodium } from "./GameRankPodium";
export const GameRank = () => {
  const { openRankingDialog } = useGameContext();
  return (
    <GameRankWrapper>
      <GameRankBanner></GameRankBanner>
      <div className="rank-wrapper">
        <div
          className="info"
          onClick={() => {
            openRankingDialog();
          }}
        >
          랭킹 안내
        </div>
        <GameRankPodium></GameRankPodium>
        <GameRankList></GameRankList>
      </div>
    </GameRankWrapper>
  );
};
