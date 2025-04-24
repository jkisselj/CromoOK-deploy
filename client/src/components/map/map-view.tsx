import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '@/hooks/use-theme';

const token = import.meta.env.VITE_MAPBOX_TOKEN;
if (!token) {
    throw new Error(
        'Mapbox token is missing. Please ensure VITE_MAPBOX_TOKEN is set in your environment variables. ' +
        'If you are in development, check your .env file. ' +
        'If you are in production, make sure the environment variable is set in your deployment settings.'
    );
}
mapboxgl.accessToken = token;

const MAP_STYLES = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11'
};

interface MapViewProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    interactive?: boolean;
    onMapClick?: (lngLat: { lng: number; lat: number }) => void;
    className?: string;
    showControls?: boolean;
    controlPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function MapView({
    latitude,
    longitude,
    zoom = 13,
    interactive = true,
    onMapClick,
    className = "w-full h-[300px] rounded-lg overflow-hidden",
    showControls = true,
    controlPosition = 'top-right'
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const initialLoad = useRef(true);
    const [currentStyle, setCurrentStyle] = useState<string>('streets');
    const { theme } = useTheme();

    useEffect(() => {
        if (map.current) {
            if (theme === 'dark' && currentStyle === 'streets') {
                map.current.setStyle(MAP_STYLES.dark);
                setCurrentStyle('dark');
            }
            else if (theme === 'light' && currentStyle === 'dark') {
                map.current.setStyle(MAP_STYLES.streets);
                setCurrentStyle('streets');
            }
        }
    }, [theme]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const initialStyle = theme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.streets;
        const initialStyleKey = theme === 'dark' ? 'dark' : 'streets';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: initialStyle,
            center: [longitude, latitude],
            zoom: zoom,
            interactive: interactive
        });

        setCurrentStyle(initialStyleKey);

        marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);

        if (showControls) {
            map.current.addControl(new mapboxgl.FullscreenControl(), controlPosition);
            map.current.addControl(new mapboxgl.NavigationControl(), controlPosition);

            class StyleSwitcherControl {
                private map: mapboxgl.Map;
                private container: HTMLElement;

                constructor() {
                    this.map = map.current as mapboxgl.Map;
                    this.container = document.createElement('div');
                }

                onAdd() {
                    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
                    this.container.innerHTML = `
                        <button class="mapboxgl-ctrl-icon style-switcher-btn" style="width: auto; padding: 0 10px;" title="Change Style">
                            View
                        </button>
                    `;



                    const dropdown = document.createElement('div');
                    dropdown.className = 'style-switcher-dropdown';
                    dropdown.style.display = 'none';
                    dropdown.style.position = 'absolute';
                    dropdown.style.borderRadius = '4px';
                    dropdown.style.padding = '5px';
                    dropdown.style.zIndex = '1';

                    if (controlPosition.includes('left')) {
                        dropdown.style.left = '0';
                    } else {
                        dropdown.style.right = '0';
                    }

                    if (controlPosition.includes('bottom')) {
                        dropdown.style.bottom = '40px';
                    } else {
                        dropdown.style.top = '40px';
                    }

                    Object.entries(MAP_STYLES).forEach(([key, value]) => {
                        const option = document.createElement('div');
                        option.style.padding = '5px 10px';
                        option.style.cursor = 'pointer';
                        option.style.borderRadius = '2px';

                        if (key === currentStyle) {
                            option.classList.add('active');
                        }

                        option.innerText = key.charAt(0).toUpperCase() + key.slice(1);

                        option.addEventListener('click', () => {
                            this.map.setStyle(value);
                            setCurrentStyle(key);
                            dropdown.style.display = 'none';
                            dropdown.querySelectorAll('div').forEach(item => {
                                item.classList.remove('active');
                            });
                            option.classList.add('active');
                        });

                        dropdown.appendChild(option);
                    });

                    this.container.appendChild(dropdown);

                    this.container.querySelector('button')?.addEventListener('click', () => {
                        if (dropdown.style.display === 'none') {
                            dropdown.style.display = 'block';
                        } else {
                            dropdown.style.display = 'none';
                        }
                    });

                    document.addEventListener('click', (e) => {
                        if (!this.container.contains(e.target as Node)) {
                            dropdown.style.display = 'none';
                        }
                    });

                    return this.container;
                }

                onRemove() {
                    this.container.parentNode?.removeChild(this.container);
                }
            }

            class CenterMarkerControl {
                private map: mapboxgl.Map;
                private container: HTMLElement;
                private marker: mapboxgl.Marker;

                constructor(marker: mapboxgl.Marker) {
                    this.map = map.current as mapboxgl.Map;
                    this.marker = marker;
                    this.container = document.createElement('div');
                }

                onAdd() {
                    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
                    this.container.innerHTML = `
                        <button class="mapboxgl-ctrl-icon center-marker-btn" title="Back to marker">
                            <svg viewBox="0 0 24 24" width="30" height="20">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                            </svg>
                        </button>
                    `;

                    this.container.querySelector('button')?.addEventListener('click', () => {
                        const lngLat = this.marker.getLngLat();
                        this.map.flyTo({
                            center: [lngLat.lng, lngLat.lat],
                            zoom: zoom,
                            essential: true,
                            duration: 1000
                        });
                    });

                    return this.container;
                }

                onRemove() {
                    this.container.parentNode?.removeChild(this.container);
                }
            }

            if (marker.current) {
                map.current.addControl(new CenterMarkerControl(marker.current), controlPosition);
            }
            map.current.addControl(new StyleSwitcherControl(), controlPosition);
        }

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