-- Create enum type for access levels
CREATE TYPE share_access_level AS ENUM ('photos_only', 'full_info', 'admin');

-- Add new columns to locations table for access control
ALTER TABLE locations ADD COLUMN share_access_level share_access_level DEFAULT 'full_info';

-- Create a separate table for different share links with different access levels
CREATE TABLE location_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    access_level share_access_level NOT NULL DEFAULT 'full_info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_by UUID REFERENCES auth.users(id),
    name TEXT
);

-- Create index for faster lookups
CREATE INDEX idx_location_shares_location_id ON location_shares(location_id);
CREATE INDEX idx_location_shares_token ON location_shares(share_token);

-- Update or create function to generate a share token
CREATE OR REPLACE FUNCTION generate_unique_share_token() RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;