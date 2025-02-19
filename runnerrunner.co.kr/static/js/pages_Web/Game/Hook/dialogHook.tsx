import { useCallback, useState } from "react";
import { GameDialogProps } from "./useGame";

export const useGameDialog = () => {
  const [dialogState, setDialogState] = useState<GameDialogProps | null>(null);

  const handleClose = useCallback(() => {
    setDialogState(null);
  }, []);

  const handleOpen = useCallback((props: GameDialogProps) => {
    const dialogProps: GameDialogProps = {
      ...props,
      onConfirm: () => {
        props.onConfirm && props.onConfirm();
        handleClose();
      },
    };
    setDialogState(dialogProps);
  }, []);

  return {
    openDialog: handleOpen,
    closeDialog: handleClose,
    dialogState,
  };
};
