import React, { useEffect } from "react";
import { GameLayout } from "./GameLayout";
import { GameNavigator } from "./GameNavigator";
import { GameMain } from "./Main/GameMain";
import { GameHeader } from "./GameHeader";
import { useGameContext } from "./Hook/GameContext";
import { GamePage } from "./Hook/useGame";
import { GameLobby } from "./Lobby/GameLobby";
import { GameMyPage } from "./MyPage/GameMyPage";
import { GameRank } from "./Rank/GameRank";
import GameDialog from "./Component/Dialog";
import RankingDialog from "./Component/RankingDialog";
import { GameInfoDialog } from "./Component/GameInfoDialog";
import { AttendanceDialog } from "./Component/attendanceDialog";

const GameContent: React.FC = () => {
  const {
    gamePageState,
    dialogState,
    isRankingDialogOpen,
    gameInfoData,
    dailyAttendanceCheck,
    attendanceList,
    setAttendanceList,
  } = useGameContext();
  const attendanceCheck = async () => {
    const data = await dailyAttendanceCheck();
    if (data) setAttendanceList(data);
  };
  useEffect(() => {
    attendanceCheck();
  }, []);
  return (
    <>
      <GameLayout>
        {gamePageState === GamePage.MAIN && <GameMain></GameMain>}
        {gamePageState === GamePage.RANKING && <GameRank></GameRank>}
        {gamePageState === GamePage.MY_PAGE && <GameMyPage></GameMyPage>}
        {gamePageState === GamePage.GAME && <GameLobby></GameLobby>}
        <GameHeader></GameHeader>
        <GameNavigator></GameNavigator>
        {dialogState && <GameDialog data={dialogState} />}
        {isRankingDialogOpen && <RankingDialog />}
        {gameInfoData && <GameInfoDialog />}
        {attendanceList.length > 0 && <AttendanceDialog />}
      </GameLayout>
    </>
  );
};

export default GameContent;
