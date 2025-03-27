import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [longitude, latitude],
                zoom: zoom,
                interactive: interactive
            });

            if (interactive) {
                map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
                map.current.addControl(new mapboxgl.FullscreenControl());
            }

            marker.current = new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .addTo(map.current);

            if (onMapClick) {
                map.current.on('click', (e) => {
                    const currentZoom = map.current?.getZoom();
                    const currentCenter = map.current?.getCenter();
                    const currentBearing = map.current?.getBearing();
                    const currentPitch = map.current?.getPitch();

                    onMapClick(e.lngLat);
                    marker.current?.setLngLat(e.lngLat);

                    if (map.current && currentCenter) {
                        map.current.setCenter(currentCenter);
                        if (currentZoom) map.current.setZoom(currentZoom);
                        if (currentBearing) map.current.setBearing(currentBearing);
                        if (currentPitch) map.current.setPitch(currentPitch);
                    }
                });
            }
        } else if (!initialLoad.current) {
            marker.current?.setLngLat([longitude, latitude]);
        }

        initialLoad.current = false;

        return () => {
            if (initialLoad.current) {
                map.current?.remove();
                map.current = null;
                marker.current = null;
            }
        };
    }, [latitude, longitude, interactive, zoom]);

    return <div ref={mapContainer} className={className} />;
}