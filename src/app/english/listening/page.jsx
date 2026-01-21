'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function ListeningPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.listening}
      topicCardPropsMapper={topicCardMappers.listening}
      onTopicClick={(topic) => {
        // TODO: Navigate to listening exercise detail page
        console.log('Topic clicked:', topic)
      }}
    />
  )
}
