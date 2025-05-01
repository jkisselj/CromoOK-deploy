import supabase from '@/lib/supabaseClient';
import { Location } from '@/types/location';

// Demo locations will be populated later via setDemoLocations function
const DEMO_LOCATIONS: Location[] = [];

/**
 * Sets demo locations for migration
 */
export function setDemoLocations(locations: Location[]) {
    DEMO_LOCATIONS.length = 0;
    DEMO_LOCATIONS.push(...locations);
}

/**
 * Migrates demo locations to Supabase database and storage
 * @param forceUpdate If true, will update existing locations with same title
 */
export async function migrateDemoLocationsToSupabase(forceUpdate = false) {
    console.log('Starting to migrate demo locations to Supabase...');
    const results = { success: 0, failed: 0, skipped: 0 };

    if (DEMO_LOCATIONS.length === 0) {
        return { ...results, error: 'No demo locations available for migration' };
    }

    // Check if auth user exists
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error('Migration failed: No authenticated user found');
        return { ...results, error: 'No authenticated user found' };
    }

    // First check if locations already exist in Supabase
    const { data: existingLocations, error: fetchError } = await supabase
        .from('locations')
        .select('id, title');

    if (fetchError) {
        console.error('Error checking existing locations:', fetchError);
        return { ...results, error: fetchError.message };
    }

    // Map of titles to IDs for easy lookup
    const existingLocationMap = new Map();
    (existingLocations || []).forEach(loc => {
        existingLocationMap.set(loc.title, loc.id);
    });

    // Process each demo location
    for (const location of DEMO_LOCATIONS) {
        // Check if location with same title already exists
        const existingId = existingLocationMap.get(location.title);

        if (existingId && !forceUpdate) {
            console.log(`Skipping location: "${location.title}" - already exists`);
            results.skipped++;
            continue;
        }

        try {
            // 1. Upload images to Supabase Storage
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

            // Use uploaded images if available, otherwise keep original URLs
            const imageUrls = newImageUrls.length > 0 ? newImageUrls : [...location.images];

            // 2. Prepare location data for Supabase
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
                // Update existing location
                operation = supabase
                    .from('locations')
                    .update(locationForSupabase)
                    .eq('id', existingId)
                    .select();
            } else {
                // Insert new location
                operation = supabase
                    .from('locations')
                    .insert([locationForSupabase])
                    .select();
            }

            // Execute the operation
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

/**
 * Uploads an image to Supabase Storage from a public URL
 * @param imagePath Path to the image (can be a URL or local path)
 * @param locationId ID of the location this image belongs to
 * @returns URL of the uploaded image or null if failed
 */
async function uploadImageToSupabase(imagePath: string, locationId: string): Promise<string | null> {
    try {
        // Extract filename from path
        const fileName = imagePath.split('/').pop();
        if (!fileName) return null;
        
        // Construct storage path
        const storagePath = `${locationId}/${fileName}`;
        
        // For local files, we need to fetch them first
        if (imagePath.startsWith('/') || imagePath.startsWith('./') || imagePath.startsWith('../')) {
            // If it's a relative path in the public folder
            const absoluteUrl = new URL(imagePath, window.location.origin).href;
            
            try {
                // Fetch the image data
                const response = await fetch(absoluteUrl);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                }
                
                // Convert to blob
                const blob = await response.blob();
                
                // Upload to Supabase Storage
                const { error } = await supabase.storage
                    .from('location-images')
                    .upload(storagePath, blob, {
                        cacheControl: '3600',
                        upsert: true
                    });
                
                if (error) {
                    throw error;
                }
                
                // Get public URL for the uploaded file
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
            // For already hosted images, just return the URL
            return imagePath;
        }
    } catch (error) {
        console.error('Error in uploadImageToSupabase:', error);
        return null;
    }
}