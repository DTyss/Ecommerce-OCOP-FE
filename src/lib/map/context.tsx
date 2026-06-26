import { createContext, useContext } from "react";
import type { MapContextValue, MarkerContextValue } from "./types";

export const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("Map child components must be used within a <Map /> parent");
    }
    return context;
}

export const MarkerContext = createContext<MarkerContextValue | null>(null);

export function useMarkerContext() {
    const context = useContext(MarkerContext);
    if (!context) {
        throw new Error("Marker components must be used within <Marker />");
    }
    return context;
}
