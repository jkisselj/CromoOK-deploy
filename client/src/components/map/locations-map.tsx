import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/types/location';
import { useTheme } from '@/hooks/use-theme';

// Custom styles for dark-themed map controls
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
`;

const MAP_STYLES = {
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-v9',
    outdoors: 'mapbox://styles/mapbox/outdoors-v12',
    light: 'mapbox://styles/mapbox/light-v11',
    dark: 'mapbox://styles/mapbox/dark-v11'
};

interface LocationsMapProps {
    locations: Location[];
    onLocationClick: (location: Location) => void;
    className?: string;
    center: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
}

export function LocationsMap({
    locations,
    onLocationClick,
    className = "w-full h-[70vh] rounded-lg border shadow-sm",
    center
}: LocationsMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
    const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const [currentStyle, setCurrentStyle] = useState<string>('streets');
    const { theme } = useTheme();

    useEffect(() => {
        // Add custom styles for dark-themed map controls
        const styleEl = document.createElement('style');
        styleEl.innerHTML = mapControlStyles;
        document.head.appendChild(styleEl);

        return () => styleEl.remove();
    }, []);

    // Update map style based on theme
    useEffect(() => {
        if (mapRef.current) {
            const targetStyle = theme === 'dark' ? 'dark' : 'streets';
            if (currentStyle !== targetStyle) {
                mapRef.current.setStyle(MAP_STYLES[targetStyle]);
                setCurrentStyle(targetStyle);
            }
        }
    }, [theme, currentStyle]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Get token from environment variables
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) {
            console.error('Mapbox token is missing');
            return;
        }

        // Set the mapbox access token
        mapboxgl.accessToken = token;

        // Initial style based on theme
        const initialStyleKey = theme === 'dark' ? 'dark' : 'streets';

        // Initialize map
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: MAP_STYLES[initialStyleKey],
            center: [center.longitude, center.latitude],
            zoom: center.zoom,
            attributionControl: false
        });

        setCurrentStyle(initialStyleKey);

        // Disable scroll zoom initially
        mapRef.current.scrollZoom.disable();

        // Create an overlay for initial control instruction
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
            transition: 'opacity 0.3s ease',
            zIndex: '10'
        });
        overlay.innerHTML = 'Click to enable map controls';

        mapContainerRef.current.style.position = 'relative';
        mapContainerRef.current.appendChild(overlay);
        overlayRef.current = overlay;

        setTimeout(() => (overlay.style.opacity = '0'), 3000);

        // Enable map controls on click
        mapContainerRef.current.addEventListener('click', () => {
            if (mapRef.current && !mapRef.current.scrollZoom.isEnabled()) {
                mapRef.current.scrollZoom.enable();
                overlay.style.opacity = '0';
                showTemporaryMessage('Map control enabled');
            }
        });

        // Disable map controls when mouse leaves
        mapContainerRef.current.addEventListener('mouseleave', () => {
            if (mapRef.current && mapRef.current.scrollZoom.isEnabled()) {
                mapRef.current.scrollZoom.disable();
                showTemporaryMessage('Map control disabled');
            }
        });

        // Add map controls
        const map = mapRef.current;

        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Style switcher control
        class StyleSwitcherControl {
            private map: mapboxgl.Map;
            private container: HTMLElement;

            constructor() {
                this.map = map as mapboxgl.Map;
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
                    zIndex: '1',
                    right: '0',
                    top: '40px'
                });

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

        map.addControl(new StyleSwitcherControl(), 'top-right');

        // Add markers when map is loaded
        map.on('load', () => {
            locations.forEach(createMarker);
        });

        return () => {
            // Clean up resources when component unmounts
            Object.values(markersRef.current).forEach(marker => marker.remove());
            markersRef.current = {};

            Object.values(popupsRef.current).forEach(popup => popup.remove());
            popupsRef.current = {};

            mapRef.current?.remove();
        };
    }, []);

    // Update markers when locations change
    useEffect(() => {
        if (!mapRef.current) return;

        // Remove markers for locations that are no longer in the list
        Object.keys(markersRef.current).forEach(id => {
            if (!locations.some(loc => loc.id === id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];

                if (popupsRef.current[id]) {
                    popupsRef.current[id].remove();
                    delete popupsRef.current[id];
                }
            }
        });

        // Add/update markers for current locations
        locations.forEach(location => {
            if (!location.coordinates) return;

            if (markersRef.current[location.id]) {
                // Update existing marker position
                markersRef.current[location.id].setLngLat([
                    location.coordinates.longitude,
                    location.coordinates.latitude
                ]);
            } else {
                // Create new marker
                createMarker(location);
            }
        });
    }, [locations]);

    // Update map center when center prop changes
    useEffect(() => {
        if (!mapRef.current) return;

        mapRef.current.flyTo({
            center: [center.longitude, center.latitude],
            zoom: center.zoom,
            essential: true,
            duration: 1000
        });
    }, [center.latitude, center.longitude, center.zoom]);

    // Create a marker for a location
    const createMarker = (location: Location) => {
        if (!mapRef.current || !location.coordinates) return;

        // Create HTML element for marker with photo
        const el = document.createElement('div');
        el.className = 'location-marker';
        el.style.width = '50px';
        el.style.height = '50px';
        el.style.borderRadius = '50%';
        el.style.overflow = 'hidden';
        el.style.border = '2px solid var(--card)';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.backgroundImage = `url(${location.images[0] || 'https://via.placeholder.com/150'})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';

        // Add price tag
        const priceTag = document.createElement('div');
        priceTag.className = 'location-price-tag';
        priceTag.style.position = 'absolute';
        priceTag.style.bottom = '-5px';
        priceTag.style.left = '50%';
        priceTag.style.transform = 'translateX(-50%)';
        priceTag.style.backgroundColor = 'var(--primary)';
        priceTag.style.color = 'var(--primary-foreground)';
        priceTag.style.padding = '2px 6px';
        priceTag.style.borderRadius = '10px';
        priceTag.style.fontSize = '10px';
        priceTag.style.fontWeight = 'bold';
        priceTag.textContent = `${location.price}€`;
        el.appendChild(priceTag);

        // Create styles for popup that will adapt to theme
        const popupStyles = `
        .mapboxgl-popup-content {
            background-color: var(--card);
            color: var(--card-foreground);
            border-radius: var(--radius);
            padding: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .mapboxgl-popup-tip {
            border-top-color: var(--card);
            border-bottom-color: var(--card);
        }
        .location-popup-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--card-foreground);
        }
        .location-popup-address {
            font-size: 12px;
            margin-bottom: 8px;
            color: var(--muted-foreground);
        }
        .location-popup-tag {
            font-size: 10px;
            background: var(--secondary);
            color: var(--secondary-foreground);
            padding: 1px 6px;
            border-radius: 9999px;
            display: inline-block;
            margin-right: 4px;
            margin-bottom: 4px;
        }
        `;

        // Add styles to document
        const styleElement = document.createElement('style');
        styleElement.innerHTML = popupStyles;
        document.head.appendChild(styleElement);

        // Create popup with location info using styled HTML
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false,
            className: 'location-popup'
        }).setHTML(`
            <div>
                <h3 class="location-popup-title">${location.title}</h3>
                <p class="location-popup-address">${location.address}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${location.tags?.slice(0, 3).map(tag =>
            `<span class="location-popup-tag">${tag}</span>`
        ).join('') || ''}
                </div>
            </div>
        `);

        // Create and add marker to map
        const marker = new mapboxgl.Marker(el)
            .setLngLat([location.coordinates.longitude, location.coordinates.latitude])
            .setPopup(popup)
            .addTo(mapRef.current);

        // Add event handlers
        el.addEventListener('click', () => {
            onLocationClick(location);
        });

        el.addEventListener('mouseenter', () => {
            popup.addTo(mapRef.current!);
        });

        el.addEventListener('mouseleave', () => {
            popup.remove();
        });

        // Store marker for later reference
        markersRef.current[location.id] = marker;
        popupsRef.current[location.id] = popup;
    };

    // Display temporary message on the map
    function showTemporaryMessage(message: string) {
        if (!mapContainerRef.current) return;

        const tempOverlay = document.createElement('div');
        Object.assign(tempOverlay.style, {
            position: 'absolute',
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--card)',
            color: 'var(--card-foreground)',
            padding: '8px 12px',
            borderRadius: '4px',
            pointerEvents: 'none',
            opacity: '0.9',
            transition: 'opacity 0.3s ease',
            zIndex: '10',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            border: '1px solid var(--border)'
        });
        tempOverlay.innerText = message;
        mapContainerRef.current.appendChild(tempOverlay);

        setTimeout(() => {
            tempOverlay.style.opacity = '0';
            setTimeout(() => tempOverlay.remove(), 300);
        }, 2000);
    }

    return (
        <div ref={mapContainerRef} className={className}></div>
    );
}