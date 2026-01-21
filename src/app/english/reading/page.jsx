'use client'

import { useRouter } from 'next/navigation'
import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function ReadingPage() {
  const router = useRouter()

  const handleTopicClick = (topic) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push(`/english/reading/${topic.id}`)
  }

  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.reading}
      topicCardPropsMapper={topicCardMappers.reading}
      onTopicClick={handleTopicClick}
    />
  )
}
