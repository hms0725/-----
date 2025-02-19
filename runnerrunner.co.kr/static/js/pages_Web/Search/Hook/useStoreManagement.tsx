// useStoreManagement.ts
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import { Area } from "../../../../api/area";
import { Cafe } from "../../../../api/types";
import { areaCafeList, searchAreaCafe } from "../../../../api/cafe";
import { LikeType } from "../../../../api/like";
import { allStoresState } from "../../../../recoil/search";
import { useUI } from "./UIContext";
import { useStore } from "./StoreContext";
const NaverMaps = (window as any).naver.maps;

interface StoreManagementProps {
  toggleLike: (id: number, type: LikeType) => Promise<boolean | undefined>;
  storeList: Cafe[];
  mapRef: any;
  setIsArea: (isArea: boolean) => void;
}

export const useStoreManagement = ({
  toggleLike,
  storeList,
  mapRef,
  setIsArea,
}: StoreManagementProps) => {
  const { setShowLocationFilter } = useUI();
  const setLoading = useSetRecoilState(loadingState);
  const setStoreList = useSetRecoilState(allStoresState);
  const storeContext = useStore();
  const handleLikeItem = useCallback(
    async (id: number, isList: boolean) => {
      setLoading(true);
      try {
        const liked = await toggleLike(id, "CAFE");
        if (typeof liked === "boolean") {
          if (isList) {
            setStoreList(
              storeList.map((item) =>
                item.id === id ? { ...item, like: liked } : item
              )
            );
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [setLoading, toggleLike, storeList, setStoreList]
  );

  const handleSelectCity = useCallback(
    async (province: Area, city: Area) => {
      setIsArea(true);
      console.log(province);
      const list = await areaCafeList(province.id, city.id);

      if (list.length > 0) {
        const firstCafe = list[0];
        if (mapRef.current) {
          mapRef.current.setCenter(
            new NaverMaps.LatLng(firstCafe.lat, firstCafe.lon)
          );
        }
        setStoreList(list);
      } else if (mapRef.current) {
        mapRef.current.setCenter(
          new NaverMaps.LatLng(city.centerLat, city.centerLon)
        );
      }

      setShowLocationFilter(false);
      storeContext.setCityText(`${province.name} ${city.name}`);
    },
    [mapRef, setStoreList, storeContext, setShowLocationFilter, setIsArea]
  );

  return {
    handleLikeItem,
    handleSelectCity,
  };
};
