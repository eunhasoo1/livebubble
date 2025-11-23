'use client';

import { MessageWithTimer } from '@/types/message';

interface MessageBubbleProps {
  message: MessageWithTimer;
  onDismiss?: () => void;
}

export default function MessageBubble({ message, onDismiss }: MessageBubbleProps) {
  return (
    <div className={`message-bubble message-bubble-receive ${
      message.isFading ? 'animate-fade-out' : 'animate-fade-in'
    }`}>
      <p className="text-[17px] leading-[1.4] font-normal m-0">
        {message.text}
      </p>
    </div>
  );
}


