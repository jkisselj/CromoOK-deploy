-- Add policy for owners to see their own locations regardless of status
CREATE POLICY "Owners can view their own locations"
  ON locations FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);