import { atom, selector } from "recoil";
import { Cafe } from "../api/types";
import { isPremium, isVIP, isNormal } from "../utils/common";
import { Area } from "../api/area";

export const searchState = atom({
  key: "search",
  default: "",
});

export const allStoresState = atom<Cafe[]>({
  key: "allStores",
  default: [],
});

// 파생된 프리미엄/일반 스토어 리스트
export const premiumStoreListState = selector<Cafe[]>({
  key: "premiumStoreList",
  get: ({ get }) => {
    const stores = get(allStoresState);
    return stores.filter((store) => isPremium(store.pubType));
  },
});

export const vipStoreListState = selector<Cafe[]>({
  key: "vipStoreList",
  get: ({ get }) => {
    const stores = get(allStoresState);
    return stores.filter((store) => isVIP(store.pubType));
  },
});

export const regularStoreListState = selector<Cafe[]>({
  key: "regularStoreList",
  get: ({ get }) => {
    const stores = get(allStoresState);
    return stores.filter((store) => isNormal(store.pubType));
  },
});

export const citiesState = atom<Area[]>({
  key: "cities",
  default: [],
});

export const areaProvincesState = atom<Area[]>({
  key: "areaProvinces",
  default: [],
});
