/**
 * Topic Card Props Mappers
 * Maps normalized topic data to TopicCard component props for each category
 */

import { getMinWordsForLevel } from '../../config/writingConfig'

export const topicCardMappers = {
  grammar: (topic) => ({
    title: topic.title,
    description: topic.levelName,
    level: topic.level,
    difficulty: topic.difficulty,
    estimatedHours: topic.estimatedHours
  }),

  reading: (topic) => ({
    title: topic.title,
    description: topic.description,
    level: topic.level,
    questionCount: topic.questionCount
  }),

  listening: (topic) => ({
    title: topic.title,
    description: topic.description,
    level: topic.level,
    duration: topic.duration,
    questionCount: topic.questionCount
  }),

  writing: (topic) => ({
    title: topic.title,
    description: topic.hasVocabulary ? 'Includes vocabulary support' : 'Writing prompt',
    level: topic.level,
    wordCount: getMinWordsForLevel(topic.level)
  }),

  vocabulary: (topic) => ({
    title: topic.title,
    description: topic.levelDescription,
    level: topic.level,
    wordCount: topic.wordCount
  })
}
