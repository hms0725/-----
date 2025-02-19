import { useCallback, useEffect, useState } from "react";
import { Area, areaCities, areaProvinces } from "../api/area";
import { useRecoilState } from "recoil";
import { areaProvincesState } from "../recoil/search";
import { citiesState } from "../recoil/search";

function useCities() {
  const [provinces, setProvinces] = useRecoilState<Area[]>(areaProvincesState);
  const [cities, setCities] = useRecoilState<Area[]>(citiesState);

  useEffect(() => {
    Promise.all([areaProvinces(), areaCities()]).then(([provinces, cities]) => {
      setProvinces(provinces || []);
      setCities(cities || []);
    });
  }, []);

  const findClosestCity = useCallback(
    (lat1: number, lng1: number) => {
      let min = Number.MAX_VALUE;
      let closestCity = cities[0];

      for (let i = 0; i < cities.length; i++) {
        const lat2 = cities[i].centerLat;
        const lng2 = cities[i].centerLon;
        const distance = Math.sqrt(
          Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)
        );
        if (distance < min) {
          min = distance;
          closestCity = cities[i];
        }
      }

      return closestCity;
    },
    [cities]
  );

  const formatAddress = useCallback(
    (city: Area | undefined) => {
      if (city) {
        const province = provinces.find((x) => x.id === city.provinceId);
        if (province) {
          return `${province.name} ${city.name}`;
        }
      }
      return "로드 중...";
    },
    [provinces]
  );

  const getAddressByCoord = useCallback(
    (lat: number, lng: number) => {
      const closestCity = findClosestCity(lat, lng);
      return formatAddress(closestCity);
    },
    [findClosestCity, formatAddress]
  );

  return {
    provinces,
    cities,
    findClosestCity,
    getAddressByCoord,
  };
}

export default useCities;
