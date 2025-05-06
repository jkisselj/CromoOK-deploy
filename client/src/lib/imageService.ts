import supabase from './supabaseClient';

export function isLocalImageUrl(url: string): boolean {
    return url.startsWith('blob:') || url.startsWith('data:');
}

export async function initializeStorage() {
    try {
        // Instead of creating the bucket (which might fail due to RLS),
        // we'll just check if it exists
        const { data: buckets, error } = await supabase
            .storage
            .listBuckets();
        
        const bucketExists = buckets?.some(bucket => bucket.name === 'location-images');
        
        if (!bucketExists) {
            console.log('Storage bucket "location-images" does not exist. It should be created by an admin or through migrations.');
        } else {
            console.log('Storage bucket "location-images" exists.');
        }
        
        return { success: true, bucketExists };
    } catch (err) {
        console.error('Error checking storage bucket:', err);
        return { success: false };
    }
}

export async function uploadImagesFromUrls(imageUrls: string[], locationId: string): Promise<string[]> {
    if (!imageUrls || imageUrls.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const url of imageUrls) {
        if (!isLocalImageUrl(url) && url.startsWith('http')) {
            uploadedUrls.push(url);
            continue;
        }

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = `${locationId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            const fileExt = blob.type.split('/')[1] || 'jpeg';

            const { data, error } = await supabase.storage
                .from('location-images')
                .upload(`${fileName}.${fileExt}`, blob, {
                    contentType: blob.type,
                    upsert: false,
                });

            if (error) {
                console.error('Failed to upload image:', error);
                continue;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from('location-images').getPublicUrl(data.path);

            uploadedUrls.push(publicUrl);
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    }

    return uploadedUrls;
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
    if (!imageUrl || (!imageUrl.includes('supabase') && !isLocalImageUrl(imageUrl))) {
        return true;
    }

    try {
        const urlParts = imageUrl.split('/');
        const pathParts = urlParts.slice(urlParts.indexOf('location-images') + 1);
        const filePath = pathParts.join('/');

        if (!filePath) return true;

        const { error } = await supabase.storage
            .from('location-images')
            .remove([filePath]);

        if (error) {
            console.error('Failed to delete image:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error deleting image:', err);
        return false;
    }
}