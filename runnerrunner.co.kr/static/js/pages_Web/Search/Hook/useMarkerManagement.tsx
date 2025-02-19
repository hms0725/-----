import { useState, useEffect, useCallback, useRef } from "react";
import { renderToString } from "react-dom/server";
import { calculateTimes } from "../../../../utils/timer";
import StoreMarker from "../../../../components/StoreMarker";
import { Cafe } from "../../../../api/types";
import { makeMarkerClustering } from "../../../../utils/MarkerClustering";

const NaverMaps = (window as any).naver.maps;

export const useMarkerManagement = (
  mapRef: any,
  storeList: Cafe[],
  premiumList: Cafe[],
  vipStoreList: Cafe[],
  setShowMoreOption: (show: boolean) => void
) => {
  const markerListRef = useRef<any[]>([]);
  const clustererRef = useRef<any>(null);
  const [hoverStoreId, setHoverStoreId] = useState<number>(-1);
  const [selectedStoreId, setSelectedStoreId] = useState<number>(-1);

  // 마커 컨텐츠 생성 함수
  const createMarkerContent = useCallback(
    (store: Cafe, isSelected: boolean) => {
      const tournament = store.pubTournamentList?.find(
        (pubTournament) => pubTournament.timerDto
      );
      console.log(store);
      const time = tournament
        ? calculateTimes(tournament.timerDto!, tournament.structure)
        : undefined;

      return renderToString(
        <StoreMarker
          selected={isSelected}
          pubType={store.pubType}
          buyInFrom={store.buyIn}
          buyInTo={store.buyInMax}
          name={store.cafeName}
          timer={time ? time : undefined}
        />
      );
    },
    []
  );

  // 마커 생성/업데이트 함수
  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const stores = [...storeList, ...premiumList, ...vipStoreList];
    const existingMarkers = new Map(
      markerListRef.current.map((marker) => [marker.getTitle(), marker])
    );
    const newMarkers: any[] = [];

    stores.forEach((store) => {
      const isSelected =
        selectedStoreId === store.id || hoverStoreId === store.id;
      const existingMarker = existingMarkers.get(store.cafeName);

      if (existingMarker) {
        // 기존 마커 재사용
        existingMarker.setPosition(new NaverMaps.LatLng(store.lat, store.lon));
        existingMarker.setIcon({
          content: createMarkerContent(store, isSelected),
          anchor: new NaverMaps.Point(0, 30),
        });
        existingMarkers.delete(store.cafeName); // 사용된 마커 제거
        newMarkers.push(existingMarker);
      } else {
        // 새 마커만 생성
        const marker = new NaverMaps.Marker({
          position: new NaverMaps.LatLng(store.lat, store.lon),
          map: null, // 처음에는 map에 추가하지 않음
          title: store.cafeName,
          icon: {
            content: createMarkerContent(store, isSelected),
            anchor: new NaverMaps.Point(0, 30),
          },
          zIndex: isSelected ? 1 : undefined,
        });

        // 이벤트 리스너 추가
        NaverMaps.Event.addListener(marker, "click", () => {
          setSelectedStoreId(store.id);
          setShowMoreOption(true);
        });

        NaverMaps.Event.addListener(marker, "mouseover", () => {
          setHoverStoreId(store.id);
        });

        NaverMaps.Event.addListener(marker, "mouseout", () => {
          setHoverStoreId(-1);
        });

        newMarkers.push(marker);
      }
    });

    // 사용되지 않은 마커 제거
    existingMarkers.forEach((marker) => {
      NaverMaps.Event.clearListeners(marker);
      marker.setMap(null);
    });

    // 클러스터러 업데이트 최적화
    if (clustererRef.current) {
      clustererRef.current.setMap(null);
    }
    const MarkerClustering = makeMarkerClustering(window.naver);
    clustererRef.current = new MarkerClustering({
      minClusterSize: 1,
      maxZoom: 13,
      disableClickZoom: false,
      map: mapRef.current,
      markers: newMarkers,
      gridSize: 130,
      icons: [
        {
          content:
            '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-1.png);background-size:contain;"></div>',
          size: new NaverMaps.Size(40, 40),
          anchor: new NaverMaps.Point(20, 20),
        },
        {
          content:
            '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-2.png);background-size:contain;"></div>',
          size: new NaverMaps.Size(40, 40),
          anchor: new NaverMaps.Point(20, 20),
        },
        {
          content:
            '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-3.png);background-size:contain;"></div>',
          size: new NaverMaps.Size(40, 40),
          anchor: new NaverMaps.Point(20, 20),
        },
        {
          content:
            '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-4.png);background-size:contain;"></div>',
          size: new NaverMaps.Size(40, 40),
          anchor: new NaverMaps.Point(20, 20),
        },
        {
          content:
            '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-5.png);background-size:contain;"></div>',
          size: new NaverMaps.Size(40, 40),
          anchor: new NaverMaps.Point(20, 20),
        },
      ],
      indexGenerator: [10, 100, 200, 500, 1000],
      stylingFunction: (clusterMarker: any, count: number) => {
        clusterMarker.getElement().querySelector("div:first-child").innerText =
          count;
      },
    });
    markerListRef.current = newMarkers;
  }, [
    storeList,
    premiumList,
    selectedStoreId,
    hoverStoreId,
    createMarkerContent,
    mapRef.current,
  ]);

  // 마커 업데이트 효과
  useEffect(() => {
    updateMarkers();

    return () => {
      // cleanup
      if (clustererRef.current) {
        clustererRef.current.setMap(null);
      }
      markerListRef.current.forEach((marker) => {
        NaverMaps.Event.clearListeners(marker);
        marker.setMap(null);
      });
      markerListRef.current = [];
    };
  }, [updateMarkers]);

  return {
    hoverStoreId,
    setHoverStoreId,
    selectedStoreId,
    setSelectedStoreId,
  };
};
