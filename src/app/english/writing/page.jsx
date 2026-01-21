'use client'

import { useRouter } from 'next/navigation'
import EnglishCategoryPage from '../../../components/english/EnglishCategoryPage'
import { ENGLISH_CATEGORIES } from '../../../config/englishCategories'
import { topicCardMappers } from '../../../utils/english/topicMappers'

export default function WritingPage() {
  const router = useRouter()

  const handleTopicClick = (topic) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push(`/english/writing/${topic.id}`)
  }

  return (
    <EnglishCategoryPage
      category={ENGLISH_CATEGORIES.writing}
      topicCardPropsMapper={topicCardMappers.writing}
      onTopicClick={handleTopicClick}
    />
  )
}
