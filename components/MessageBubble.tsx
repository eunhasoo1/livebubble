'use client';

import { MessageWithTimer } from '@/types/message';

interface MessageBubbleProps {
  message: MessageWithTimer;
  onDismiss?: () => void;
}

export default function MessageBubble({ message, onDismiss }: MessageBubbleProps) {
  // Check if message has line breaks
  const hasLineBreaks = message.text.includes('\n');
  
  return (
    <div className={`message-bubble message-bubble-receive ${
      message.isFading ? 'animate-fade-out' : 'animate-fade-in'
    } ${hasLineBreaks ? 'message-bubble-multiline' : ''}`}>
      <p className="text-[17px] leading-[1.4] font-normal m-0 whitespace-pre-wrap">
        {message.text}
      </p>
    </div>
  );
}


