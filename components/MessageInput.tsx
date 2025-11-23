'use client';

import { useState, KeyboardEvent } from 'react';
import { IoArrowUpOutline, IoTimeOutline } from 'react-icons/io5';

interface MessageInputProps {
  onSend: (text: string) => void;
  isTyping: boolean;
  onTypingChange: (isTyping: boolean) => void;
  showHistory: boolean;
  onToggleHistory: () => void;
}

export default function MessageInput({ onSend, isTyping, onTypingChange, showHistory, onToggleHistory }: MessageInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onSend(trimmed);
      setInput('');
      onTypingChange(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="placeholder:font-light placeholder:text-sm input-rounded w-full border-gray-200 border-[1px] p-1.5 pl-3 pr-12 bg-white"
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


