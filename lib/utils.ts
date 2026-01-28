/**
 * Calculate reading time in milliseconds based on message length
 * Average reading speed: ~200 words per minute (3.33 words per second)
 * Minimum reading time: 3 seconds
 * Additional buffer time: 1.5 seconds
 */
export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Average reading speed: 3.33 words per second
  const wordsPerSecond = 3.33;
  const baseTime = (wordCount / wordsPerSecond) * 1000; // Convert to milliseconds
  
  // Minimum 3 seconds, round to nearest 100ms
  const minTime = 3000;
  const calculatedTime = Math.max(minTime, baseTime);
  
  // Add 1.5 seconds buffer time
  const bufferTime = 1500;
  
  return Math.round((calculatedTime + bufferTime) / 100) * 100;
}

/**
 * Expand common abbreviations for clearer TTS output
 */
function expandAbbreviations(text: string): string {
  const replacements: Record<string, string> = {
    'idk': "I don't know",
    'btw': "by the way",
  };

  let expandedText = text;
  Object.entries(replacements).forEach(([abbr, full]) => {
    // Case insensitive replacement with word boundaries
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    expandedText = expandedText.replace(regex, full);
  });

  return expandedText;
}

/**
 * Fetch and play text-to-speech audio for a given text
 */
export async function playTTS(text: string): Promise<void> {
  const textToPlay = expandAbbreviations(text);
  
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textToPlay }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch TTS audio');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Cleanup URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };

    await audio.play();
  } catch (error) {
    console.error('TTS playback error:', error);
  }
}


