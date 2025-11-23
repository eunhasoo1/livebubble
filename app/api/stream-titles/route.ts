import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      );
    }

    // Get distinct stream titles, ordered by most recent first
    const { data, error } = await supabase
      .from('messages')
      .select('stream_title, created_at')
      .not('stream_title', 'is', null)
      .neq('stream_title', '')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stream titles', details: error.message },
        { status: 500 }
      );
    }

    // Get unique stream titles (most recent first)
    const titleMap = new Map<string, { stream_title: string; created_at: string }>();
    
    (data || []).forEach((item: { stream_title: string | null; created_at: string }) => {
      if (item.stream_title && !titleMap.has(item.stream_title)) {
        titleMap.set(item.stream_title, item as { stream_title: string; created_at: string });
      }
    });

    const uniqueTitles = Array.from(titleMap.values())
      .map(item => item.stream_title)
      .slice(0, 1); // Limit to 1 most recent title

    return NextResponse.json(uniqueTitles || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

