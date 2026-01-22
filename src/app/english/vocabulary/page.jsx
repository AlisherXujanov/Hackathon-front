'use client'

import { useRouter } from 'next/navigation'
import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function VocabularyPage() {
  const router = useRouter()

  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.vocabulary}
      topicCardPropsMapper={topicCardMappers.vocabulary}
      onTopicClick={(topic) => {
        router.push(`/english/vocabulary/${topic.id}`)
      }}
    />
  )
}
