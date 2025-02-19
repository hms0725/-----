import {atom} from "recoil";
import {UserInfo} from "../api/auth";

export const userState = atom<UserInfo | undefined>({
  key: 'auth/user',
  default: undefined
});
