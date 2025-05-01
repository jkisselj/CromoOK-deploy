-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  price INTEGER NOT NULL,
  area INTEGER NOT NULL,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  rules TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  coordinates JSONB DEFAULT NULL,
  features JSONB DEFAULT NULL,
  tags TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT NULL,
  reviews INTEGER DEFAULT 0,
  bookings JSONB DEFAULT NULL,
  availability JSONB DEFAULT NULL,
  minimum_booking_hours INTEGER DEFAULT 2
);

-- Create RLS policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policy for select - everyone can view published locations
CREATE POLICY "Anyone can view published locations" 
  ON locations FOR SELECT 
  USING (status = 'published');

-- Policy for insert - authenticated users can insert
CREATE POLICY "Authenticated users can insert locations" 
  ON locations FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Policy for update - owners can update their locations
CREATE POLICY "Users can update own locations" 
  ON locations FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id) 
  WITH CHECK (auth.uid() = owner_id);

-- Policy for delete - owners can delete their locations
CREATE POLICY "Users can delete own locations" 
  ON locations FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Add a function to automatically update the updated_at field
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to call the function
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();