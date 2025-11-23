# SQL Setup Files

This folder contains SQL scripts to set up your Supabase database for the Live Bubble overlay.

## Quick Start

Run the complete setup script:
- **`00_setup_complete.sql`** - Run this file in Supabase SQL Editor to set up everything at once

## Individual Files

If you prefer to run them separately:

1. **`01_create_messages_table.sql`** - Creates the messages table
2. **`02_enable_rls.sql`** - Enables Row Level Security
3. **`03_create_policy.sql`** - Creates the RLS policy to allow operations
4. **`04_add_stream_fields.sql`** - Adds stream_date and stream_title fields to messages table

## How to Run

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `00_setup_complete.sql` (or any individual file)
5. Click **Run** to execute

## Verification

After running the setup, you can verify by:
1. Going to **Table Editor** in Supabase
2. You should see the `messages` table listed
3. The table should have columns: `id`, `text`, `created_at`, `displayed_at`


