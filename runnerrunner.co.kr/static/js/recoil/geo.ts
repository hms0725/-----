import {atom} from "recoil";
import {Area} from "../api/area";

export const geoCoordState = atom<GeolocationCoordinates>({
  key: 'geo/geoCoord',
  default: {
    latitude: 37.496486063,
    longitude: 127.028361548,
    accuracy: -1,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  }
});

export const citiesState = atom<{
  provinces: Area[],
  cities: Area[]
}>({
  key: 'geo/cities',
  default: {
    provinces: [],
    cities: []
  }
})