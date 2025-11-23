'use client';

interface TimeDividerProps {
  minutesAgo: number;
}

export default function TimeDivider({ minutesAgo }: TimeDividerProps) {
  const getTimeText = (minutes: number): string => {
    if (minutes === 0) {
      return 'Just now';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      if (hours === 1) {
        return '1 hour ago';
      } else {
        return `${hours} hours ago`;
      }
    }
  };

  return (
    <div className="flex items-center justify-center my-3">
      <span className="text-xs text-white font-normal">
        {getTimeText(minutesAgo)}
      </span>
    </div>
  );
}

