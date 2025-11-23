import { createClient } from '@supabase/supabase-js';
import { Message } from '@/types/message';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createMessage(text: string): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ text })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create message: ${error.message}`);
  }

  return data;
}

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return data || [];
}

