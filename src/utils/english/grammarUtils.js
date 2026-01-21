/**
 * Grammar Utility Functions
 * Shared utility functions for grammar-related components
 */

/**
 * Get difficulty label based on difficulty score (1-6 scale)
 * @param {number} difficulty - Difficulty score (1-6)
 * @returns {string} Difficulty label ('Beginner', 'Intermediate', or 'Advanced')
 */
export function getDifficultyLabel(difficulty) {
  if (!difficulty || typeof difficulty !== 'number') return null
  if (difficulty <= 2) return 'Beginner'
  if (difficulty <= 4) return 'Intermediate'
  return 'Advanced'
}

/**
 * Get badge variant color based on difficulty score
 * @param {number} difficulty - Difficulty score (1-6)
 * @returns {string} Badge variant ('success', 'warning', or 'error')
 */
export function getDifficultyColor(difficulty) {
  if (!difficulty || typeof difficulty !== 'number') return 'primary'
  if (difficulty <= 2) return 'success'
  if (difficulty <= 4) return 'warning'
  return 'error'
}

/**
 * Get badge variant color based on priority
 * @param {string} priority - Priority level ('high', 'medium', 'low')
 * @returns {string} Badge variant ('error', 'warning', 'success', or 'primary')
 */
export function getPriorityColor(priority) {
  if (!priority || typeof priority !== 'string') return 'primary'
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'primary'
  }
}

/**
 * Get localized content with fallback
 * @param {Object} obj - Object containing localized content (e.g., { en: '...', ru: '...', uz: '...' })
 * @param {string} language - Target language code ('en', 'ru', 'uz')
 * @param {string} fallback - Fallback language code (default: 'en')
 * @returns {*} Localized content or fallback content
 */
export function getLocalizedContent(obj, language = 'en', fallback = 'en') {
  if (!obj || typeof obj !== 'object') return null
  return obj[language] || obj[fallback] || null
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirst(str) {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get localized array content with fallback
 * @param {Object} obj - Object containing localized arrays
 * @param {string} language - Target language code
 * @param {string} fallback - Fallback language code
 * @returns {Array} Localized array or empty array
 */
export function getLocalizedArray(obj, language = 'en', fallback = 'en') {
  if (!obj || typeof obj !== 'object') return []
  return obj[language] || obj[fallback] || []
}
