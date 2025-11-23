# Supabase Setup Instructions

Follow these steps to set up your Supabase database for the Live Bubble overlay.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account or log in if you already have one

## Step 2: Create a New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in the project details:
   - **Name**: Choose a name (e.g., "livebubble")
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Choose the region closest to you
3. Click "Create new project"
4. Wait for the project to be set up (this may take a few minutes)

## Step 3: Create the Messages Table

1. Once your project is ready, go to the **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy and paste the following SQL:

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  displayed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for simplicity)
-- In production, you may want to restrict this based on authentication
CREATE POLICY "Allow all operations on messages"
  ON messages
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click "Run" to execute the query
5. You should see a success message

## Step 4: Get Your API Keys

1. Go to **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 5: Configure Your Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Save the file

## Step 6: Verify the Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`
3. Try sending a message - it should be saved to your Supabase database

4. To verify messages are being saved:
   - Go back to Supabase dashboard
   - Navigate to **Table Editor** in the left sidebar
   - Click on the `messages` table
   - You should see your messages appear there

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env.local` file exists in the project root
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your Next.js dev server after adding/changing environment variables

### "Failed to create message" error
- Check that the `messages` table exists in your Supabase project
- Verify that Row Level Security policies are set up correctly
- Check the browser console and Supabase logs for more details

### Messages not appearing in database
- Check the Network tab in browser DevTools to see if API calls are failing
- Verify your API keys are correct
- Make sure RLS policies allow INSERT operations

## Security Note

The current setup uses a permissive RLS policy that allows all operations. For production use, you should:
- Implement proper authentication
- Create more restrictive RLS policies
- Consider using the service role key only on the server side (not exposed to the client)

## Next Steps

Once your Supabase setup is complete, you can:
- Start using the overlay in your live streams
- View message history through the "Show History" button
- Customize the styling and behavior as needed

