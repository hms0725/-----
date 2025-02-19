import { atom } from "recoil";

export const loadingState = atom<boolean>({
  key: "app/loading",
  default: false,
});

export const currentTimeState = atom<Date>({
  key: "app/currentTimeState",
  default: new Date(),
});
