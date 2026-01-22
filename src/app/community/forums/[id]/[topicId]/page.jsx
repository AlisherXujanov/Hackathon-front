'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ScrollAnimation from '../../../../../components/ScrollAnimation'
import TopicDetail from '../../../../../components/community/TopicDetail'
import { communityService } from '../../../../../services/communityService'
import { HiArrowLeft } from 'react-icons/hi'

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id: forumId, topicId } = params
  const [topic, setTopic] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTopic()
  }, [topicId])

  const loadTopic = async () => {
    try {
      setIsLoading(true)
      const data = await communityService.getTopic(topicId)
      setTopic(data)
    } catch (error) {
      console.error('Ошибка при загрузке темы:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка темы...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!topic) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Тема не найдена</h1>
            <p className="text-slate-600 mb-6">Проверьте ссылку</p>
            <Link href={`/community/forums/${forumId}`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                Назад к темам
              </button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-6">
            <Link href={`/community/forums/${forumId}`}>
              <button className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к темам
              </button>
            </Link>
          </div>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <TopicDetail topic={topic} onCommentAdded={loadTopic} />
        </div>
      </div>
    </main>
  )
}
