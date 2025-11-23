'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Message, MessageWithTimer } from '@/types/message';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import MessageInput from '@/components/MessageInput';
import MessageHistory from '@/components/MessageHistory';
import StreamTitleModal from '@/components/StreamTitleModal';
import TimeDivider from '@/components/TimeDivider';
import { calculateReadingTime } from '@/lib/utils';

export default function Home() {
  const [messages, setMessages] = useState<MessageWithTimer[]>([]);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [streamTitle, setStreamTitle] = useState<string>('');
  const [showStreamTitleModal, setShowStreamTitleModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Don't load stream title from localStorage - it should be empty on refresh

  // Fetch message history when stream title or date changes
  useEffect(() => {
    fetchHistory();
  }, [streamTitle]);

  const fetchHistory = async () => {
    try {
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Build query parameters
      const params = new URLSearchParams({
        stream_date: today,
      });
      
      // Add stream_title if it exists
      if (streamTitle) {
        params.append('stream_title', streamTitle);
      } else {
        // If no title, filter for null or empty stream_title
        params.append('stream_title', '');
      }

      const response = await fetch(`/api/messages?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setHistoryMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleSend = async (text: string, titleOverride?: string) => {
    // Use provided title or current streamTitle
    const titleToUse = titleOverride || streamTitle;
    
    // Check if stream title is set
    if (!titleToUse || titleToUse.trim() === '') {
      // Store the message and show modal
      setPendingMessage(text);
      setShowStreamTitleModal(true);
      return;
    }

    // If there was a pending message, use it; otherwise use the current text
    const messageToSend = pendingMessage || text;
    setPendingMessage(null);

    try {
      // Show typing indicator immediately
      setIsTyping(true);

      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Create message in database
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: messageToSend,
          stream_date: today,
          stream_title: titleToUse
        }),
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
      const readingTime = calculateReadingTime(messageToSend);
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

  // Add time dividers between messages
  const messagesWithDividers = useMemo(() => {
    if (displayedMessages.length === 0) return [];

    // Sort messages by created_at (oldest first for display)
    const sortedMessages = [...displayedMessages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Get first message time as reference
    const firstMessageTime = new Date(sortedMessages[0].created_at).getTime();
    
    const result: Array<{ type: 'message' | 'divider'; data: MessageWithTimer | number }> = [];
    let lastDividerMinutes = -1;
    const DIVIDER_INTERVAL = 1; // Show divider every 1 minute

    sortedMessages.forEach((message, index) => {
      const messageTime = new Date(message.created_at).getTime();
      const minutesAgo = Math.floor((messageTime - firstMessageTime) / (1000 * 60));

      // Add divider if enough time has passed since last divider
      if (minutesAgo - lastDividerMinutes >= DIVIDER_INTERVAL) {
        result.push({ type: 'divider', data: minutesAgo });
        lastDividerMinutes = minutesAgo;
      }

      result.push({ type: 'message', data: message });
    });

    return result;
  }, [displayedMessages]);

  const handleSaveStreamTitle = (title: string) => {
    setStreamTitle(title);
    // Don't save to localStorage - should be empty on refresh
    // History will be refreshed automatically via useEffect when streamTitle changes
    
    // If there's a pending message, send it automatically with the new title
    if (pendingMessage) {
      const messageToSend = pendingMessage;
      setPendingMessage(null);
      // Use the title parameter directly to avoid state update delay
      handleSend(messageToSend, title);
    }
  };

  const handleCloseStreamTitleModal = () => {
    setShowStreamTitleModal(false);
    // Clear pending message if modal is closed without saving
    if (pendingMessage) {
      setPendingMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#00FF00] relative font-[Helvetica Neue]">
      {/* Stream title modal */}
      <StreamTitleModal
        isOpen={showStreamTitleModal}
        onClose={handleCloseStreamTitleModal}
        currentTitle={streamTitle}
        onSave={handleSaveStreamTitle}
      />

      {/* Message display area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pr-32 md:px-8 pb-24">
        <div className="flex flex-col space-y-2 max-w-[480px] mx-auto">
          {messagesWithDividers.map((item, index) => {
            if (item.type === 'divider') {
              return (
                <TimeDivider 
                  key={`divider-${index}-${item.data}`} 
                  minutesAgo={item.data as number} 
                />
              );
            } else {
              const message = item.data as MessageWithTimer;
              return (
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
              );
            }
          })}
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
        streamTitle={streamTitle}
        onOpenStreamTitleModal={() => setShowStreamTitleModal(true)}
      />
    </div>
  );
}
