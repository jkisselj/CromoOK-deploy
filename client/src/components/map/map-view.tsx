import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const token = import.meta.env.VITE_MAPBOX_TOKEN;
if (!token) {
    throw new Error(
        'Mapbox token is missing. Please ensure VITE_MAPBOX_TOKEN is set in your environment variables. ' +
        'If you are in development, check your .env file. ' +
        'If you are in production, make sure the environment variable is set in your deployment settings.'
    );
}
mapboxgl.accessToken = token;

interface MapViewProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    interactive?: boolean;
    onMapClick?: (lngLat: { lng: number; lat: number }) => void;
    className?: string;
}

export function MapView({
    latitude,
    longitude,
    zoom = 13,
    interactive = true,
    onMapClick,
    className = "w-full h-[300px] rounded-lg overflow-hidden"
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const initialLoad = useRef(true);

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: zoom,
            interactive: interactive
        });

        marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);

        if (onMapClick) {
            map.current.on('click', (e) => {
                onMapClick(e.lngLat);
            });
        }

        return () => {
            map.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!map.current || !marker.current || initialLoad.current) {
            initialLoad.current = false;
            return;
        }

        map.current.setCenter([longitude, latitude]);
        marker.current.setLngLat([longitude, latitude]);
    }, [latitude, longitude]);

    return <div ref={mapContainer} className={className} />;
}