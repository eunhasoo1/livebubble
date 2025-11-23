-- Create a policy that allows all operations (for simplicity)
-- In production, you may want to restrict this based on authentication
CREATE POLICY "Allow all operations on messages"
  ON messages
  FOR ALL
  USING (true)
  WITH CHECK (true);


