/**
 * Text Comparison Utilities for Speaking Practice
 * Compares transcribed text with original text and calculates accuracy
 */

/**
 * Normalize text for comparison
 * - Convert to lowercase
 * - Remove punctuation
 * - Normalize whitespace
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeText(text) {
  if (typeof text !== 'string') return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:()\[\]"'`-]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Split text into words array
 * @param {string} text - Text to split
 * @returns {Array<string>} Array of words
 */
function splitWords(text) {
  const normalized = normalizeText(text)
  return normalized.split(' ').filter(word => word.length > 0)
}

/**
 * Calculate accuracy percentage
 * @param {string} original - Original text
 * @param {string} transcribed - Transcribed text
 * @returns {number} Accuracy percentage (0-100)
 */
export function calculateAccuracy(original, transcribed) {
  if (!original || !transcribed) return 0

  const originalWords = splitWords(original)
  const transcribedWords = splitWords(transcribed)

  if (originalWords.length === 0) return 100

  // Count matching words
  let correctCount = 0
  const transcribedCopy = [...transcribedWords]

  for (const word of originalWords) {
    const index = transcribedCopy.indexOf(word)
    if (index !== -1) {
      correctCount++
      transcribedCopy.splice(index, 1) // Remove matched word
    }
  }

  return Math.round((correctCount / originalWords.length) * 100)
}

/**
 * Find missing words (words in original but not in transcribed)
 * @param {string} original - Original text
 * @param {string} transcribed - Transcribed text
 * @returns {Array<string>} Array of missing words
 */
export function findMissingWords(original, transcribed) {
  if (!original || !transcribed) return []

  const originalWords = splitWords(original)
  const transcribedWords = splitWords(transcribed)
  const missing = []

  for (const word of originalWords) {
    if (!transcribedWords.includes(word)) {
      if (!missing.includes(word)) {
        missing.push(word)
      }
    }
  }

  return missing
}

/**
 * Find incorrect words (words in transcribed but not in original)
 * @param {string} original - Original text
 * @param {string} transcribed - Transcribed text
 * @returns {Array<string>} Array of incorrect words
 */
export function findIncorrectWords(original, transcribed) {
  if (!original || !transcribed) return []

  const originalWords = splitWords(original)
  const transcribedWords = splitWords(transcribed)
  const incorrect = []

  for (const word of transcribedWords) {
    if (!originalWords.includes(word)) {
      if (!incorrect.includes(word)) {
        incorrect.push(word)
      }
    }
  }

  return incorrect
}

/**
 * Compare texts and return detailed analysis
 * @param {string} original - Original text
 * @param {string} transcribed - Transcribed text
 * @returns {Object} Analysis result with word-by-word comparison
 */
export function compareTexts(original, transcribed) {
  if (!original || !transcribed) {
    return {
      accuracy: 0,
      totalWords: 0,
      correctWords: 0,
      incorrectWords: 0,
      missingWords: [],
      incorrectWordsList: [],
      wordComparison: []
    }
  }

  const originalWords = splitWords(original)
  const transcribedWords = splitWords(transcribed)
  const missingWords = findMissingWords(original, transcribed)
  const incorrectWordsList = findIncorrectWords(original, transcribed)
  const accuracy = calculateAccuracy(original, transcribed)

  // Create word-by-word comparison
  const wordComparison = []
  const transcribedCopy = [...transcribedWords]

  for (let i = 0; i < originalWords.length; i++) {
    const originalWord = originalWords[i]
    const transcribedIndex = transcribedCopy.indexOf(originalWord)
    
    if (transcribedIndex !== -1) {
      // Word found - mark as correct
      wordComparison.push({
        original: originalWord,
        transcribed: originalWord,
        status: 'correct',
        index: i
      })
      transcribedCopy.splice(transcribedIndex, 1)
    } else {
      // Word not found - mark as missing
      wordComparison.push({
        original: originalWord,
        transcribed: null,
        status: 'missing',
        index: i
      })
    }
  }

  // Add remaining transcribed words as incorrect
  for (const word of transcribedCopy) {
    wordComparison.push({
      original: null,
      transcribed: word,
      status: 'incorrect',
      index: -1
    })
  }

  const correctWords = wordComparison.filter(w => w.status === 'correct').length

  return {
    accuracy,
    totalWords: originalWords.length,
    correctWords,
    incorrectWords: wordComparison.filter(w => w.status === 'incorrect').length,
    missingWords,
    incorrectWordsList,
    wordComparison
  }
}

/**
 * Format text with color coding for display
 * @param {string} original - Original text
 * @param {Object} comparison - Comparison result from compareTexts
 * @returns {Array<Object>} Array of text segments with status
 */
export function formatTextWithComparison(original, comparison) {
  if (!original || !comparison) return []

  const originalWords = splitWords(original)
  const segments = []

  for (let i = 0; i < originalWords.length; i++) {
    const word = originalWords[i]
    const comparisonItem = comparison.wordComparison.find(
      item => item.original === word && item.index === i
    )

    segments.push({
      text: word,
      status: comparisonItem?.status || 'missing',
      index: i
    })
  }

  return segments
}
