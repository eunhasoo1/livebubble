'use client';

export default function TypingIndicator() {
  return (
    <div className="message-bubble message-bubble-receive">
      <div className="flex gap-1.5 items-center">
        <div 
          className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }}
        ></div>
        <div 
          className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }}
        ></div>
        <div 
          className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
}

