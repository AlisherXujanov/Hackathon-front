'use client'

const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']

function extractLevelFromTopicId(topicId) {
  if (!topicId || typeof topicId !== 'string') return null

  const match = topicId.match(/^([a-z]\d)_/i)
  if (!match) return null

  return match[1].toLowerCase()
}

export async function loadVocabularyTopic(topicId) {
  try {
    const level = extractLevelFromTopicId(topicId)
    if (!level || !LEVELS.includes(level)) {
      throw new Error(`Invalid topic ID format: ${topicId}`)
    }

    const levelData = await import(`../../store/english/vocabulary/${level}.json`)
    const jsonData = levelData.default || levelData

    const topics = jsonData.vocabulary_topics || []
    const topic = topics.find((t) => t.id === topicId)

    if (!topic) {
      console.warn(`Vocabulary topic ${topicId} not found in ${level}.json`)
      return null
    }

    return {
      ...topic,
      level: jsonData.level,
      levelDescription: jsonData.level_description
    }
  } catch (error) {
    console.error(`Error loading vocabulary topic ${topicId}:`, error)
    return null
  }
}

export async function loadVocabularyTopicData(topicId) {
  const topic = await loadVocabularyTopic(topicId)
  return { topic }
}
