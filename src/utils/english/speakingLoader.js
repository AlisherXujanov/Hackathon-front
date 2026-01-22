/**
 * Speaking Loader Utility
 * Loads speaking topics from JSON files
 */

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

/**
 * Extract level from topic ID (e.g., "myself_family" -> "a1")
 * For speaking, we'll need to check the level from the data itself
 */
function extractLevelFromTopicId(topicId) {
  // For speaking topics, we'll search through levels
  // This is a fallback - actual level comes from data
  return null
}

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
 * Load speaking topics for a specific level
 * @param {string} level - Level (a1, a2, b1, b2, c1, c2)
 * @returns {Promise<Array>} Array of normalized topics
 */
export async function loadSpeakingTopics(level) {
  try {
    const normalizedLevel = normalizeLevel(level)
    
    if (!validateLevel(level)) {
      throw new Error(`Invalid level: ${level}`)
    }

    // Dynamic import based on level
    const data = await import(`../../store/english/speaking/${normalizedLevel}.json`)
    const jsonData = data.default || data
    
    // Extract topics array
    const topics = jsonData.topics || []
    
    // Normalize topics structure
    return topics.map(topic => ({
      id: topic.id,
      title: topic.title,
      level: topic.level || normalizedLevel.toUpperCase(),
      estimatedTime: topic.estimatedTime || '',
      category: 'speaking',
      hasPart1: !!topic.part1,
      hasPart2: !!topic.part2,
      hasPart3: !!topic.part3
    }))
  } catch (error) {
    console.error(`Error loading speaking topics for ${level}:`, error)
    return []
  }
}

/**
 * Load a specific speaking topic by ID
 * @param {string} topicId - Topic ID (e.g., "myself_family")
 * @param {string} level - Level (optional, will search if not provided)
 * @returns {Promise<Object|null>} Topic data or null if not found
 */
export async function loadSpeakingTopic(topicId, level = null) {
  try {
    // If level is provided, search only in that level
    if (level) {
      const normalizedLevel = normalizeLevel(level)
      if (!validateLevel(level)) {
        throw new Error(`Invalid level: ${level}`)
      }

      const levelData = await import(`../../store/english/speaking/${normalizedLevel}.json`)
      const jsonData = levelData.default || levelData
      
      const topics = jsonData.topics || []
      const topic = topics.find(t => t.id === topicId)
      
      if (!topic) {
        console.warn(`Speaking topic ${topicId} not found in ${level}.json`)
        return null
      }

      return {
        ...topic,
        level: jsonData.level || normalizedLevel.toUpperCase()
      }
    }

    // If level is not provided, search through all levels
    for (const lvl of LEVELS) {
      try {
        const levelData = await import(`../../store/english/speaking/${lvl}.json`)
        const jsonData = levelData.default || levelData
        
        const topics = jsonData.topics || []
        const topic = topics.find(t => t.id === topicId)
        
        if (topic) {
          return {
            ...topic,
            level: jsonData.level || lvl.toUpperCase()
          }
        }
      } catch (err) {
        // Continue searching in next level
        continue
      }
    }

    console.warn(`Speaking topic ${topicId} not found in any level`)
    return null
  } catch (error) {
    console.error(`Error loading speaking topic ${topicId}:`, error)
    return null
  }
}
