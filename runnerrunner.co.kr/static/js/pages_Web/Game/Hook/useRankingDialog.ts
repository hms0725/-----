import { useState } from "react";

export const useRankingDialog = () => {
  const [open, setOpen] = useState(false);

  const openRankingDialog = () => {
    setOpen(true);
  };

  const closeRankingDialog = () => {
    setOpen(false);
  };

  return {
    isRankingDialogOpen: open,
    openRankingDialog,
    closeRankingDialog,
  };
};
