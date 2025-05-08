import supabase from '@/lib/supabaseClient';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export function useImageUploader() {
    const { user } = useAuthContext();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const createImageBlob = async (imageUrl: string): Promise<Blob | null> => {
        try {
            const img = new Image();

            img.src = imageUrl.startsWith('http')
                ? imageUrl
                : `${window.location.origin}${imageUrl}`;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;

                setTimeout(() => reject(new Error('Image load timeout')), 5000);
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            ctx.drawImage(img, 0, 0);

            return new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob from image'));
                }, 'image/jpeg', 0.85);
            });
        } catch (error) {
            console.error('Error creating image blob:', error);
            return null;
        }
    };

    const uploadImageFromUrl = async (imageUrl: string, locationId: string, bucketName = 'location-images') => {
        if (!user) {
            toast({
                title: 'Authentication Required',
                description: 'You need to be logged in to upload images',
                variant: 'destructive',
            });
            return imageUrl;
        }

        try {
            const fileName = imageUrl.split('/').pop() || `image-${Date.now()}.jpg`;
            const filePath = `${locationId}/${fileName}`;

            const blob = await createImageBlob(imageUrl);

            if (!blob) {
                console.warn(`Could not create blob for ${imageUrl}. Using original URL.`);
                return imageUrl;
            }

            const { error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, blob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: 'image/jpeg',
                });

            if (error) {
                console.error('Error uploading image to Supabase:', error);
                return imageUrl;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error in uploadImageFromUrl:', error);
            return imageUrl;
        }
    };

    const uploadLocationImages = async (location: { images: string | any[]; id: string; title: any; }, bucketName = 'location-images') => {
        if (!location || !location.images || !location.images.length) {
            return { success: false, message: 'No images to upload', location };
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const totalImages = location.images.length;
            const newImageUrls = [];

            for (let i = 0; i < totalImages; i++) {
                const imageUrl = location.images[i];
                const uploadedUrl = await uploadImageFromUrl(imageUrl, location.id, bucketName);
                newImageUrls.push(uploadedUrl || imageUrl);

                setProgress(Math.round(((i + 1) / totalImages) * 100));
            }

            const updatedLocation = {
                ...location,
                images: newImageUrls
            };

            const { error } = await supabase
                .from('locations')
                .update({ images: newImageUrls })
                .eq('id', location.id);

            if (error) {
                console.error('Error updating location with new image URLs:', error);
                toast({
                    title: 'Error Updating Location',
                    description: `Could not update location images: ${error.message}`,
                    variant: 'destructive',
                });
                return { success: false, message: error.message, location: updatedLocation };
            }

            toast({
                title: 'Images Uploaded',
                description: `Successfully uploaded ${newImageUrls.length} images for location "${location.title}"`,
            });

            return { success: true, location: updatedLocation };
        } catch (error) {
            console.error('Error uploading location images:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while uploading images';
            toast({
                title: 'Upload Failed',
                description: errorMessage,
                variant: 'destructive',
            });
            return { success: false, message: errorMessage, location };
        } finally {
            setIsUploading(false);
        }
    };

    const uploadAllLocationsImages = async (locations: string | any[]) => {
        if (!locations || !locations.length) {
            toast({
                title: 'No Locations Found',
                description: 'There are no locations with images to upload',
                variant: 'destructive',
            });
            return { success: false, message: 'No locations provided' };
        }

        setIsUploading(true);
        setProgress(0);

        try {
            const results = {
                success: 0,
                failed: 0,
                skipped: 0,
                totalImages: 0,
                uploadedImages: 0
            };

            const totalLocations = locations.length;

            for (let i = 0; i < totalLocations; i++) {
                const location = locations[i];

                if (!location.images || !location.images.length) {
                    results.skipped++;
                    continue;
                }

                results.totalImages += location.images.length;

                const { success, location: updatedLocation } = await uploadLocationImages(location);

                if (success) {
                    results.success++;
                    results.uploadedImages += updatedLocation.images.length;
                } else {
                    results.failed++;
                }

                setProgress(Math.round(((i + 1) / totalLocations) * 100));
            }

            toast({
                title: 'Upload Complete',
                description: `Uploaded ${results.uploadedImages} images across ${results.success} locations. Failed: ${results.failed}, Skipped: ${results.skipped}`,
            });

            return { success: true, results };
        } catch (error) {
            console.error('Error in uploadAllLocationsImages:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during bulk upload';
            toast({
                title: 'Upload Failed',
                description: errorMessage,
                variant: 'destructive',
            });
            return { success: false, message: errorMessage };
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadImageFromUrl,
        uploadLocationImages,
        uploadAllLocationsImages,
        isUploading,
        progress
    };
}