'use client';

import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface StreamTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  onSave: (title: string) => void;
}

export default function StreamTitleModal({ isOpen, onClose, currentTitle, onSave }: StreamTitleModalProps) {
  const [title, setTitle] = useState(currentTitle);
  const [previousTitles, setPreviousTitles] = useState<string[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(false);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  // Fetch previous stream titles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPreviousTitles();
    }
  }, [isOpen]);

  const fetchPreviousTitles = async () => {
    setLoadingTitles(true);
    try {
      const response = await fetch('/api/stream-titles');
      if (response.ok) {
        const data = await response.json();
        setPreviousTitles(data);
      }
    } catch (error) {
      console.error('Failed to fetch previous titles:', error);
    } finally {
      setLoadingTitles(false);
    }
  };

  const handleTitleClick = (clickedTitle: string) => {
    setTitle(clickedTitle);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#00FF00] bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Stream Title</h2>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoCloseOutline size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Previous title */}
          {previousTitles.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => handleTitleClick(previousTitles[0])}
                className="w-full px-4 py-2.5 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700 border border-gray-200"
              >
                <span className="text-xs text-gray-500 block mb-0.5">Previous</span>
                <span className="font-medium">{previousTitles[0]}</span>
              </button>
            </div>
          )}

          {/* Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter stream title..."
            className="w-full px-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-[#0B93F6] text-white rounded-xl hover:bg-[#0A7ED6] transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

