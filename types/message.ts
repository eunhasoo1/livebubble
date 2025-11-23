export interface Message {
  id: string;
  text: string;
  created_at: string;
  displayed_at?: string | null;
}

export interface MessageWithTimer extends Message {
  timer?: NodeJS.Timeout;
  fadeTimer?: NodeJS.Timeout;
  isFading?: boolean;
}

