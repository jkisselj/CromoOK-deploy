import supabase from './supabaseClient';

export function isLocalImageUrl(url: string): boolean {
    return url.startsWith('blob:') || url.startsWith('data:');
}

export async function initializeStorage() {
    try {
        const { data, error } = await supabase.storage.createBucket('location-images', {
            public: true,
            fileSizeLimit: 10485760,
        });

        if (error && error.message !== 'Bucket already exists') {
            console.error('Failed to initialize storage bucket:', error);
        }

        return { success: !error, data };
    } catch (err) {
        console.error('Error initializing storage:', err);
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