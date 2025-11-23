'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { IoArrowUpOutline, IoTimeOutline, IoCreateOutline } from 'react-icons/io5';

interface MessageInputProps {
  onSend: (text: string) => void;
  isTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
  showHistory: boolean;
  onToggleHistory: () => void;
  streamTitle: string;
  onOpenStreamTitleModal: () => void;
}

export default function MessageInput({ onSend, isTyping, onTypingChange, showHistory, onToggleHistory, streamTitle, onOpenStreamTitleModal }: MessageInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    // Remove only leading and trailing whitespace, but preserve line breaks
    const trimmed = input.replace(/^\s+|\s+$/g, '');
    if (trimmed) {
      onSend(trimmed);
      setInput('');
      onTypingChange(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter allows line breaks (default behavior)
  };

  const handleChange = (value: string) => {
    setInput(value);
    onTypingChange(value.trim().length > 0);
  };

  return (
    <div className="bg-[#00FF00] px-4 py-1 pb-6 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-[480px] mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHistory}
            className={`flex-shrink-0 rounded-full p-1.5 transition-colors ${
              showHistory 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={showHistory ? 'Hide History' : 'Show History'}
          >
            <IoTimeOutline size={18} />
          </button>
          <button
            type="button"
            onClick={onOpenStreamTitleModal}
            className={`flex-shrink-0 rounded-full p-1.5 transition-colors ${
              streamTitle 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={streamTitle || 'Set Stream Title'}
          >
            <IoCreateOutline size={18} />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="placeholder:font-light placeholder:text-sm input-rounded w-full border-gray-200 border-[1px] p-1.5 pl-3 pr-12 bg-white resize-none overflow-y-auto leading-5 h-[38px]"
            />
            <button 
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[var(--send-bg)] rounded-full p-1.5 hover:opacity-90 transition-opacity send-button"
              disabled={!input.trim()}
            >
              <IoArrowUpOutline size={18} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


