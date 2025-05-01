import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import type { Location, LocationFilter, CreateLocationDTO } from '@/types/location';
import { useAuthContext } from '@/context/AuthContext';
import { deleteImage, uploadImagesFromUrls } from '@/lib/imageService';
import { setDemoLocations, migrateDemoLocationsToSupabase } from '@/utils/migrationUtils';

// Export the demo locations for migration purposes
export const DEMO_LOCATIONS: Location[] = [
    
];

// Initialize the migration util with demo locations
setDemoLocations(DEMO_LOCATIONS);

const CREATED_LOCATIONS_KEY = 'user-created-locations';

/**
 * Migrates all demo locations to Supabase
 * This function can be called from a settings or admin page
 * @param forceUpdate If true, will update existing locations with the same title
 */
export async function migrateAllDemoLocationsToSupabase(forceUpdate = false) {
    return migrateDemoLocationsToSupabase(forceUpdate);
}

export function useLocations(filters?: LocationFilter) {

    return useQuery({
        queryKey: ['locations', filters],
        queryFn: async () => {
            // First try to get locations from Supabase
            try {
                let query = supabase.from('locations').select('*');

                if (filters) {
                    // Apply filters if provided
                    if (filters.minPrice !== undefined) {
                        query = query.gte('price', filters.minPrice);
                    }
                    if (filters.maxPrice !== undefined) {
                        query = query.lte('price', filters.maxPrice);
                    }
                    if (filters.minArea !== undefined) {
                        query = query.gte('area', filters.minArea);
                    }
                    if (filters.maxArea !== undefined) {
                        query = query.lte('area', filters.maxArea);
                    }
                }

                const { data, error } = await query
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching locations from Supabase:', error);
                } else if (data && data.length > 0) {
                    console.log('Got locations from Supabase:', data);

                    // Fix property casing to match frontend expectations
                    const mappedData = data.map(loc => ({
                        ...loc,
                        // Map snake_case to camelCase
                        ownerId: loc.owner_id,
                        createdAt: loc.created_at,
                        updatedAt: loc.updated_at,
                        minimumBookingHours: loc.minimum_booking_hours
                    }));

                    // If we have Supabase data, we don't need to load demo or local data
                    return mappedData as Location[];
                }
            } catch (err) {
                console.error('Failed to fetch from Supabase:', err);
            }

            // If Supabase failed or returned no data, try to get local data
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

            // Merge demo and local data
            let allLocations = [...DEMO_LOCATIONS];
            if (userCreatedLocations.length > 0) {
                allLocations = [...allLocations, ...userCreatedLocations];
            }

            // Apply filters if provided
            if (filters) {
                if (filters.minPrice !== undefined) {
                    allLocations = allLocations.filter(loc => loc.price >= filters.minPrice!);
                }
                if (filters.maxPrice !== undefined) {
                    allLocations = allLocations.filter(loc => loc.price <= filters.maxPrice!);
                }
                if (filters.minArea !== undefined) {
                    allLocations = allLocations.filter(loc => loc.area >= filters.minArea!);
                }
                if (filters.maxArea !== undefined) {
                    allLocations = allLocations.filter(loc => loc.area <= filters.maxArea!);
                }
                if (filters.amenities && filters.amenities.length > 0) {
                    allLocations = allLocations.filter(loc => {
                        return filters.amenities!.every(amenity =>
                            loc.amenities?.includes(amenity)
                        );
                    });
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

            // Process images if they exist
            let finalImages = location.images || [];
            if (location.images && location.images.length > 0) {
                const tempId = `temp-${Date.now().toString()}`;
                // Use the image service to upload images to Supabase
                finalImages = await uploadImagesFromUrls(location.images, tempId);
            }

            const newLocation: Location = {
                ...location,
                id: `loc-${Date.now().toString()}`,
                createdAt: timestamp,
                updatedAt: timestamp,
                images: finalImages,
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
                    // Prepare data for Supabase (handle naming conventions)
                    const supabaseLocation = {
                        ...newLocation,
                        owner_id: user.id,
                        minimum_booking_hours: location.minimumBookingHours || 2
                    };

                    const { error } = await supabase
                        .from('locations')
                        .insert([supabaseLocation]);

                    if (error) {
                        console.error('Error saving location to Supabase:', error);
                        // Fall back to localStorage if Supabase fails
                        saveToLocalStorage(newLocation);
                    } else {
                        console.log('Location saved to Supabase successfully');
                        return newLocation;
                    }
                } catch (err) {
                    console.error('Failed to save to Supabase:', err);
                    // Fall back to localStorage
                    saveToLocalStorage(newLocation);
                }
            } else {
                // No user, save to localStorage
                saveToLocalStorage(newLocation);
            }

            return newLocation;

            // Helper function to save to localStorage
            function saveToLocalStorage(location: Location) {
                try {
                    const storedLocations = localStorage.getItem(CREATED_LOCATIONS_KEY);
                    let userCreatedLocations: Location[] = [];

                    if (storedLocations) {
                        userCreatedLocations = JSON.parse(storedLocations);
                    }

                    userCreatedLocations.push(location);
                    localStorage.setItem(CREATED_LOCATIONS_KEY, JSON.stringify(userCreatedLocations));
                    console.log('Saved new location to localStorage');
                } catch (err) {
                    console.error('Error saving to localStorage:', err);
                }
            }
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
            // First try to get the location from Supabase
            try {
                const { data: location, error } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (!error && location) {
                    // Map snake_case to camelCase for frontend
                    return {
                        ...location,
                        ownerId: location.owner_id,
                        createdAt: location.created_at,
                        updatedAt: location.updated_at,
                        minimumBookingHours: location.minimum_booking_hours
                    } as Location;
                }
            } catch (err) {
                console.error('Failed to fetch location from Supabase:', err);
            }

            // If not found in Supabase, check demo locations
            const demoLocation = DEMO_LOCATIONS.find(loc => loc.id === id);
            if (demoLocation) {
                return demoLocation;
            }

            // If not found in demo data, check localStorage
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

            // Try to delete from Supabase first if user is authenticated
            if (user) {
                try {
                    // Get the location first to check ownership and gather image info
                    const { data: location, error: fetchError } = await supabase
                        .from('locations')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (!fetchError && location) {
                        // Check ownership
                        if (location.owner_id !== user.id) {
                            throw new Error('You can only delete your own locations');
                        }

                        // Delete images from storage if they exist
                        if (location.images && location.images.length > 0) {
                            await Promise.all(
                                location.images.map(async (imageUrl: string) => {
                                    try {
                                        if (imageUrl.includes('supabase')) {
                                            await deleteImage(imageUrl);
                                        }
                                    } catch (err) {
                                        console.warn(`Could not delete image ${imageUrl}:`, err);
                                    }
                                })
                            );
                        }

                        // Delete the location from Supabase
                        const { error: deleteError } = await supabase
                            .from('locations')
                            .delete()
                            .eq('id', id);

                        if (deleteError) {
                            console.error('Error deleting location from Supabase:', deleteError);
                            throw new Error(`Failed to delete location: ${deleteError.message}`);
                        }

                        console.log('Location deleted from Supabase successfully');
                        return { success: true, id };
                    }
                } catch (err) {
                    console.error('Failed to delete location from Supabase:', err);
                    // Continue to try localStorage if Supabase deletion fails
                }
            }

            // Try to delete from localStorage
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

            throw new Error('Location not found or could not be deleted');
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            queryClient.invalidateQueries({ queryKey: ['location', result.id] });
        },
    });
}
