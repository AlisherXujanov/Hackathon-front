/**
 * Grammar Data Loader Utility
 * Loads grammar topic data and exercises by topic ID
 */

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

/**
 * Extract level from topic ID (e.g., "A1_001" -> "a1")
 * @param {string} topicId - Topic ID
 * @returns {string|null} Normalized level or null
 */
function extractLevelFromTopicId(topicId) {
  if (!topicId || typeof topicId !== 'string') return null
  
  const match = topicId.match(/^([A-Z]\d)_/i)
  if (!match) return null
  
  return match[1].toLowerCase()
}

/**
 * Load grammar topic data by topic ID
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @returns {Promise<Object|null>} Topic data or null if not found
 */
export async function loadGrammarTopic(topicId) {
  try {
    const level = extractLevelFromTopicId(topicId)
    if (!level || !LEVELS.includes(level)) {
      throw new Error(`Invalid topic ID format: ${topicId}`)
    }

    // Load the level JSON file
    const levelData = await import(`../../store/english/grammar/${level}.json`)
    const jsonData = levelData.default || levelData

    // Find the topic in core_grammar_topics
    const topics = jsonData.grammar_components?.core_grammar_topics || []
    const topic = topics.find(t => t.id === topicId)

    if (!topic) {
      console.warn(`Topic ${topicId} not found in ${level}.json`)
      return null
    }

    // Return topic with level metadata
    return {
      ...topic,
      level: jsonData.level,
      levelName: jsonData.level_name
    }
  } catch (error) {
    console.error(`Error loading grammar topic ${topicId}:`, error)
    return null
  }
}

/**
 * Load grammar exercises by topic ID
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @returns {Promise<Object|null>} Exercise data or null if not found
 */
export async function loadGrammarExercises(topicId) {
  try {
    const level = extractLevelFromTopicId(topicId)
    if (!level || !LEVELS.includes(level)) {
      throw new Error(`Invalid topic ID format: ${topicId}`)
    }

    // Load exercise file
    const exerciseData = await import(
      `../../store/english/grammar/exercises/${level}/${topicId}.json`
    )
    const jsonData = exerciseData.default || exerciseData

    return jsonData
  } catch (error) {
    // Exercise file might not exist for all topics
    console.warn(`Exercises not found for topic ${topicId}:`, error.message)
    return null
  }
}

/**
 * Load both topic and exercises data
 * @param {string} topicId - Topic ID
 * @returns {Promise<{topic: Object|null, exercises: Object|null}>}
 */
export async function loadGrammarTopicData(topicId) {
  const [topic, exercises] = await Promise.all([
    loadGrammarTopic(topicId),
    loadGrammarExercises(topicId)
  ])

  return { topic, exercises }
}
