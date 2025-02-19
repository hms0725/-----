import { atom } from "recoil";

export const navigatorShadowState = atom<boolean>({
  key: "navigator/shadow",
  default: true,
});
