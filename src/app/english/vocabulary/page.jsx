'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function VocabularyPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.vocabulary}
      topicCardPropsMapper={topicCardMappers.vocabulary}
      onTopicClick={(topic) => {
        // TODO: Navigate to vocabulary topic detail page
        console.log('Topic clicked:', topic)
      }}
    />
  )
}
