'use client'

import { useRouter } from 'next/navigation'
import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function SpeakingPage() {
  const router = useRouter()

  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.speaking}
      topicCardPropsMapper={topicCardMappers.speaking}
      onTopicClick={(topic) => {
        router.push(`/english/speaking/${topic.id}`)
      }}
    />
  )
}
