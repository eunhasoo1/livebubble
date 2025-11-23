import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      );
    }

    const { text, stream_date, stream_title } = await request.json();

    // Remove only leading and trailing whitespace, but preserve line breaks
    const trimmedText = text.replace(/^\s+|\s+$/g, '');
    
    if (!text || typeof text !== 'string' || trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    const messageData: {
      text: string;
      stream_date?: string;
      stream_title?: string | null;
    } = {
      text: trimmedText,
    };

    // Add stream_date if provided, otherwise use current date
    if (stream_date) {
      messageData.stream_date = stream_date;
    }

    // Add stream_title if provided
    if (stream_title !== undefined) {
      messageData.stream_title = stream_title || null;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create message', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      );
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const streamDate = searchParams.get('stream_date');
    const streamTitle = searchParams.get('stream_title');

    // Build query
    let query = supabase
      .from('messages')
      .select('*');

    // Filter by stream_date if provided
    if (streamDate) {
      query = query.eq('stream_date', streamDate);
    }

    // Filter by stream_title if provided
    if (streamTitle !== null) {
      if (streamTitle === '') {
        // If empty string, filter for null or empty stream_title
        query = query.or('stream_title.is.null,stream_title.eq.');
      } else {
        query = query.eq('stream_title', streamTitle);
      }
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

