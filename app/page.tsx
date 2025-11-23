'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, MessageWithTimer } from '@/types/message';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import MessageInput from '@/components/MessageInput';
import MessageHistory from '@/components/MessageHistory';
import { calculateReadingTime } from '@/lib/utils';

export default function Home() {
  const [messages, setMessages] = useState<MessageWithTimer[]>([]);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch message history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setHistoryMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleSend = async (text: string) => {
    try {
      // Show typing indicator immediately
      setIsTyping(true);

      // Create message in database
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage: Message = await response.json();
      
      // Add to history
      setHistoryMessages((prev) => [newMessage, ...prev]);

      // Hide typing indicator and show message
      setIsTyping(false);

      // Calculate reading time
      const readingTime = calculateReadingTime(text);
      const fadeOutDuration = 500; // Fade out duration in milliseconds
      const fadeOutStartTime = readingTime - fadeOutDuration;

      // Add message to display
      const messageWithTimer: MessageWithTimer = {
        ...newMessage,
        isFading: false,
      };

      setMessages((prev) => [...prev, messageWithTimer]);

      // Start fade out animation
      const fadeTimer = setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, isFading: true } : msg
          )
        );
      }, fadeOutStartTime);

      // Remove message after reading time
      const timer = setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      }, readingTime);

      // Store timer references
      messageWithTimer.fadeTimer = fadeTimer;
      messageWithTimer.timer = timer;
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      messages.forEach((msg) => {
        if (msg.timer) {
          clearTimeout(msg.timer);
        }
        if (msg.fadeTimer) {
          clearTimeout(msg.fadeTimer);
        }
      });
    };
  }, []);

  // Combine current messages with history when history is shown
  // Filter out duplicates (messages that are currently displayed won't appear twice)
  const currentMessageIds = new Set(messages.map(msg => msg.id));
  const displayedMessages: MessageWithTimer[] = showHistory 
    ? [
        ...historyMessages
          .filter(msg => !currentMessageIds.has(msg.id))
          .map(msg => ({ ...msg, timer: undefined } as MessageWithTimer)),
        ...messages
      ]
    : messages;

  return (
    <div className="min-h-screen bg-[#00FF00] relative font-[Helvetica Neue]">
      {/* Message display area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-8 pb-24">
        <div className="flex flex-col space-y-4 max-w-[480px] mx-auto">
          {displayedMessages.map((message) => (
            <div key={message.id} className="flex justify-start items-center">
              <MessageBubble
                message={message}
                onDismiss={() => {
                  if (showHistory) {
                    // If showing history, just remove from current messages
                    setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
                  } else {
                    setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
                  }
                  if (message.timer) {
                    clearTimeout(message.timer);
                  }
                }}
              />
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input at bottom */}
      <MessageInput
        onSend={handleSend}
        isTyping={isTyping}
        onTypingChange={setIsTyping}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
      />
    </div>
  );
}
