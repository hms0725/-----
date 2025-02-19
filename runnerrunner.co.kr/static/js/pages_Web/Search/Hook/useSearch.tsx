import { useState, useCallback, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { geoCoordState } from "../../../../recoil/geo";
import { currentTimeState } from "../../../../recoil/app";
import { navigationTargetState } from "../../../../recoil/store";
import { navigatorShadowState } from "../../../../recoil/navigator";
import { usePubSearch } from "./usePubSearch";
import { useMapManagement } from "./useMapManagement";
import { useMarkerManagement } from "./useMarkerManagement";
import { useStoreManagement } from "./useStoreManagement";
import useGeoLocation from "../../../../hooks/useGeoLocation";
import useCities from "../../../../hooks/useCities";
import useQuickButtons from "../../../../hooks/useQuickButtons";
import useDialog from "../../../../hooks/useDialog";
import usePubSearchFilter from "../../../../hooks/usePubSearchFilter";
import useQueryParams from "../../../../hooks/useQueryParams";
import { Cafe } from "../../../../api/types";
import { useUI } from "./UIContext";
import { useStore } from "./StoreContext";
const NaverMaps = (window as any).naver.maps;

export const useSearch = () => {
  const history = useHistory();
  const currentTime = useRecoilValue(currentTimeState);
  const location = useLocation<{ mode?: "query" | "area" | "premium" }>();
  const ui = useUI();

  const storeContext = useStore();
  const [isArea, setIsArea] = useState(false);
  const { latitude, longitude } = useRecoilValue(geoCoordState);
  // Recoil 상태들
  const setNavigatorShadow = useSetRecoilState(navigatorShadowState);
  const setNavigationTarget = useSetRecoilState(navigationTargetState);

  const query = useQueryParams();
  const { updateLocation } = useGeoLocation();
  const { provinces, cities, getAddressByCoord } = useCities();
  const { openPhoneCall, toggleLike, shareLink } = useQuickButtons();
  const { openDialog } = useDialog();
  const pubSearchFilter = usePubSearchFilter();
  const { filter, setFilter } = pubSearchFilter;
  const pubSearch = usePubSearch();
  const { handleSearch, storeList, premiumList, vipList } = pubSearch;

  // selectedStore 업데이트를 위한 ref
  const previousStoreIdRef = useRef<number | null>(null);
  const processedModeRef = useRef<string | null>(null);
  // Map 관리 hook
  const { mapRef, mapCenter } = useMapManagement({
    query,
    handleSearch,
    filter,
    history,
    location,
    isArea,
    setIsArea,
    getAddressByCoord,
    currentTime,
  });

  // Marker 관리 hook
  const { selectedStoreId } = useMarkerManagement(
    mapRef,
    storeList,
    premiumList,
    vipList,
    ui.setShowMoreOption
  );

  // Store 관리 hook
  const { handleLikeItem, handleSelectCity } = useStoreManagement({
    toggleLike,
    storeList,
    mapRef,
    setIsArea,
  });

  // 리스트 토글

  const handleClickResult = useCallback((cafe: Cafe) => {
    ui.setShowStoreList(false);
    setNavigatorShadow(false);
    if (mapRef.current) {
      mapRef.current.setCenter(new NaverMaps.LatLng(cafe.lat, cafe.lon));
    }
    storeContext.setSelectedStore(cafe);
    ui.setShowFilter(false);
  }, []);

  // selectedStore 업데이트 로직 개선
  useEffect(() => {
    if (selectedStoreId !== previousStoreIdRef.current) {
      previousStoreIdRef.current = selectedStoreId;

      const store =
        premiumList.find((item) => item?.id === selectedStoreId) ||
        storeList.find((item) => item?.id === selectedStoreId);

      if (store) {
        storeContext.setSelectedStore(store);
      }
    }
  }, [selectedStoreId, premiumList, storeList]);

  useEffect(() => {
    if (
      !location.state?.mode ||
      processedModeRef.current === location.state.mode
    ) {
      return;
    }

    const { mode, ...restState } = location.state;
    processedModeRef.current = mode;

    // 먼저 state를 정리
    history.replace({
      pathname: location.pathname,
      search: location.search,
      state: restState,
    });

    // 그 다음 mode에 따른 동작 수행
    switch (mode) {
      case "query":
        ui.setShowSearch(true);
        break;
      case "area":
        query.set("view", "list");
        ui.setShowLocationFilter(true);
        break;
      case "premium":
        ui.toggleShowList();
        setFilter((prev) => ({
          ...prev,
          pubTypes: ["PREMIUM", "VIP", "FRANCHISE"],
        }));
        break;
    }
  }, [history, location, query, setFilter, ui]);

  // 내 위치 업데이트
  const updateMyLocation = useCallback(async () => {
    const result = await updateLocation();
    if (mapRef.current) {
      mapRef.current.setCenter(
        new NaverMaps.LatLng(result.latitude, result.longitude)
      );
    }
  }, [updateLocation]);

  const handleMoreOption = useCallback((cafe: Cafe) => {
    storeContext.setSelectedStore(cafe);
    ui.setShowMoreOption(true);
  }, []);

  // 초기 위치 설정 및 iOS 위치 권한 체크
  useEffect(() => {
    updateMyLocation();
    if (latitude === 37.493743896484375 && longitude === 127.0637597) {
      openDialog({
        title: "정확한 위치(ios)",
        type: "web",
        text: "더욱 정확한 위치 정보를 얻기 위해<br>아래와 같이 설정하세요.<br><br>설정 -> 러너러너 -> 위치 -> 정확한 위치 허용",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        },
      });
    }
  }, []);

  return {
    ...pubSearchFilter,
    ...pubSearch,
    currentTime,
    history,
    provinces,
    cities,
    handleSelectCity,
    handleClickResult,
    handleLikeItem,
    updateMyLocation,
    openPhoneCall,
    shareLink,
    setNavigationTarget,
    handleMoreOption,
    mapCenter,
  };
};
