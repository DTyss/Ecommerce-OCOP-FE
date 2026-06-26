export interface VietMapRouteRequest {
    coordinates: [number, number];
    vietMapRefId: string;
    vehicle?: "motorcycle" | "car" | "truck";
}

export interface VietMapRouteInstruction {
    distance: number;
    heading: number;
    sign: number;
    interval: [number, number];
    text: string;
    time: number;
    street_name: string;
    last_heading: number | null;
}

export interface VietMapFullRouteData {
    distance: number;
    weight: number;
    time: number;
    transfers: number;
    points_encoded: boolean;
    bbox: [number, number, number, number];
    snapped_waypoints: {
        type: string;
        coordinates: [number, number][];
    };
    points: {
        type: string;
        coordinates: [number, number][];
    };
    instructions: VietMapRouteInstruction[];
    orderCoordinates: [number, number];
    address: string;
    ward: string;
    city: string;
}

export interface VietMapPlaceAndRouteResponse {
    id?: string;
    distance: number;
    orderCoordinates: [number, number];
    fullRouteData: VietMapFullRouteData;
}
