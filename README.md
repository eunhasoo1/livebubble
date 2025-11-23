# Live Bubble - iMessage Overlay for Live Streams

A Next.js application that provides an iMessage-style message overlay for live streaming. Perfect for streamers who want to communicate with viewers without using the chat box.

## Features

- 🎨 **iMessage-style UI**: Beautiful grey message bubbles that match the iMessage aesthetic
- ⌨️ **Typing Indicator**: Shows animated "..." bubble while typing
- ⏱️ **Smart Auto-Dismiss**: Messages disappear based on reading time (calculated from message length)
- 📜 **Message History**: Toggle button to view all previous messages in a scrollable panel
- 💾 **Supabase Integration**: All messages are stored in Supabase database
- 🎥 **OBS Ready**: Transparent background perfect for OBS overlay

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

### Installation

1. Clone or navigate to this directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions)

4. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using with OBS

1. Open the overlay in a browser window
2. In OBS, add a **Browser Source**
3. Set the URL to your overlay (local or deployed)
4. Set the width and height to match your stream resolution
5. Enable **Shutdown source when not visible** (optional)
6. The transparent background will allow your stream content to show through

### For True Transparency

If you need true transparency (not just transparent background):
- Use OBS Browser Source with **Custom CSS** to ensure transparency
- Or use a browser extension that makes the window transparent
- Or deploy and use OBS's built-in transparency support

## How It Works

1. **Typing**: When you start typing, a grey bubble with animated "..." appears
2. **Sending**: Press Enter or click Send to send the message
3. **Display**: The message appears in an iMessage-style grey bubble
4. **Auto-Dismiss**: Messages automatically disappear after a calculated reading time (based on word count)
5. **History**: Click "Show History" to see all previous messages in a scrollable panel

## Reading Time Calculation

Messages automatically disappear based on reading time:
- Average reading speed: ~200 words per minute (3.33 words per second)
- Minimum display time: 3 seconds
- Longer messages stay visible longer

## Project Structure

```
livebubble/
├── app/
│   ├── api/messages/     # API routes for Supabase
│   ├── layout.tsx        # Root layout with transparent background
│   ├── page.tsx          # Main overlay page
│   └── globals.css       # Global styles
├── components/
│   ├── MessageBubble.tsx      # Individual message bubble
│   ├── TypingIndicator.tsx    # Animated typing indicator
│   ├── MessageInput.tsx       # Input field at bottom
│   └── MessageHistory.tsx     # History panel
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Reading time calculation
└── types/
    └── message.ts        # TypeScript types
```

## Environment Variables

Create a `.env.local` file with:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## Deployment

You can deploy this to Vercel, Netlify, or any platform that supports Next.js:

1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Add your environment variables in the platform's settings
4. Deploy!

## Customization

- **Message Position**: Edit `app/page.tsx` to change where messages appear
- **Styling**: Modify `app/globals.css` and component files for different colors/styles
- **Reading Time**: Adjust the calculation in `lib/utils.ts`

## License

MIT
