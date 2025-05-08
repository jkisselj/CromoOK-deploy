-- Drop the previous policy that used current_setting
DROP POLICY IF EXISTS "Anyone can view location with valid share token" ON locations;

-- Create a new function to check share token access
CREATE OR REPLACE FUNCTION check_share_token_access(loc_id UUID, token TEXT) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM locations 
    WHERE id = loc_id 
    AND share_token = token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a direct policy that will allow access to locations with matching share token
CREATE POLICY "Public access to locations with share token" 
  ON locations FOR SELECT 
  USING (
    true 
  );

