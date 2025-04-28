import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from '@/hooks/use-theme';
import { useMobile, useBreakpoint } from '@/hooks/use-mobile';

const mapControlStyles = `
  .mapboxgl-ctrl-group {
    background-color: #1f2937 !important;
    border-color: #374151 !important;
  }
  .mapboxgl-ctrl-group button {
    background-color: #1f2937 !important;
  }
  .mapboxgl-ctrl-group button:hover {
    background-color: #374151 !important;
  }
  .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
    filter: brightness(0) invert(1) !important;
  }
  .mapboxgl-ctrl-group button.style-switcher-btn,
  .mapboxgl-ctrl-group button.center-marker-btn {
    color: white !important;
  }
  .style-switcher-dropdown {
    background-color: #1f2937 !important;
    color: white !important;
  }
  .style-switcher-dropdown div {
    color: white !important;
  }
  .style-switcher-dropdown div:hover {
    background-color: #374151 !important;
  }
  .style-switcher-dropdown div.active {
    background-color: #4b5563 !important;
  }
  .mapboxgl-ctrl-bottom-left,
  .mapboxgl-ctrl-bottom-right {
    display: none !important;
  }
  
  /* Responsive styles for controls */
  @media (max-width: 640px) {
    .mapboxgl-ctrl-group {
      margin-top: 10px !important;
      margin-left: 10px !important;
    }
    .mapboxgl-ctrl-group button {
      width: 36px !important;
      height: 36px !important;
    }
    .map-control-overlay {
      font-size: 12px !important;
      padding: 6px 10px !important;
      max-width: 90% !important;
      text-align: center !important;
      white-space: nowrap !important;
    }
  }
  
  /* Touchscreen optimizations */
  @media (pointer: coarse) {
    .mapboxgl-ctrl-group button {
      min-width: 40px !important;
      min-height: 40px !important;
    }
    .style-switcher-dropdown div {
      padding: 10px !important;
      min-height: 44px !important;
    }
  }
  
  /* Ensure the map container is properly sized */
  .mapboxgl-map {
    width: 100% !important;
    height: 100% !important;
  }
  
  /* Make control notifications more visible */
  .map-control-overlay {
    z-index: 10 !important;
    pointer-events: none !important;
    user-select: none !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
  }
`;

const token = import.meta.env.VITE_MAPBOX_TOKEN;
if (!token) {
    throw new Error(
        'Mapbox token is missing. Please ensure VITE_MAPBOX_TOKEN is set in your environment variables.'
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
    const isMobile = useMobile();
    const breakpoint = useBreakpoint();

    const adaptiveZoom = isMobile ? zoom - 1 : zoom;
    const adaptiveControlPosition = isMobile ? 'top-left' : controlPosition;

    useLayoutEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = mapControlStyles;
        document.head.appendChild(styleEl);
        return () => styleEl.remove();
    }, []);

    useEffect(() => {
        if (map.current) {
            const targetStyle = theme === 'dark' ? 'dark' : 'streets';
            if (currentStyle !== targetStyle) {
                map.current.setStyle(MAP_STYLES[targetStyle]);
                setCurrentStyle(targetStyle);
            }
        }
    }, [theme]);

    useEffect(() => {
        if (!mapContainer.current) return;

        const initialStyleKey = theme === 'dark' ? 'dark' : 'streets';

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: MAP_STYLES[initialStyleKey],
            center: [longitude, latitude],
            zoom: adaptiveZoom,
            interactive: interactive,
            attributionControl: false
        });

        map.current.once('load', () => {
            map.current?.setPadding(
                isMobile 
                    ? { top: 10, bottom: 10, left: 10, right: 10 } 
                    : { top: 40, bottom: 40, left: 40, right: 40 }
            );
        });

        setCurrentStyle(initialStyleKey);

        marker.current = new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map.current);

        map.current.scrollZoom.disable();

        const overlay = document.createElement('div');
        overlay.className = 'map-control-overlay';
        Object.assign(overlay.style, {
            position: 'absolute',
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            pointerEvents: 'none',
            opacity: '0.8',
            transition: 'opacity 0.3s ease'
        });
        overlay.innerHTML = 'Click to enable map controls';

        mapContainer.current.style.position = 'relative';
        mapContainer.current.appendChild(overlay);

        setTimeout(() => (overlay.style.opacity = '0'), 3000);

        mapContainer.current.addEventListener('click', () => {
            if (map.current && !map.current.scrollZoom.isEnabled()) {
                map.current.scrollZoom.enable();
                overlay.style.opacity = '0';
                showTemporaryMessage('Map control enabled');
            }
        });

        mapContainer.current.addEventListener('mouseleave', () => {
            if (map.current && map.current.scrollZoom.isEnabled()) {
                map.current.scrollZoom.disable();
                showTemporaryMessage('Map control disabled');
            }
        });

        if (showControls) {
            if (!isMobile || breakpoint.isTablet) {
                map.current.addControl(new mapboxgl.FullscreenControl(), adaptiveControlPosition);
            }
            map.current.addControl(new mapboxgl.NavigationControl({
                showCompass: !breakpoint.isMobile,
                visualizePitch: false
            }), adaptiveControlPosition);

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
                    Object.assign(dropdown.style, {
                        display: 'none',
                        position: 'absolute',
                        borderRadius: '4px',
                        padding: '5px',
                        zIndex: '1'
                    });

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
                        option.innerText = key.charAt(0).toUpperCase() + key.slice(1);
                        if (key === currentStyle) option.classList.add('active');
                        option.addEventListener('click', () => {
                            this.map.setStyle(value);
                            setCurrentStyle(key);
                            dropdown.style.display = 'none';
                            dropdown.querySelectorAll('div').forEach(d => d.classList.remove('active'));
                            option.classList.add('active');
                        });
                        dropdown.appendChild(option);
                    });

                    this.container.appendChild(dropdown);

                    this.container.querySelector('button')?.addEventListener('click', () => {
                        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
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
                private marker: mapboxgl.Marker;
                private container: HTMLElement;

                constructor(marker: mapboxgl.Marker) {
                    this.map = map.current as mapboxgl.Map;
                    this.marker = marker;
                    this.container = document.createElement('div');
                }

                onAdd() {
                    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
                    this.container.innerHTML = `
            <button class="mapboxgl-ctrl-icon center-marker-btn" title="Center on Marker">
              <svg viewBox="0 0 24 24" width="30" height="20" style="fill: white;">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
              </svg>
            </button>
          `;

                    this.container.querySelector('button')?.addEventListener('click', () => {
                        const lngLat = this.marker.getLngLat();
                        this.map.flyTo({ center: [lngLat.lng, lngLat.lat], zoom: zoom, essential: true, duration: 1000 });
                    });

                    return this.container;
                }

                onRemove() {
                    this.container.parentNode?.removeChild(this.container);
                }
            }

            if (marker.current) {
                map.current.addControl(new CenterMarkerControl(marker.current), adaptiveControlPosition);
            }

            if (!breakpoint.isMobile) {
                map.current.addControl(new StyleSwitcherControl(), adaptiveControlPosition);
            }
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

    function showTemporaryMessage(message: string) {
        const tempOverlay = document.createElement('div');
        Object.assign(tempOverlay.style, {
            position: 'absolute',
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            pointerEvents: 'none',
            opacity: '0.8',
            transition: 'opacity 0.3s ease'
        });
        tempOverlay.innerText = message;
        mapContainer.current?.appendChild(tempOverlay);
        setTimeout(() => {
            tempOverlay.style.opacity = '0';
            setTimeout(() => tempOverlay.remove(), 300);
        }, 2000);
    }

    return <div ref={mapContainer} className={className} />;
}