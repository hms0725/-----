import { useGameContext } from "./Hook/GameContext";
import { GameHeaderWrapper } from "./Style/GameStyles";
import "./index.scss";
export const GameHeader = () => {
  const imageUrl = "/image-web/game/";
  const tierUrl = imageUrl + "tier/";
  const { user, userTicketInfo, tier, openRankingDialog } = useGameContext();
  return (
    <GameHeaderWrapper className="fix-centered">
      <div className="tier-nick" onClick={() => openRankingDialog()}>
        <img alt="티어" src={`${tierUrl}${tier || "BRONZE"}.png`} />
        {user?.nickname}
      </div>
      <div className="game-point">
        <img alt="아이콘" src={`${imageUrl}ico_gp.svg`} />
        <span>{userTicketInfo?.user.point.toLocaleString()} GP</span>
      </div>
    </GameHeaderWrapper>
  );
};
