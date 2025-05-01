-- Create storage bucket for location images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('location-images', 'location-images', true)
ON CONFLICT (id) DO NOTHING;

-- Give public access to read location images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'location-images');

-- Remove any existing policies for the location-images bucket
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Allow authenticated users to upload to location-images bucket
CREATE POLICY "Authenticated users can upload images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'location-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'location-images' AND (auth.uid() = owner OR owner IS NULL));

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'location-images' AND (auth.uid() = owner OR owner IS NULL));