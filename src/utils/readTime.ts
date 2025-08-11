/**
 * Calculate estimated read time for a given text content
 * Based on average reading speed of 200-250 words per minute
 */
export const calculateReadTime = (content: string, wordsPerMinute = 225): string => {
  if (!content) return "1 min read";

  // Remove HTML tags if present
  const cleanText = content.replace(/<[^>]*>/g, '');
  
  // Split by whitespace and filter out empty strings
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  // Ensure minimum read time is 1 minute
  const readTime = Math.max(1, minutes);
  
  return `${readTime} min read`;
};

/**
 * Get word count from content
 */
export const getWordCount = (content: string): number => {
  if (!content) return 0;
  
  const cleanText = content.replace(/<[^>]*>/g, '');
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 0);
    
  return words.length;
};