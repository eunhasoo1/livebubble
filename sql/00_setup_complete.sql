-- Complete setup script - Run this file to set up everything at once
-- This combines all the individual SQL files for convenience

-- Step 1: Create the messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  displayed_at TIMESTAMP WITH TIME ZONE
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a policy that allows all operations
-- In production, you may want to restrict this based on authentication
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
CREATE POLICY "Allow all operations on messages"
  ON messages
  FOR ALL
  USING (true)
  WITH CHECK (true);



