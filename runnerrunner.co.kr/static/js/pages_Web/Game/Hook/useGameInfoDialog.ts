import { useState } from "react";
import { TournamentInfoInterface } from "../../../../api/game";

export const useGameInfoDialog = () => {
  const [data, setData] = useState<TournamentInfoInterface | null>(null);

  const openGameInfoDialog = (data?: TournamentInfoInterface) => {
    if (data) setData(data);
  };

  const closeGameInfoDialog = () => {
    setData(null);
  };

  return {
    gameInfoData: data,
    openGameInfoDialog,
    closeGameInfoDialog,
  };
};
