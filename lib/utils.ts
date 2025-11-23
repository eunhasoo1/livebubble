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


