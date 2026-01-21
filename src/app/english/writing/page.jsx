'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function WritingPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.writing}
      topicCardPropsMapper={topicCardMappers.writing}
      onTopicClick={(topic) => {
        // TODO: Navigate to writing prompt detail page
        console.log('Topic clicked:', topic)
      }}
    />
  )
}
