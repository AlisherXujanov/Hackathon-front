'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function ReadingPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.reading}
      topicCardPropsMapper={topicCardMappers.reading}
      onTopicClick={(topic) => {
        // TODO: Navigate to reading passage detail page
        console.log('Topic clicked:', topic)
      }}
    />
  )
}
