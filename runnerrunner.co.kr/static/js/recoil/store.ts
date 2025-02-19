import {atom} from "recoil";
import {Cafe} from "../api/types";

export interface NavigationTarget {
  lat: number
  lon: number
  cafeName?: string
  newAddress?: string
  detailAddress?: string
}

export const navigationTargetState = atom<NavigationTarget|undefined>({
  key: 'store/navigationTarget',
  default: undefined
})
