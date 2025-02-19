import { MapInfoWrapper } from "../Style/SearchStyles";
import { useSearchContext } from "../Hook/SearchContext";
import { useRecoilValue } from "recoil";
import { geoCoordState } from "../../../../recoil/geo";
import { useEffect } from "react";
import { useStore } from "../Hook/StoreContext";

export const MapView = () => {
  const { updateMyLocation, mapCenter } = useSearchContext();
  const { setSelectedStore } = useStore();
  const { y: lat, x: lng } = mapCenter;
  const { latitude, longitude } = useRecoilValue(geoCoordState);

  return (
    <MapInfoWrapper>
      <div className="button-row">
        <div
          className={`${
            lat === latitude && lng === longitude
              ? "button current"
              : "button right"
          }`}
          onClick={updateMyLocation}
        >
          {lat === latitude && lng === longitude ? (
            <img
              src="/image-web/Icon/My%20Location%20White.svg"
              alt="My Location"
            />
          ) : (
            <img src="/image-web/Icon/My%20Location.svg" alt="My Location" />
          )}
        </div>
      </div>
    </MapInfoWrapper>
  );
};
