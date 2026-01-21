'use client'

import { useRouter } from 'next/navigation'
import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function GrammarPage() {
  const router = useRouter()

  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.grammar}
      topicCardPropsMapper={topicCardMappers.grammar}
      onTopicClick={(topic) => {
        router.push(`/english/grammar/${topic.id}`)
      }}
    />
  )
}
