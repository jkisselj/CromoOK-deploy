import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import type { Location, LocationFilter, CreateLocationDTO } from '@/types/location';
import { useAuthContext } from '@/context/AuthContext';
import { deleteImage } from '@/lib/imageService';

const DEMO_LOCATIONS: Location[] = [
    {
        id: "1",
        title: "Rannapungerja Lighthouse - Unique Photoshoot Location",
        description: `Discover the hidden gem of Estonia's northern coast - the historic Rannapungerja Lighthouse, now available as an exclusive photoshoot location. This functioning lighthouse stands as a sentinel over the peaceful shores of Lake Peipus, offering a truly unique setting for photographers and filmmakers.

Features:
• Working lighthouse with accessible viewing platform offering 360° panoramic views
• Authentic maritime atmosphere with original historical elements preserved
• Beautiful sandy beach adjacent to the lighthouse 
• Perfect location for sunrise/sunset photography with stunning natural light
• Surrounded by pristine nature and pine forests
• Seasonal variations provide diverse photographic opportunities year-round
• Secluded location ensures privacy during your shoot

The lighthouse interior features original spiral staircase, vintage nautical elements, and charming details that create atmospheric backdrops. From the viewing platform, capture breathtaking vistas of Lake Peipus and the surrounding unspoiled coastline.

This location is ideal for wedding photography, fashion shoots, maritime-themed commercial work, landscape photography, portrait sessions, and artistic projects requiring a unique setting. The contrast between the structured architecture of the lighthouse and the natural beauty of the surrounding beach and forest offers endless creative possibilities.

The sandy beach provides additional shooting space with natural dunes and coastal vegetation adding texture and interest to your compositions.

Available for private bookings with flexible hours to catch the perfect light conditions for your project.`,
        address: "Rannapungerja, 42208 Ida-Viru County, Estonia",
        price: 90,
        area: 120,
        images: [
           "/locations/Rannapungerja-tuletorn_okt2023-EXT-45.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-46.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-42.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-49.png",
            "/locations/Rannapungerja-tuletorn_okt2023-EXT-49.png"
        ],
        amenities: [
            "Panoramic Lake Views",
            "Access to Viewing Platform",
            "Sandy Beach Access",
            "Heated Interior in Winter",
            "Parking Available",
            "Professional Lighting Setup",
            "Changing Room/Restroom",
            "Evening Photography Options",
            "Historical Location",
            "Natural Landscapes",
            "Original Maritime Features"
        ],
        rules: [
            "Advance Booking Required",
            "Minimum Booking: 2 Hours",
            "100% Prepayment Required",
            "48-Hour Cancellation Policy",
            "Maximum 8 People on Site",
            "No Interference with Lighthouse Operation",
            "Drone Usage Requires Special Permission",
            "Respect Natural Environment",
            "No Open Fires on Beach"
        ],
        ownerId: "demo-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        coordinates: {
            latitude: 58.97948457196772, 
            longitude: 27.17564623627185
        },
        features: {
            maxCapacity: 8,
            parkingSpots: 3,
            equipmentIncluded: false,
            accessibility: false,
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
