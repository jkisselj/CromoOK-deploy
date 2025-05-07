-- Add share_token column to locations table
ALTER TABLE locations ADD COLUMN share_token TEXT UNIQUE;

-- Create trigger function to generate random share token on insert
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  NEW.share_token = encode(gen_random_bytes(16), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to generate share_token on new location
CREATE TRIGGER set_share_token
BEFORE INSERT ON locations
FOR EACH ROW
WHEN (NEW.share_token IS NULL)
EXECUTE FUNCTION generate_share_token();

-- Update existing locations with share tokens if they don't have one
UPDATE locations SET share_token = encode(gen_random_bytes(16), 'hex') WHERE share_token IS NULL;

-- Add policy for accessing locations via share token
-- This allows anyone to view a location if they have the correct share token
CREATE POLICY "Anyone can view location with valid share token"
  ON locations FOR SELECT
  USING (share_token = current_setting('app.location_share_token', true));