import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import type { Location, LocationFilter, CreateLocationDTO } from '@/types/location';
import { useAuthContext } from '@/context/AuthContext';

const DEMO_LOCATIONS: Location[] = [
    {
        id: "1",
        title: "Luxury Photography Studio in City Center",
        description: `A stunning, professionally equipped photography studio in the heart of the city. Perfect for fashion shoots, portraits, and commercial photography.

Features:
• Large windows with natural lighting
• Professional lighting equipment included
• Makeup and changing room
• High ceilings (4m)
• Sound system
• Free parking

The studio has hosted shoots for major fashion brands and magazines. Our space combines modern aesthetics with practical functionality.`,
        address: "123 Creative District, City Center",
        price: 150, // in EUR
        area: 120,
        images: [
            "https://images.unsplash.com/photo-1581859814481-bfd944e3122f?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2940&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940",
            "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?q=80&w=2940",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2940"
        ],
        amenities: [
            "Natural Lighting",
            "Professional Lighting Kit",
            "Makeup Room",
            "Wi-Fi",
            "Sound System",
            "Air Conditioning",
            "Changing Room",
            "Free Parking",
            "Security System",
            "Loading Dock"
        ],
        rules: [
            "Minimum booking: 2 hours",
            "50% deposit required",
            "24-hour cancellation policy",
            "No smoking",
            "Clean after use",
            "Equipment insurance required"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 51.5074,
            longitude: -0.1278
        },
        features: {
            maxCapacity: 15,
            parkingSpots: 3,
            equipmentIncluded: true,
            accessibility: true,
        }
    },
    {
        id: "2",
        title: "Industrial Loft Studio with Skyline View",
        description: `An industrial-style photo studio with breathtaking city views. This unique space features exposed brick walls, large industrial windows, and modern amenities.

Features:
• Panoramic city views
• Industrial aesthetic
• Multiple shooting areas
• Full kitchen for food photography
• Private elevator access
• 24/7 availability`,
        address: "456 Warehouse District, Downtown",
        price: 200,
        area: 180,
        images: [
            "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=2940",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940",
            "https://images.unsplash.com/photo-1497366672149-e5e4b4d34eb3?q=80&w=2940",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2940",
            "https://images.unsplash.com/photo-1497366754035-5f07c98bf623?q=80&w=2940"
        ],
        amenities: [
            "City View",
            "Full Kitchen",
            "Private Elevator",
            "Loading Dock",
            "24/7 Access",
            "Climate Control",
            "Equipment Storage",
            "Backup Generator",
            "Security System",
            "Green Screen"
        ],
        rules: [
            "Minimum booking: 4 hours",
            "Full payment required in advance",
            "48-hour cancellation policy",
            "No pets allowed",
            "Catering must be approved",
            "Insurance required"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 51.5074,
            longitude: -0.1278
        },
        features: {
            maxCapacity: 25,
            parkingSpots: 5,
            equipmentIncluded: true,
            accessibility: true,
        }
    }
];

export function useLocations(filters?: LocationFilter) {
    useAuthContext();

    return useQuery({
        queryKey: ['locations', filters],
        queryFn: async () => {
            return DEMO_LOCATIONS;
        },
    });
}

export function useCreateLocation() {
    const queryClient = useQueryClient();
    useAuthContext();

    return useMutation({
        mutationFn: async (location: CreateLocationDTO) => {
            // Для демонстрации создаем фейковую локацию
            const newLocation = {
                ...location,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Добавляем новую локацию к существующим
            const existingLocations = queryClient.getQueryData<Location[]>(['locations']) || [];
            queryClient.setQueryData(['locations'], [...existingLocations, newLocation]);

            return newLocation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
        },
    });
}

export function useLocation(id: string) {
    return useQuery({
        queryKey: ['location', id],
        queryFn: async () => {
            // Для демо возвращаем заглушку, если id совпадает
            if (id === DEMO_LOCATIONS[0].id) {
                return DEMO_LOCATIONS[0];
            }
            // Ищем в существующих локациях
            const { data: locations } = await supabase
                .from('locations')
                .select('*')
                .eq('id', id)
                .single();

            if (!locations) {
                throw new Error('Location not found');
            }

            return locations as Location;
        },
    });
}
