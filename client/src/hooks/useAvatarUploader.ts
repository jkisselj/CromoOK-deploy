import { useState } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/components/ui/use-toast';
import supabase from '@/lib/supabaseClient';

export function useAvatarUploader() {
    const { user, updateAvatar } = useAuthContext();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const createImageBlob = async (fileOrUrl: File | string): Promise<Blob | null> => {
        try {
            if (fileOrUrl instanceof File) {
                return fileOrUrl;
            }

            const imageUrl = fileOrUrl;
            const img = new Image();
            img.src = imageUrl;

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

    const uploadAvatar = async (fileOrUrl: File | string): Promise<string | null> => {
        if (!user) {
            toast({
                title: 'Authentication Required',
                description: 'You need to be logged in to upload an avatar',
                variant: 'destructive',
            });
            return null;
        }

        setIsUploading(true);
        setProgress(10);

        try {
            const blob = await createImageBlob(fileOrUrl);
            if (!blob) {
                throw new Error('Failed to create image for upload');
            }

            setProgress(30);

            const fileExt = blob.type.split('/')[1] || 'jpg';
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            try {
                const { data: buckets } = await supabase.storage.listBuckets();
                const bucketExists = buckets?.some(bucket => bucket.name === 'avatars');

                if (!bucketExists) {
                    console.warn('Avatars bucket does not exist. Creating it automatically...');
                    await supabase.storage.createBucket('avatars', {
                        public: true,
                        fileSizeLimit: 1024 * 1024 * 2,
                    });
                }
            } catch (bucketError) {
                console.warn('Unable to verify avatars bucket:', bucketError);
            }

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, blob, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: blob.type,
                });

            if (uploadError) {
                console.error('Upload error details:', uploadError);
                throw uploadError;
            }

            setProgress(70);

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            await updateAvatar(publicUrl);

            setProgress(100);

            toast({
                title: 'Avatar Updated',
                description: 'Your avatar has been successfully updated',
            });

            return publicUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while uploading the avatar';

            toast({
                title: 'Upload Failed',
                description: errorMessage,
                variant: 'destructive',
            });

            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadAvatar,
        isUploading,
        progress,
    };
}