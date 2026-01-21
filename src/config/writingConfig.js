/**
 * Writing Configuration
 * Contains minimum word count requirements for each CEFR level
 */

export const MIN_WORDS_BY_LEVEL = {
  A1: 35,
  A2: 50,
  B1: 150,
  B2: 200,
  C1: 250,
  C2: 300
}

/**
 * Get minimum word count for a given level
 * @param {string} level - CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns {number} Minimum word count requirement
 */
export function getMinWordsForLevel(level) {
  const normalizedLevel = level?.toUpperCase()
  return MIN_WORDS_BY_LEVEL[normalizedLevel] || MIN_WORDS_BY_LEVEL.B1
}
