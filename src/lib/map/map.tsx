import { useEffect, useRef, useState } from "react";
import { MapContext } from "./context";
import type { MapProps } from "./types";
import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const DefaultLoader = () => (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex gap-1">
            <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" />
            <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
            <span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
        </div>
    </div>
);

/**
 * Map is a simple wrapper around MapLibre GL Map.
 * It provides a React context for child components like Marker, Popup, etc.
 */
export function Map({ children, style, center, zoom = 50, onReady, ...props }: MapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreGL.Map | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        const mapInstance = new MapLibreGL.Map({
            container: containerRef.current,
            renderWorldCopies: false,
            attributionControl: {
                compact: true
            },
            ...(style && { style }),
            ...(center && { center }),
            ...(zoom !== undefined && { zoom }),
            ...props
        });

        const loadHandler = () => {
            setIsLoaded(true);
            onReady?.(mapInstance);
        };

        mapInstance.on("load", loadHandler);
        mapRef.current = mapInstance;

        return () => {
            mapInstance.off("load", loadHandler);
            mapInstance.remove();
            mapRef.current = null;
            setIsLoaded(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    return (
        <MapContext.Provider
            value={{
                map: mapRef.current,
                isLoaded: isMounted && isLoaded
            }}
        >
            <div ref={containerRef} className="relative h-full min-h-[400px] w-full">
                {!isLoaded && <DefaultLoader />}
                {isMounted && children}
            </div>
        </MapContext.Provider>
    );
}
