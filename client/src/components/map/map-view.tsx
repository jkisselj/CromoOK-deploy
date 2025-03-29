import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    showControls?: boolean;
    markerTitle?: string;
}

export function MapView({
    latitude,
    longitude,
    zoom = 13,
    interactive = true,
    onMapClick,
    className = "w-full h-[300px] rounded-lg overflow-hidden",
    showControls = true,
    markerTitle
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const popup = useRef<mapboxgl.Popup | null>(null);
    const initialLoad = useRef(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        if (!mapContainer.current) return;

        setIsLoading(true);

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: zoom,
            interactive: interactive
        });

        if (markerTitle) {
            popup.current = new mapboxgl.Popup({ offset: 25 })
                .setText(markerTitle);
        }

        marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude]);

        if (popup.current) {
            marker.current.setPopup(popup.current);
        }

        marker.current.addTo(map.current);

        if (onMapClick && interactive) {
            map.current.on('click', (e) => {
                onMapClick(e.lngLat);
            });
        }

        if (showControls && interactive) {
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }

        map.current.on('load', () => {
            setIsLoading(false);
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!map.current || !marker.current || initialLoad.current) {
            initialLoad.current = false;
            return;
        }

        map.current.flyTo({
            center: [longitude, latitude],
            essential: true 
        });

        marker.current.setLngLat([longitude, latitude]);
    }, [latitude, longitude]);

    const handleZoomIn = () => {
        map.current?.zoomIn();
    };

    const handleZoomOut = () => {
        map.current?.zoomOut();
    };

    const toggleFullScreen = () => {
        if (!mapContainer.current) return;

        if (!isFullScreen) {
            if (mapContainer.current.requestFullscreen) {
                mapContainer.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    return (
        <div className="relative">
            <div ref={mapContainer} className={cn(className, "relative")} />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}

            {showControls && interactive && (
                <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 hover:bg-background border shadow-sm"
                        onClick={handleZoomIn}
                    >
                        <ZoomIn className="h-4 w-4" />
                        <span className="sr-only">Zoom in</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 hover:bg-background border shadow-sm"
                        onClick={handleZoomOut}
                    >
                        <ZoomOut className="h-4 w-4" />
                        <span className="sr-only">Zoom out</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-background/80 hover:bg-background border shadow-sm"
                        onClick={toggleFullScreen}
                    >
                        {isFullScreen ? (
                            <Minimize className="h-4 w-4" />
                        ) : (
                            <Maximize className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                            {isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                        </span>
                    </Button>
                </div>
            )}
        </div>
    );
}