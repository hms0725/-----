import { useGameContext } from "../Hook/GameContext";
import { GameTab } from "../Hook/useGameAction";
import { GameLobbyWrapper } from "../Style/GameStyles";
import { GameLobbyBanner } from "./GameLobbyBanner";
import { GameLobbyHoldem } from "./GameLobbyHoldem";
import { GameLobbyTab } from "./GameLobbyTab";
import { GameLobbyTournament } from "./GameLobbyTournament";

export const GameLobby = () => {
  const { isGameTab } = useGameContext();
  return (
    <GameLobbyWrapper>
      <GameLobbyBanner></GameLobbyBanner>
      <GameLobbyTab></GameLobbyTab>
      {isGameTab(GameTab.TOURNAMENT) && (
        <GameLobbyTournament></GameLobbyTournament>
      )}
      {isGameTab(GameTab.HOLDEM) && <GameLobbyHoldem></GameLobbyHoldem>}
    </GameLobbyWrapper>
  );
};
