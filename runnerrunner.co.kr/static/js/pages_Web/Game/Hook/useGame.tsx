import { useHistory } from "react-router-dom";
import { useState } from "react";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../../utils/network";
import { useGameDialog } from "./dialogHook";
import { useUserData } from "./useUseData";
import { useTournamentData } from "./useTournamentData";
import { useGameActions } from "./useGameAction";
import { useRankingPoint } from "./useRankingPoint";
import { useRankingDialog } from "./useRankingDialog";
import { useGameInfoDialog } from "./useGameInfoDialog";
import { useAttendanceDialog } from "./useAttendanceDialog";

export enum GamePage {
  MAIN,
  RANKING,
  GAME,
  MY_PAGE,
}

export interface GameDialogProps {
  text?: string;
  buttonText?: string;
  onConfirm?: (closeFn?: () => void) => void;
  onCancel?: () => void;
}

export const useGame = () => {
  const history = useHistory();
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const [gamePageState, setGamePageState] = useState(GamePage.MAIN);
  const { user, setUser, refreshUser, userTicketInfo, getUserTicket } =
    useUserData();
  const tournamentData = useTournamentData(gamePageState);
  const rankingPointHook = useRankingPoint();
  const gameDialog = useGameDialog();
  const gameAction = useGameActions(
    user,
    userTicketInfo,
    accessToken,
    tournamentData.getDailyTournament
  );
  const rankingDialog = useRankingDialog();
  const gameInfoDialog = useGameInfoDialog();
  const attendanceDialog = useAttendanceDialog();

  return {
    history,
    //유저 정보
    user,
    setUser,
    refreshUser,
    userTicketInfo,
    getUserTicket,
    //랭킹
    ...rankingPointHook,
    //페이지 상태
    gamePageState,
    setGamePageState,
    //토너먼트 관련
    ...tournamentData,
    //다이얼로그 관련
    ...gameDialog,
    ...rankingDialog,
    ...gameInfoDialog,
    ...attendanceDialog,
    //게임 관련
    ...gameAction,
  };
};
