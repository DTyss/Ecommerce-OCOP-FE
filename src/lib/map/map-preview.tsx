import { useState, useEffect } from "react";
import { useMap } from "./context";
import { Controls } from "./controls";
import { Map } from "./map";
import { Marker, MarkerContent } from "./marker";
import { MarkerPopup } from "./popup";
import { Route } from "./route";
import { MapPin, X, User, Loader2, Store } from "lucide-react";
import type MapLibreGL from "maplibre-gl";

interface MapPreviewProps {
    latitude?: number;
    longitude?: number;
    address?: string;
    shopId?: string;
    shopLatitude?: number;
    shopLongitude?: number;
    shopAddress?: string;
    routeCoordinates?: [number, number][];
    hasOrderCoordinates?: boolean;
    onUpdateCoordinates?: (lng: number, lat: number) => void;
    isLoading?: boolean;
}

// Google Maps raster tile style
const GOOGLE_MAP_STYLE: MapLibreGL.StyleSpecification = {
    version: 8,
    sources: {
        "google-tiles": {
            type: "raster",
            tiles: [
                "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                "https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
                "https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            ],
            tileSize: 256,
            attribution: "© Google Maps"
        }
    },
    layers: [
        {
            id: "google-map",
            type: "raster",
            source: "google-tiles",
            minzoom: 0,
            maxzoom: 22
        }
    ]
};

function MapContent({
    latitude,
    longitude,
    address,
    shopLatitude,
    shopLongitude,
    shopAddress,
    routeCoordinates,
    hasOrderCoordinates,
    showPopup,
    setShowPopup,
    userLocation,
    handleLocate
}: {
    latitude: number;
    longitude: number;
    address: string;
    shopLatitude?: number;
    shopLongitude?: number;
    shopAddress?: string;
    routeCoordinates?: [number, number][];
    hasOrderCoordinates?: boolean;
    showPopup: boolean;
    setShowPopup: (value: boolean) => void;
    userLocation: { latitude: number; longitude: number } | null;
    setUserLocation: (value: { latitude: number; longitude: number } | null) => void;
    handleLocate: (coords: { longitude: number; latitude: number }) => void;
}) {
    const { map } = useMap();

    // Move camera to marker when coordinates change
    useEffect(() => {
        if (map) {
            // If no order coordinates, center on shop; otherwise center on order
            const centerLng = !hasOrderCoordinates && shopLongitude ? shopLongitude : longitude;
            const centerLat = !hasOrderCoordinates && shopLatitude ? shopLatitude : latitude;

            map.flyTo({
                center: [centerLng, centerLat],
                zoom: 15,
                duration: 1000
            });
        }
    }, [latitude, longitude, shopLatitude, shopLongitude, hasOrderCoordinates, map]);

    return (
        <>
            <Controls position="top-right" showLocate showZoom showCompass onLocate={handleLocate} />

            {/* Only show route when order coordinates exist */}
            {hasOrderCoordinates && (
                <>
                    {routeCoordinates && routeCoordinates.length > 1 ? (
                        <Route coordinates={routeCoordinates} color="#3b82f6" width={3} opacity={0.7} />
                    ) : (
                        shopLatitude &&
                        shopLongitude &&
                        latitude &&
                        longitude && (
                            <Route
                                coordinates={[
                                    [shopLongitude, shopLatitude],
                                    [longitude, latitude]
                                ]}
                                color="#3b82f6"
                                width={3}
                                opacity={0.7}
                            />
                        )
                    )}
                </>
            )}

            {/* Shop marker - always visible */}
            {shopLatitude && shopLongitude && (
                <Marker longitude={shopLongitude} latitude={shopLatitude}>
                    <MarkerContent>
                        <div className="relative flex items-center justify-center">
                            <div
                                className="rounded-full p-1.5 shadow-lg"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to bottom right, rgb(34, 197, 94), rgb(21, 128, 61))",
                                    boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.5)"
                                }}
                            >
                                <Store className="size-4 text-white" />
                            </div>
                        </div>
                    </MarkerContent>
                    <MarkerPopup>
                        <div className="font-medium">{shopAddress ?? "Cửa hàng"}</div>
                    </MarkerPopup>
                </Marker>
            )}

            {/* Order marker - only show when order coordinates exist */}
            {hasOrderCoordinates && (
                <Marker longitude={longitude} latitude={latitude} draggable={false}>
                    <MarkerContent>
                        <div className="relative flex items-center justify-center" onClick={() => setShowPopup(true)}>
                            <div className="absolute animate-pulse rounded-full opacity-30" />
                            <div
                                className="rounded-full p-1.5 shadow-lg"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to bottom right, rgb(59, 130, 246), rgb(29, 78, 216))",
                                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.5)"
                                }}
                            >
                                <MapPin className="size-4 text-white" />
                            </div>
                        </div>
                    </MarkerContent>
                    {showPopup && (
                        <MarkerPopup>
                            <div className="flex items-center justify-between gap-2">
                                <div className="font-medium">{address}</div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPopup(false);
                                    }}
                                    className="flex items-center justify-center rounded hover:bg-gray-100"
                                >
                                    <X className="absolute -top-2 -right-2 size-3" />
                                </button>
                            </div>
                        </MarkerPopup>
                    )}
                </Marker>
            )}

            {userLocation && (
                <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
                    <MarkerContent>
                        <div className="relative flex items-center justify-center">
                            <div
                                className="rounded-full bg-blue-500 p-2 shadow-lg"
                                style={{
                                    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.2)"
                                }}
                            >
                                <User className="size-3 text-white" />
                            </div>
                        </div>
                    </MarkerContent>
                </Marker>
            )}
        </>
    );
}

export function MapPreview({
    latitude = 10.7769,
    longitude = 106.6869,
    address = "Hồ Chí Minh",
    shopLatitude,
    shopLongitude,
    shopAddress,
    routeCoordinates,
    hasOrderCoordinates = false,
    isLoading = false
}: MapPreviewProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const handleLocate = (coords: { longitude: number; latitude: number }) => {
        setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
    };

    // Determine initial center: use shop if no order coordinates, otherwise use order
    const initialCenter: [number, number] =
        !hasOrderCoordinates && shopLongitude && shopLatitude ? [shopLongitude, shopLatitude] : [longitude, latitude];

    return (
        <div className="bg-card relative h-full w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium text-gray-600">Đang tải bản đồ...</p>
                    </div>
                </div>
            )}
            <Map center={initialCenter} zoom={100} style={GOOGLE_MAP_STYLE}>
                <MapContent
                    latitude={latitude}
                    longitude={longitude}
                    address={address}
                    {...(shopLatitude !== undefined && { shopLatitude })}
                    {...(shopLongitude !== undefined && { shopLongitude })}
                    {...(shopAddress && { shopAddress })}
                    {...(routeCoordinates && { routeCoordinates })}
                    {...(hasOrderCoordinates !== undefined && { hasOrderCoordinates })}
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    userLocation={userLocation}
                    setUserLocation={setUserLocation}
                    handleLocate={handleLocate}
                />
            </Map>
        </div>
    );
}
