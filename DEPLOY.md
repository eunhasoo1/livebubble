# Deploy to Vercel via GitHub

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `livebubble` (or your preferred name)
3. Choose Public or Private
4. **DO NOT** check "Initialize this repository with a README"
5. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/livebubble.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Or if you prefer SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/livebubble.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your `livebubble` repository
5. Vercel will auto-detect Next.js settings
6. **Important**: Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
7. Click "Deploy"

## Step 4: Get Your Vercel URL

After deployment, Vercel will give you a URL like:
`https://livebubble.vercel.app`

You can use this URL in OBS as a Browser Source!

## Environment Variables in Vercel

Make sure to add these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are found in your Supabase project settings under API.


