// useMapManagement.ts
import { useRef, useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { getDistanceKm } from "../../../../utils/common";
import { useStore } from "./StoreContext";
import { useRecoilValue } from "recoil";
import { geoCoordState } from "../../../../recoil/geo";

const NaverMaps = (window as any).naver.maps;

interface MapManagementProps {
  query: any;
  handleSearch: (params: any) => Promise<void>;
  filter: any;
  history: any;
  location: any;
  isArea: boolean;
  setIsArea: (isArea: boolean) => void;
  getAddressByCoord: (lat: number, lng: number) => string;
  currentTime: Date;
}

export const useMapManagement = ({
  query,
  handleSearch,
  filter,
  history,
  location,
  isArea,
  setIsArea,
  getAddressByCoord,
}: MapManagementProps) => {
  const mapRef = useRef<any>();
  const { latitude, longitude } = useRecoilValue(geoCoordState);
  const centerRef = useRef<any>(); // center 상태를 ref로 관리
  const [mapCenter, setMapCenter] = useState<any>();
  const storeContext = useStore();

  // 지도 초기화
  useEffect(() => {
    const mapDiv = document.getElementById("map") as HTMLDivElement;
    if (!mapDiv) return;
    if (!query) return;
    let center;
    const qLat = query.get("lat");
    const qLng = query.get("lng");
    if (qLat && qLng) {
      center = new NaverMaps.LatLng(Number(qLat), Number(qLng));
    } else {
      center = new NaverMaps.LatLng(latitude, longitude);
    }
    centerRef.current = center;

    const naverMap = new NaverMaps.Map(mapDiv, {
      tileSpare: 5, // 타일 여유분 증가
      center: center,
      async: true, // 비동기 로딩 활성화
    });

    const qZoom = query.get("z");
    if (qZoom) {
      naverMap.setZoom(Number(qZoom), false); // 애니메이션 비활성화
    } else {
      naverMap.setZoom(13, false); // 애니메이션 비활성화
    }

    const boundsChangedListener = NaverMaps.Event.addListener(
      naverMap,
      "bounds_changed",
      debounce(() => {
        const newCenter = naverMap.getCenter();
        if (
          !centerRef.current ||
          Math.abs(centerRef.current.x - newCenter.x) > 0.0000001 ||
          Math.abs(centerRef.current.y - newCenter.y) > 0.0000001
        ) {
          centerRef.current = newCenter;
          setMapCenter(newCenter);
        }
      }, 500) // 디바운스 시간 증가
    );

    mapRef.current = naverMap;
    setMapCenter(center);

    return () => {
      NaverMaps.Event.removeListener(boundsChangedListener);
      if (naverMap) {
        naverMap.destroy();
      }
    };
  }, []);

  // 디바운스된 검색 함수
  const debouncedSearchWithMap = useMemo(
    () =>
      debounce(async (params: any) => {
        try {
          await handleSearch(params);
        } catch (e) {
          console.error("Error in map search:", e);
        }
      }, 100), // 디바운스 시간 증가
    [handleSearch] // currentTime 의존성 제거
  );

  // 지도 이동시 검색 (기존 코드와 동일)
  useEffect(() => {
    if (!mapCenter || !mapRef.current) return;
    if (isArea) {
      setIsArea(false);
      return;
    }

    const { y: lat, x: lng } = mapCenter;

    // URL 업데이트 최적화
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("lat", lat.toFixed(8));
    searchParams.set("lng", lng.toFixed(8));
    searchParams.set("z", String(mapRef.current.getZoom()));
    searchParams.set("filter", JSON.stringify(filter));

    if (searchParams.toString() !== query.toString()) {
      history.replace({
        search: searchParams.toString(),
        state: location.state,
      });
    }

    storeContext.setCityText(getAddressByCoord(lat, lng));

    const mapBounds = mapRef.current.getBounds();
    const km = Number(
      getDistanceKm(
        mapBounds._min.y,
        mapBounds._min.x,
        mapBounds._max.y,
        mapBounds._max.x
      )
    );

    const searchFilter = { ...filter };
    if (searchFilter.buyInFrom) searchFilter.buyInFrom *= 10000;
    if (searchFilter.buyInTo) searchFilter.buyInTo *= 10000;

    debouncedSearchWithMap({
      ...searchFilter,
      lat,
      lon: lng,
      km,
    });
  }, [mapCenter, filter]);

  useEffect(() => {
    return () => {
      debouncedSearchWithMap.cancel();
    };
  }, [debouncedSearchWithMap]);

  return {
    mapRef,
    mapCenter,
  };
};
