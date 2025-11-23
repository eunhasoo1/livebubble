'use client';

interface MessageHistoryProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MessageHistory({ isOpen, onToggle }: MessageHistoryProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors shadow-lg"
    >
      {isOpen ? 'Hide History' : 'Show History'}
    </button>
  );
}

