import { atom } from "recoil";
import { CSSProperties } from "react";

export interface DialogProps {
  title?: string;
  text?: string;
  type?: string;
  phone?: string;
  confirm?: boolean;
  confirmColor?: string;
  onConfirm?: (closeFn?: () => void) => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  disableBackdropClick?: boolean;
  disableAutoClose?: boolean;
  nickname?: string;
  reverse?: boolean;
  style?: CSSProperties;
}

export interface DialogState extends DialogProps {
  id: number;
  visibility: boolean;
  onBackdropClick?: () => void;
}

export const dialogState = atom<DialogState[]>({
  key: "dialog/dialog",
  default: [],
});
