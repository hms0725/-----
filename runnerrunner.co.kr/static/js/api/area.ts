import instance from "../utils/network";

export interface Area {
  id: number;
  code: number;
  name: string;
  centerLat: number;
  centerLon: number;
  provinceId?: number;
  cityId?: number;
  cafeCount?: number;
}

export function areaProvinces(): Promise<Area[]> {
  return instance.get("/nest/area/provinces");
}

export function areaCities(params?: { id: number }): Promise<Area[]> {
  return instance.get("/nest/area/cities", { params });
}

export function areaStreets(params: { id?: number }): Promise<Area[]> {
  return instance.get("/nest/area/streets", { params });
}

export function areaCitiesWithCafeCount(params: {
  id: number;
}): Promise<Area[]> {
  return instance.get("/area/citiesWithCafeCount", { params });
}
