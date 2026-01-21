/**
 * Data Loader Utility for English Learning Content
 * Loads and normalizes JSON data from different categories
 * Refactored to use unified pattern with category-specific transformers
 */

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

/**
 * Normalize level string to lowercase
 * @param {string} level - Level string
 * @returns {string} Normalized level
 */
function normalizeLevel(level) {
  return level.toLowerCase()
}

/**
 * Validate level string
 * @param {string} level - Level to validate
 * @returns {boolean} True if valid
 */
function validateLevel(level) {
  const normalized = normalizeLevel(level)
  return LEVELS.includes(normalized)
}

/**
 * Safe array extraction from data
 * @param {*} data - Data object
 * @param {string} path - Path to array (e.g., 'grammar_components.core_grammar_topics')
 * @returns {Array} Extracted array or empty array
 */
function extractArrayData(data, path) {
  const keys = path.split('.')
  let current = data
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return []
    }
  }
  
  return Array.isArray(current) ? current : []
}

/**
 * Safe nested data extraction
 * @param {*} data - Data object
 * @param {string} path - Path to data
 * @returns {*} Extracted data or null
 */
function extractNestedData(data, path) {
  const keys = path.split('.')
  let current = data
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return null
    }
  }
  
  return current
}

/**
 * Category-specific data transformers
 */
const transformers = {
  grammar: (data, normalizedLevel) => {
    const topics = extractArrayData(data, 'grammar_components.core_grammar_topics')
    return topics.map(topic => ({
      id: topic.id,
      title: topic.topic,
      level: data.level,
      levelName: data.level_name,
      difficulty: topic.difficulty,
      priority: topic.priority,
      estimatedHours: topic.estimated_hours,
      category: 'grammar'
    }))
  },

  reading: (data, normalizedLevel) => {
    if (!Array.isArray(data)) return []
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.about_passage || '',
      level: item.level || normalizedLevel.toUpperCase(),
      category: 'reading',
      passage: item.passage,
      questionCount: item.questions?.length || 0
    }))
  },

  listening: (data, normalizedLevel) => {
    if (!Array.isArray(data)) return []
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.topic || '',
      level: item.level || normalizedLevel.toUpperCase(),
      category: 'listening',
      duration: item.durationInMinutes,
      questionCount: item.multiple_choice?.length || 0
    }))
  },

  writing: (data, normalizedLevel) => {
    if (!Array.isArray(data)) return []
    return data.map(item => ({
      id: item.id,
      title: item.topic,
      level: normalizedLevel.toUpperCase(),
      category: 'writing',
      hasVocabulary: !!item.relatedVocabulary
    }))
  },

  vocabulary: (data, normalizedLevel) => {
    const topics = extractArrayData(data, 'vocabulary_topics')
    return topics.map(topic => ({
      id: topic.id,
      title: topic.topic,
      level: data.level,
      levelDescription: data.level_description,
      category: 'vocabulary',
      wordCount: topic.words?.length || 0,
      hasImage: !!topic.image
    }))
  }
}

/**
 * Unified loader function
 * @param {string} category - Category name (grammar, reading, listening, writing, vocabulary)
 * @param {string} level - Level (a1, a2, b1, b2, c1, c2)
 * @returns {Promise<Array>} Normalized topics array
 */
export async function loadCategoryTopics(category, level) {
  try {
    const normalizedLevel = normalizeLevel(level)
    
    if (!validateLevel(level)) {
      throw new Error(`Invalid level: ${level}`)
    }

    const transformer = transformers[category.toLowerCase()]
    if (!transformer) {
      throw new Error(`Unknown category: ${category}`)
    }

    // Dynamic import based on category and level
    const data = await import(`../../store/english/${category}/${normalizedLevel}.json`)
    const jsonData = data.default || data
    
    return transformer(jsonData, normalizedLevel)
  } catch (error) {
    console.error(`Error loading ${category} topics for ${level}:`, error)
    return []
  }
}

// Individual loader functions for backward compatibility and direct usage
export async function loadGrammarTopics(level) {
  return loadCategoryTopics('grammar', level)
}

export async function loadReadingTopics(level) {
  return loadCategoryTopics('reading', level)
}

export async function loadListeningTopics(level) {
  return loadCategoryTopics('listening', level)
}

export async function loadWritingTopics(level) {
  return loadCategoryTopics('writing', level)
}

export async function loadVocabularyTopics(level) {
  return loadCategoryTopics('vocabulary', level)
}

/**
 * Load all topics for a category and level (alias for loadCategoryTopics)
 * @param {string} category - Category (grammar, reading, listening, writing, vocabulary)
 * @param {string} level - Level (a1, a2, b1, b2, c1, c2)
 * @returns {Promise<Array>} Normalized topics array
 */
export async function loadTopics(category, level) {
  return loadCategoryTopics(category, level)
}

/**
 * Get available levels for a category
 * @param {string} category - Category name
 * @returns {Array<string>} Available levels
 */
export function getAvailableLevels(category) {
  return LEVELS.map(l => l.toUpperCase())
}
