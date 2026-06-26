import type { ReactNode } from "react";
import type MapLibreGL from "maplibre-gl";
import type { MarkerOptions, PopupOptions } from "maplibre-gl";

export type MapStyleOption = string | MapLibreGL.StyleSpecification;

export type MapInstance = MapLibreGL.Map;

export type MapProps = {
    children?: ReactNode;
    /** Map style - URL or StyleSpecification object */
    style?: string | MapLibreGL.StyleSpecification;
    /** Center coordinates [longitude, latitude] */
    center?: [number, number];
    /** Initial zoom level */
    zoom?: number;
    /** Callback when map is ready */
    onReady?: (map: MapLibreGL.Map) => void;
} & Omit<MapLibreGL.MapOptions, "container" | "style" | "center" | "zoom">;

export type MapContextValue = {
    map: MapLibreGL.Map | null;
    isLoaded: boolean;
};

export type MarkerContextValue = {
    markerRef: React.RefObject<MapLibreGL.Marker | null>;
    markerElementRef: React.RefObject<HTMLDivElement | null>;
    map: MapLibreGL.Map | null;
    isReady: boolean;
};

export type MarkerProps = {
    longitude: number;
    latitude: number;
    children: ReactNode;
    onClick?: (e: MouseEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onDragStart?: (lngLat: { lng: number; lat: number }) => void;
    onDrag?: (lngLat: { lng: number; lat: number }) => void;
    onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

export type MarkerContentProps = {
    children?: ReactNode;
    className?: string;
};

export type MarkerPopupProps = {
    children: ReactNode;
    className?: string;
    closeButton?: boolean;
} & Omit<PopupOptions, "className">;

export type MarkerTooltipProps = {
    children: ReactNode;
    className?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

export type MarkerLabelProps = {
    children: ReactNode;
    className?: string;
    position?: "top" | "bottom";
};

export type ControlsProps = {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    showZoom?: boolean;
    showCompass?: boolean;
    showLocate?: boolean;
    showFullscreen?: boolean;
    className?: string;
    onLocate?: (coords: { longitude: number; latitude: number }) => void;
};

export type PopupProps = {
    longitude: number;
    latitude: number;
    onClose?: () => void;
    children: ReactNode;
    className?: string;
    closeButton?: boolean;
} & Omit<PopupOptions, "className">;

export type RouteProps = {
    coordinates: [number, number][];
    color?: string;
    width?: number;
    opacity?: number;
    dashArray?: [number, number];
};

export type ClusterProps = {
    /** GeoJSON data containing point features */
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    /** Max zoom to cluster points on */
    clusterMaxZoom?: number;
    /** Radius of each cluster when clustering points (defaults to 50) */
    clusterRadius?: number;
    /** Color of the cluster circles */
    color?: string;
    /** Color of the point circles (unclustered) */
    pointColor?: string;
    /** Array of [threshold, color] pairs for cluster coloring based on point count */
    clusterColors?: [number, string][];
    /** Whether to zoom into a cluster when clicked */
    zoomOnClick?: boolean;
    /** Whether to show a popup when an unclustered point is clicked */
    showPopup?: boolean;
    /** Custom renderer for the popup content. Receives feature properties. */
    popupContent?: (properties: Record<string, unknown>) => ReactNode;
    /** URL or ID of a custom icon for unclustered points. If provided, points will use symbols instead of circles. */
    markerIcon?: string;
};

export type WMSProps = {
    /** The base URL of the WMS service */
    url: string;
    /** WMS layers to display (comma-separated) */
    layers: string;
    /** WMS version (defaults to 1.1.1) */
    version?: string;
    /** Tile format (defaults to image/png) */
    format?: string;
    /** Transparent background (defaults to true) */
    transparent?: boolean;
    /** Opacity of the layer (0-1) */
    opacity?: number;
    /** Minimum zoom level */
    minzoom?: number;
    /** Maximum zoom level */
    maxzoom?: number;
    /** Attribution text */
    attribution?: string;
    /** Whether to show a popup when clicked */
    showPopup?: boolean;
    /** Custom renderer for the popup content. Receives feature properties. */
    popupContent?: (properties: Record<string, unknown>) => ReactNode;
    /** Format for GetFeatureInfo requests (defaults to application/json) */
    infoFormat?: string;
    /** The ID of the overlay layer (for toggling visibility via Context) */
    overlayId?: string;
    /** WMS style name to apply */
    styles?: string;
};

export type MeasureProps = {
    /** Unit system to use */
    units?: "metric" | "imperial";
    /** Fixed unit for length measurements */
    fixedLengthUnit?: "mm" | "cm" | "m" | "km" | "in" | "ft" | "yd" | "mi";
    /** Fixed unit for area measurements */
    fixedAreaUnit?: "mm2" | "cm2" | "m2" | "km2" | "ha" | "in2" | "ft2" | "yd2" | "ac" | "mi2";
    /** Minimum number of decimal places to display */
    minimumFractionDigits?: number;
    /** Maximum number of decimal places to display */
    maximumFractionDigits?: number;
    /** Separator for number grouping */
    unitsGroupingSeparator?: string;
    /** Show only total line length instead of each segment length */
    showOnlyTotalLineLength?: boolean;
    /** Position of the measurement control buttons */
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    /** Custom localization for button titles */
    lang?: {
        areaMeasurementButtonTitle?: string;
        lengthMeasurementButtonTitle?: string;
        clearMeasurementsButtonTitle?: string;
    };
    /** Custom styling options */
    style?: {
        text?: {
            radialOffset?: number;
            letterSpacing?: number;
            color?: string;
            haloColor?: string;
            haloWidth?: number;
            font?: string;
        };
        common?: {
            midPointRadius?: number;
            midPointColor?: string;
            midPointHaloRadius?: number;
            midPointHaloColor?: string;
        };
        areaMeasurement?: {
            fillColor?: string;
            fillOutlineColor?: string;
            fillOpacity?: number;
            lineWidth?: number;
        };
        lengthMeasurement?: {
            lineWidth?: number;
            lineColor?: string;
        };
    };
    /** Callback function called when features are rendered */
    onRender?: (features: Record<string, unknown>[]) => void;
    /** Callback function called when features are created */
    onCreate?: (features: Record<string, unknown>[]) => void;
};

export type ImageOverlayProps = {
    /** Unique ID for this image overlay */
    id: string;
    /** URL or path to the image */
    url: string;
    /** Four corner coordinates [longitude, latitude] in order: top-left, top-right, bottom-right, bottom-left */
    coordinates: [[number, number], [number, number], [number, number], [number, number]];
    /** Opacity of the image (0-1, defaults to 1) */
    opacity?: number;
    /** Whether the image is visible (defaults to true) */
    visible?: boolean;
    /** ID of a layer before which to insert this layer */
    beforeId?: string;
};
