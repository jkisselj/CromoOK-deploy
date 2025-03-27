import { useEffect, useRef, useState } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MapView } from './map-view';
import mapboxgl from 'mapbox-gl';

interface LocationPickerProps {
    onLocationSelect?: (location: {
        address: string;
        coordinates: { latitude: number; longitude: number };
    }) => void;
    defaultAddress?: string;
    updateAddressOnClick?: boolean;
}

export function LocationPicker({ onLocationSelect, defaultAddress, updateAddressOnClick = false }: LocationPickerProps) {
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({
        latitude: 55.7558,
        longitude: 37.6173
    });
    const geocoderContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!geocoderContainer.current) return;

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken || '',
            marker: false,
            placeholder: 'Поиск адреса...',
        });

        geocoder.addTo(geocoderContainer.current);

        geocoder.on('result', (e) => {
            const [lng, lat] = e.result.center;
            setCoordinates({ latitude: lat, longitude: lng });
            onLocationSelect?.({
                address: e.result.place_name,
                coordinates: { latitude: lat, longitude: lng }
            });
        });

        if (defaultAddress) {
            geocoder.query(defaultAddress);
        }

        return () => {
            geocoder.onRemove();
        };
    }, [defaultAddress]);

    const handleMapClick = (lngLat: { lng: number; lat: number }) => {
        setCoordinates({ latitude: lngLat.lat, longitude: lngLat.lng });

        if (updateAddressOnClick) {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {
                    if (data.features?.length > 0) {
                        onLocationSelect?.({
                            address: data.features[0].place_name,
                            coordinates: { latitude: lngLat.lat, longitude: lngLat.lng }
                        });
                    }
                });
        } else {
            onLocationSelect?.({
                address: defaultAddress || '',
                coordinates: { latitude: lngLat.lat, longitude: lngLat.lng }
            });
        }
    };

    return (
        <div className="space-y-4">
            <div ref={geocoderContainer} className="geocoder" />
            <MapView
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
                onMapClick={handleMapClick}
                zoom={12}
            />
        </div>
    );
}