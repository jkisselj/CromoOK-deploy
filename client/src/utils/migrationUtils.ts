import supabase from '@/lib/supabaseClient';
import { Location } from '@/types/location';

const DEMO_LOCATIONS: Location[] = [];

export function setDemoLocations(locations: Location[]) {
    DEMO_LOCATIONS.length = 0;
    DEMO_LOCATIONS.push(...locations);
}

export async function migrateDemoLocationsToSupabase(forceUpdate = false) {
    console.log('Starting to migrate demo locations to Supabase...');
    const results = { success: 0, failed: 0, skipped: 0 };

    if (DEMO_LOCATIONS.length === 0) {
        return { ...results, error: 'No demo locations available for migration' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('Migration failed: No authenticated user found');
        return { ...results, error: 'No authenticated user found' };
    }

    const { data: existingLocations, error: fetchError } = await supabase
        .from('locations')
        .select('id, title');

    if (fetchError) {
        console.error('Error checking existing locations:', fetchError);
        return { ...results, error: fetchError.message };
    }

    const existingLocationMap = new Map();
    (existingLocations || []).forEach(loc => {
        existingLocationMap.set(loc.title, loc.id);
    });

    for (const location of DEMO_LOCATIONS) {
        const existingId = existingLocationMap.get(location.title);

        if (existingId && !forceUpdate) {
            console.log(`Skipping location: "${location.title}" - already exists`);
            results.skipped++;
            continue;
        }

        try {
            const newImageUrls = [];
            for (const imagePath of location.images) {
                try {
                    const uploadedUrl = await uploadImageToSupabase(imagePath, existingId || 'new');
                    if (uploadedUrl) {
                        newImageUrls.push(uploadedUrl);
                    }
                } catch (imgError) {
                    console.error(`Failed to upload image ${imagePath}:`, imgError);
                }
            }

            const imageUrls = newImageUrls.length > 0 ? newImageUrls : [...location.images];

            const locationForSupabase = {
                title: location.title,
                description: location.description,
                address: location.address,
                price: location.price,
                area: location.area,
                images: imageUrls,
                amenities: location.amenities || [],
                rules: location.rules || [],
                owner_id: user.id,
                status: location.status || 'published',
                coordinates: location.coordinates || null,
                features: location.features || null,
                minimum_booking_hours: location.minimumBookingHours || 2,
                tags: []
            };

            let operation;
            if (existingId && forceUpdate) {
                operation = supabase
                    .from('locations')
                    .update(locationForSupabase)
                    .eq('id', existingId)
                    .select();
            } else {
                operation = supabase
                    .from('locations')
                    .insert([locationForSupabase])
                    .select();
            }

            const { data, error } = await operation;

            if (error) {
                console.error(`Failed to ${existingId ? 'update' : 'insert'} location "${location.title}":`, error);
                results.failed++;
            } else {
                console.log(`Successfully ${existingId ? 'updated' : 'migrated'} location: "${location.title}"`, data);
                results.success++;
            }
        } catch (error) {
            console.error(`Error migrating location "${location.title}":`, error);
            results.failed++;
        }
    }

    console.log('Migration completed with results:', results);
    return results;
}

async function uploadImageToSupabase(imagePath: string, locationId: string): Promise<string | null> {
    try {
        const fileName = imagePath.split('/').pop();
        if (!fileName) return null;
        const storagePath = `${locationId}/${fileName}`;
        if (imagePath.startsWith('/') || imagePath.startsWith('./') || imagePath.startsWith('../')) {
            const absoluteUrl = new URL(imagePath, window.location.origin).href;
            try {
                const response = await fetch(absoluteUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                }
                const blob = await response.blob();
                const { error } = await supabase.storage
                    .from('location-images')
                    .upload(storagePath, blob, {
                        cacheControl: '3600',
                        upsert: true
                    });
                if (error) {
                    throw error;
                }
                const { data: { publicUrl } } = supabase.storage
                    .from('location-images')
                    .getPublicUrl(storagePath);
                console.log(`Successfully uploaded image to ${storagePath}`);
                return publicUrl;
            } catch (error) {
                console.error('Error uploading image to Supabase:', error);
                return null;
            }
        } else {
            return imagePath;
        }
    } catch (error) {
        console.error('Error in uploadImageToSupabase:', error);
        return null;
    }
}