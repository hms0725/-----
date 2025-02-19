import { useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import { GameInfoDialogWrapper } from "../Style/GameInfoDialogStyles";
import { Prize } from "./RankingDialog/Prize";
import { Blind } from "./RankingDialog/Blind";
import { Players } from "./RankingDialog/players";

export const GameInfoDialog = () => {
  const { gameInfoData, closeGameInfoDialog } = useGameContext();
  const [tab, setTab] = useState("prize");

  return (
    <GameInfoDialogWrapper>
      <div className="content">
        <div className="wrapper">
          <div className="header">
            <div className="title">게임 정보</div>
            <img
              src="/image-web/game/popup/cancel.svg"
              onClick={() => closeGameInfoDialog()}
            />
          </div>
          <div className="tab-wrapper">
            <div
              className={`tab ${tab === "prize" && "selected"}`}
              onClick={() => setTab("prize")}
            >
              PRIZE POOL
            </div>
            <div
              className={`tab ${tab === "blind" && "selected"}`}
              onClick={() => setTab("blind")}
            >
              BLIND
            </div>
            <div
              className={`tab ${tab === "players" && "selected"}`}
              onClick={() => setTab("players")}
            >
              PLAYERS
            </div>
          </div>
          {tab === "prize" && <Prize data={gameInfoData?.info.data.prize} />}
          {tab === "blind" && (
            <Blind
              data={gameInfoData?.info.data.blindStructure}
              rest={gameInfoData?.info.data.timeStructure.playTimeSeconds}
              restTime={gameInfoData?.info.data.timeStructure.restTimeSeconds}
            />
          )}

          {tab === "players" && (
            <Players groupId={gameInfoData?.info.groupId} />
          )}
        </div>
      </div>
    </GameInfoDialogWrapper>
  );
};
