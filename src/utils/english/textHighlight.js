/**
 * Text Highlighting Utility
 * Highlights text between single quotes with yellow background
 */

/**
 * Highlight text between single quotes with yellow background
 * @param {string} text - Text to process
 * @returns {Array|string} Array of React elements and strings, or original text if no matches
 */
export function highlightText(text) {
  if (!text || typeof text !== 'string') return text
  
  // Match text between single quotes (handles escaped quotes)
  const regex = /'([^']*)'/g
  const parts = []
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Add highlighted span only if content is not empty
    const content = match[1]
    if (content.trim().length > 0) {
      parts.push(
        <span key={parts.length} className="bg-yellow-100 text-yellow-900 px-1 rounded font-medium">
          {content}
        </span>
      )
    } else {
      // If empty quotes, just add them as plain text
      parts.push("''")
    }
    
    lastIndex = regex.lastIndex
  }
  
  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : text
}
