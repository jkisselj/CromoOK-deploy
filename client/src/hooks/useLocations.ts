import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import type { Location, LocationFilter, CreateLocationDTO } from '@/types/location';
import { useAuthContext } from '@/context/AuthContext';
import { deleteImage } from '@/lib/imageService';

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
        price: 150,
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

const CREATED_LOCATIONS_KEY = 'user-created-locations';

export function useLocations(filters?: LocationFilter) {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    return useQuery({
        queryKey: ['locations', filters],
        queryFn: async () => {
            let userCreatedLocations: Location[] = [];
            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                if (storedLocations) {
                    userCreatedLocations = JSON.parse(storedLocations);
                    console.log('Loaded user created locations from localStorage:', userCreatedLocations);
                }
            } catch (err) {
                console.error('Error reading from localStorage:', err);
            }

            let allLocations = [...DEMO_LOCATIONS];

            if (userCreatedLocations.length > 0) {
                allLocations = [...allLocations, ...userCreatedLocations];
            }

            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('locations')
                        .select('*');

                    if (error) {
                        console.error('Error fetching locations from Supabase:', error);
                    } else if (data && data.length > 0) {
                        console.log('Got locations from Supabase:', data);
                        return [...allLocations, ...data] as Location[];
                    }
                } catch (err) {
                    console.error('Failed to fetch from Supabase:', err);
                }
            }

            return allLocations;
        },
        staleTime: 10000,
    });
}

export function useCreateLocation() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    return useMutation({
        mutationFn: async (location: CreateLocationDTO) => {
            const timestamp = new Date().toISOString();
            const newLocation: Location = {
                ...location,
                id: `loc-${Date.now().toString()}`,
                createdAt: timestamp,
                updatedAt: timestamp,
                images: location.images || [],
                amenities: location.amenities || [],
                rules: location.rules || [],
                rating: undefined,
                reviews: undefined,
                features: {
                    maxCapacity: location.features?.maxCapacity || 1,
                    parkingSpots: location.features?.parkingSpots || 0,
                    equipmentIncluded: location.features?.equipmentIncluded || false,
                    accessibility: location.features?.accessibility || false
                },
                coordinates: location.coordinates || {
                    latitude: 55.7558,
                    longitude: 37.6173
                },
                bookings: {
                    totalBookings: 0,
                    averageRating: 0
                }
            };

            if (user) {
                try {
                    const { error } = await supabase
                        .from('locations')
                        .insert([newLocation]);

                    if (error) {
                        console.error('Error saving location to Supabase:', error);
                    }
                } catch (err) {
                    console.error('Failed to save to Supabase:', err);
                }
            }

            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                let userCreatedLocations: Location[] = [];

                if (storedLocations) {
                    userCreatedLocations = JSON.parse(storedLocations);
                }

                userCreatedLocations.push(newLocation);
                localStorage.setItem(CREATED_LOCATIONS_KEY, JSON.stringify(userCreatedLocations));
                console.log('Saved new location to localStorage');

                const existingLocations = queryClient.getQueryData<Location[]>(['locations']) || [];
                queryClient.setQueryData(['locations'], [...existingLocations, newLocation]);
            } catch (err) {
                console.error('Error saving to localStorage:', err);
            }

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
            const demoLocation = DEMO_LOCATIONS.find(loc => loc.id === id);
            if (demoLocation) {
                return demoLocation;
            }

            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                if (storedLocations) {
                    const userCreatedLocations: Location[] = JSON.parse(storedLocations);
                    const userLocation = userCreatedLocations.find(loc => loc.id === id);
                    if (userLocation) {
                        console.log('Found location in localStorage:', userLocation);
                        return userLocation;
                    }
                }
            } catch (err) {
                console.error('Error reading from localStorage:', err);
            }

            try {
                const { data: location, error } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching location from Supabase:', error);
                    throw new Error('Location not found');
                }

                if (location) {
                    return location as Location;
                }
            } catch (err) {
                console.error('Failed to fetch location from Supabase:', err);
            }

            throw new Error('Location not found');
        },
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();

    return useMutation({
        mutationFn: async (id: string) => {
            const isDemoLocation = DEMO_LOCATIONS.some(loc => loc.id === id);
            if (isDemoLocation) {
                throw new Error('Demo locations cannot be deleted');
            }

            try {
                const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                if (storedLocations) {
                    let userCreatedLocations: Location[] = JSON.parse(storedLocations);
                    const localLocationIndex = userCreatedLocations.findIndex(loc => loc.id === id);

                    if (localLocationIndex >= 0) {
                        userCreatedLocations.splice(localLocationIndex, 1);
                        localStorage.setItem(CREATED_LOCATIONS_KEY, JSON.stringify(userCreatedLocations));
                        console.log('Location removed from localStorage');
                        return { success: true, id };
                    }
                }
            } catch (err) {
                console.error('Error working with localStorage:', err);
            }

            if (!user) {
                throw new Error('Authentication required to delete a location');
            }

            try {
                const { data: location, error: fetchError } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (fetchError) {
                    console.error('Error retrieving location for deletion:', fetchError);
                    throw new Error(`Could not find location: ${fetchError.message}`);
                }

                if (location.ownerId !== user.id) {
                    throw new Error('You can only delete your own locations');
                }

                if (location.images && location.images.length > 0) {
                    await Promise.all(
                        location.images.map(async (imageUrl: string) => {
                            try {
                                await deleteImage(imageUrl);
                            } catch (err) {
                                console.warn(`Could not delete image ${imageUrl}:`, err);
                            }
                        })
                    );
                }

                const { error: deleteError } = await supabase
                    .from('locations')
                    .delete()
                    .eq('id', id);

                if (deleteError) {
                    console.error('Error deleting location from Supabase:', deleteError);
                    throw new Error(`Failed to delete location: ${deleteError.message}`);
                }

                return { success: true, id };
            } catch (err) {
                console.error('Failed to delete location:', err);
                throw err;
            }
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['location', result.id] });
        },
    });
}
