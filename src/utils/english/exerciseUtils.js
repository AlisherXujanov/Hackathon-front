/**
 * Exercise Utility Functions
 * Shared utilities for exercise components
 */

/**
 * Normalize answer for comparison (trim, lowercase, remove punctuation)
 * @param {string} answer - Answer to normalize
 * @returns {string} Normalized answer
 */
export function normalizeAnswer(answer) {
  if (!answer || typeof answer !== 'string') return ''
  return answer.trim().toLowerCase().replace(/[.,;:!?]/g, '')
}

/**
 * Get exercise type display label
 * @param {string} type - Exercise type ('multiple_choice', 'short_answer', 'multiple_gap_filling')
 * @returns {string} Display label
 */
export function getExerciseTypeLabel(type) {
  const typeMap = {
    multiple_choice: 'Multiple Choice',
    short_answer: 'Short Answer',
    multiple_gap_filling: 'Gap Filling'
  }
  return typeMap[type] || type
}

/**
 * Check if answer matches correct answer (handles multiple correct answers separated by /)
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer(s), can be multiple separated by /
 * @returns {boolean} True if answer is correct
 */
export function isAnswerCorrect(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false
  
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedCorrect = normalizeAnswer(correctAnswer)
  
  // Handle multiple correct answers (separated by /)
  const correctOptions = correctAnswer.split('/').map(opt => normalizeAnswer(opt.trim()))
  
  return correctOptions.includes(normalizedUser) || normalizedUser === normalizedCorrect
}

/**
 * Validate that all required fields are filled
 * @param {Object} answers - Object with answer fields
 * @param {Array} requiredFields - Array of required field keys
 * @returns {boolean} True if all required fields are filled
 */
export function validateRequiredFields(answers, requiredFields) {
  if (!answers || !requiredFields) return false
  return requiredFields.every(field => {
    const value = answers[field]
    return value !== null && value !== undefined && String(value).trim().length > 0
  })
}
