import { useGameContext } from "../Hook/GameContext";
import { GamePage } from "../Hook/useGame";
import { GameTab } from "../Hook/useGameAction";
import { GameCategoryWrapper } from "../Style/GameStyles";

export const GameCategory = () => {
  const { setGamePageState, setGameTab } = useGameContext();
  return (
    <GameCategoryWrapper>
      <div
        className="item"
        onClick={() => {
          setGamePageState(GamePage.GAME);
          setGameTab(GameTab.TOURNAMENT);
        }}
      >
        <div className="icon">
          <div className="background">
            <img
              src="/image-web/game/category/tournament.png"
              style={{ width: "40px" }}
            />
          </div>
        </div>
        <div className="title">TOURNAMENT</div>
      </div>
      <div
        className="item"
        onClick={() => {
          setGamePageState(GamePage.GAME);
          setGameTab(GameTab.HOLDEM);
        }}
      >
        <div className="icon">
          <div className="background">
            <img
              src="/image-web/game/category/holdem.png"
              style={{ width: "50px" }}
            />
          </div>
        </div>
        <div className="title">HOLDEM</div>
      </div>
    </GameCategoryWrapper>
  );
};
