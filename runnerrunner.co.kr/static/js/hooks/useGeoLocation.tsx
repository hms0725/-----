import { useCallback, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useRecoilState } from "recoil";
import { geoCoordState } from "../recoil/geo";
import useNativeApp, { isApp } from "./useNativeApp";

function useGeoLocation(noUpdate?: boolean) {
  const { sendMessageToNative } = useNativeApp();

  const [geoCoord, setGeoCoord] = useRecoilState(geoCoordState);

  const updateLocation = useCallback(() => {
    return new Promise<GeolocationCoordinates>((resolve, reject) => {
      if (isApp) {
        sendMessageToNative("initLatLon", "getLatLon", {})
          .then((res: any) => {
            const coord = {
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              latitude: res.lat,
              longitude: res.lon,
              speed: 0,
            };
            setGeoCoord(coord);
            resolve(coord);
          })
          .then(() => {
            return sendMessageToNative("finishLatLon", "", {});
          });
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (gp) => {
            if (gp.coords.latitude && gp.coords.longitude) {
              setGeoCoord(gp.coords);
              resolve(gp.coords);
            }
          },
          (e: any) => {
            enqueueSnackbar("현재 위치를 가져올 수 없습니다: " + e.message, {
              variant: "error",
            });
            resolve(geoCoord);
          }
        );
      } else {
        enqueueSnackbar("현재 위치를 가져올 수 없는 환경입니다.", {
          variant: "error",
        });
        resolve(geoCoord);
      }
    });
  }, [geoCoord]);

  useEffect(() => {
    if (!noUpdate && geoCoord.accuracy === -1) {
      updateLocation();
    }
  }, [geoCoord, noUpdate]);

  return {
    latitude: geoCoord.latitude,
    longitude: geoCoord.longitude,
    updateLocation,
  };
}

export default useGeoLocation;
