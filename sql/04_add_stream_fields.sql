-- Add stream_date and stream_title fields to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS stream_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS stream_title TEXT;

-- Create index on stream_date for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_stream_date ON messages(stream_date);

-- Create index on stream_title for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_stream_title ON messages(stream_title);


