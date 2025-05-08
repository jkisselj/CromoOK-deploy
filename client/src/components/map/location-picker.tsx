import { useEffect, useRef, useState } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MapView } from './map-view';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationPickerProps {
    onLocationSelect?: (location: {
        address: string;
        coordinates: { latitude: number; longitude: number };
    }) => void;
    defaultAddress?: string;
    updateAddressOnClick?: boolean;
    className?: string;
}

export function LocationPicker({
    onLocationSelect,
    defaultAddress,
    updateAddressOnClick = false,
    className
}: LocationPickerProps) {
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({
        latitude: 59.437,
        longitude: 24.745
    });
    const [address, setAddress] = useState<string>(defaultAddress || '');
    const geocoderContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!geocoderContainer.current) return;

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken || '',
            marker: false,
            placeholder: 'Search for an address...',
            language: 'en',
        });

        geocoder.addTo(geocoderContainer.current);

        geocoder.on('result', (e) => {
            const [lng, lat] = e.result.center;
            setCoordinates({ latitude: lat, longitude: lng });
            setAddress(e.result.place_name);
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
                        setAddress(data.features[0].place_name);
                        onLocationSelect?.({
                            address: data.features[0].place_name,
                            coordinates: { latitude: lngLat.lat, longitude: lngLat.lng }
                        });
                    }
                });
        } else {
            onLocationSelect?.({
                address: address || defaultAddress || '',
                coordinates: { latitude: lngLat.lat, longitude: lngLat.lng }
            });
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="space-y-2">
                <Label htmlFor="location-search">Location</Label>
                <div
                    ref={geocoderContainer}
                    id="location-search"
                    className="geocoder"
                />
                {address && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{address}</span>
                    </div>
                )}
            </div>

            <Card className="border rounded-md overflow-hidden">
                <CardContent className="p-0">
                    <MapView
                        latitude={coordinates.latitude}
                        longitude={coordinates.longitude}
                        onMapClick={handleMapClick}
                        zoom={13}
                        className="rounded-none border-0 h-[350px] shadow-none"
                    />
                </CardContent>
            </Card>
        </div>
    );
}