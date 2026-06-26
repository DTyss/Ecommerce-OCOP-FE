import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMap, MarkerContext, useMarkerContext } from "./context";
import type { MarkerProps, MarkerContentProps, MarkerLabelProps } from "./types";
import { cn } from "@/utils/utils";
import MapLibreGL from "maplibre-gl";

export function Marker({
    longitude,
    latitude,
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
    draggable = false,
    ...markerOptions
}: MarkerProps) {
    const { map, isLoaded } = useMap();
    const markerRef = useRef<MapLibreGL.Marker | null>(null);
    const markerElementRef = useRef<HTMLDivElement | null>(null);
    const [isReady, setIsReady] = useState(false);
    const markerOptionsRef = useRef(markerOptions);

    useEffect(() => {
        if (!isLoaded || !map) return;

        const container = document.createElement("div");
        markerElementRef.current = container;

        const marker = new MapLibreGL.Marker({
            ...markerOptions,
            element: container,
            draggable
        })
            .setLngLat([longitude, latitude])
            .addTo(map);

        markerRef.current = marker;

        const handleClick = (e: MouseEvent) => onClick?.(e);
        const handleMouseEnter = (e: MouseEvent) => onMouseEnter?.(e);
        const handleMouseLeave = (e: MouseEvent) => onMouseLeave?.(e);

        container.addEventListener("click", handleClick);
        container.addEventListener("mouseenter", handleMouseEnter);
        container.addEventListener("mouseleave", handleMouseLeave);

        const handleDragStart = () => {
            const lngLat = marker.getLngLat();
            onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
        };
        const handleDrag = () => {
            const lngLat = marker.getLngLat();
            onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
        };
        const handleDragEnd = () => {
            const lngLat = marker.getLngLat();
            onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
        };

        marker.on("dragstart", handleDragStart);
        marker.on("drag", handleDrag);
        marker.on("dragend", handleDragEnd);

        setIsReady(true);

        return () => {
            container.removeEventListener("click", handleClick);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);

            marker.off("dragstart", handleDragStart);
            marker.off("drag", handleDrag);
            marker.off("dragend", handleDragEnd);

            marker.remove();
            markerRef.current = null;
            markerElementRef.current = null;
            setIsReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, isLoaded]);

    useEffect(() => {
        markerRef.current?.setLngLat([longitude, latitude]);
    }, [longitude, latitude]);

    useEffect(() => {
        markerRef.current?.setDraggable(draggable);
    }, [draggable]);

    useEffect(() => {
        if (!markerRef.current) return;
        const prev = markerOptionsRef.current;

        if (prev.offset !== markerOptions.offset) {
            markerRef.current.setOffset(markerOptions.offset ?? [0, 0]);
        }
        if (prev.rotation !== markerOptions.rotation) {
            markerRef.current.setRotation(markerOptions.rotation ?? 0);
        }
        if (prev.rotationAlignment !== markerOptions.rotationAlignment) {
            markerRef.current.setRotationAlignment(markerOptions.rotationAlignment ?? "auto");
        }
        if (prev.pitchAlignment !== markerOptions.pitchAlignment) {
            markerRef.current.setPitchAlignment(markerOptions.pitchAlignment ?? "auto");
        }

        markerOptionsRef.current = markerOptions;
    }, [markerOptions]);

    return (
        <MarkerContext.Provider value={{ markerRef, markerElementRef, map, isReady }}>
            {children}
        </MarkerContext.Provider>
    );
}

function DefaultMarkerIcon() {
    return <div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />;
}

export function MarkerContent({ children, className }: MarkerContentProps) {
    const { markerElementRef, isReady } = useMarkerContext();

    if (!isReady || !markerElementRef.current) return null;

    return createPortal(
        <div className={cn("relative cursor-pointer", className)}>{children ?? <DefaultMarkerIcon />}</div>,
        markerElementRef.current
    );
}

export function MarkerLabel({ children, className, position = "top" }: MarkerLabelProps) {
    const positionClasses = {
        top: "bottom-full mb-1",
        bottom: "top-full mt-1"
    };

    return (
        <div
            className={cn(
                "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
                "text-foreground text-[10px] font-medium",
                positionClasses[position],
                className
            )}
        >
            {children}
        </div>
    );
}
