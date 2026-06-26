import type { VietMapRouteRequest, VietMapPlaceAndRouteResponse } from "./types";
import { api } from "@/config/api";

export const getVietMapPlaceAndRoute = async ({
    coordinates,
    vietMapRefId,
    vehicle = "motorcycle"
}: VietMapRouteRequest): Promise<VietMapPlaceAndRouteResponse> => {
    const url = `/onexmaps/place-and-route?coordinates=${coordinates[0]}&coordinates=${coordinates[1]}&vietMapRefId=${encodeURIComponent(vietMapRefId)}&vehicle=${vehicle}`;
    const response = await api.get<VietMapPlaceAndRouteResponse>(url);
    return response.data;
};

export interface ReverseAndRouteRequest {
    lat: number;
    lng: number;
    shopId: string;
    displayType?: number;
    vehicle?: "motorcycle" | "car" | "truck";
}

export const getReverseAndRoute = async ({
    lat,
    lng,
    shopId,
    displayType = 1,
    vehicle = "motorcycle"
}: ReverseAndRouteRequest): Promise<VietMapPlaceAndRouteResponse> => {
    const url = `/vietmap/reverse-and-route?lat=${lat}&lng=${lng}&shopId=${shopId}&display_type=${displayType}&vehicle=${vehicle}`;
    const response = await api.get<VietMapPlaceAndRouteResponse>(url);
    return response.data;
};
