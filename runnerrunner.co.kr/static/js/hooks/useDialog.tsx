import { useRecoilState } from "recoil";
import { DialogProps, dialogState, DialogState } from "../recoil/dialog";
import { useCallback } from "react";
import { produce } from "immer";

let nextDialogId = 1;

function useDialog() {
  const [dialogs, setDialogs] = useRecoilState(dialogState);

  const handleClose = useCallback((dialogId: number) => {
    setDialogs(
      produce((d) => {
        const idx = d.findIndex((x) => x.id === dialogId);
        if (idx !== -1) {
          d[idx].visibility = false;
        }
      })
    );
  }, []);

  const handleOpen = useCallback(
    (props: DialogProps): number => {
      const id = nextDialogId++;
      const dialogProps: DialogState = {
        ...props,
        id: id,
        visibility: true,
      };

      dialogProps.onConfirm = () => {
        props.onConfirm && props.onConfirm(() => handleClose(id));
        if (!props.disableAutoClose) {
          handleClose(id);
        }
      };

      dialogProps.onCancel = () => {
        props.onCancel && props.onCancel();
        handleClose(id);
      };

      if (!props.disableBackdropClick) {
        dialogProps.onBackdropClick = () => {
          handleClose(id);
        };
      }

      setDialogs(
        produce((d) => {
          d.push(dialogProps);
        })
      );

      return id;
    },
    [dialogs, handleClose]
  );

  return {
    dialogs: dialogs,
    openDialog: handleOpen,
    closeDialog: handleClose,
  };
}

export default useDialog;
