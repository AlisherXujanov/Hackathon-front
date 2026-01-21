'use client'

import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function GrammarPage() {
  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.grammar}
      topicCardPropsMapper={topicCardMappers.grammar}
      onTopicClick={(topic) => {
        // TODO: Navigate to topic detail page
        console.log('Topic clicked:', topic)
      }}
    />
  )
}
