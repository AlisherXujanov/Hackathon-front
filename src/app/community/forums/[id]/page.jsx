'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '../../../../components/Card'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import TopicCard from '../../../../components/community/TopicCard'
import { communityService } from '../../../../services/communityService'
import { getForumById } from '../../../../store/community/communityData'
import { HiArrowLeft, HiPlus, HiSearch, HiChatAlt2 } from 'react-icons/hi'

export default function ForumTopicsPage() {
  const params = useParams()
  const router = useRouter()
  const forumId = params.id
  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const forum = useMemo(() => getForumById(forumId), [forumId])

  useEffect(() => {
    if (!forum) return
    loadTopics()
  }, [forumId])

  const loadTopics = async () => {
    try {
      setIsLoading(true)
      const data = await communityService.getForumTopics(forumId)
      setTopics(data.results || [])
    } catch (error) {
      console.error('Ошибка при загрузке тем:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = topics

    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.views - a.views)
    } else if (sortBy === 'replies') {
      filtered = [...filtered].sort((a, b) => b.replies - a.replies)
    }

    return filtered
  }, [topics, query, sortBy])

  if (!forum) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Форум не найден</h1>
            <p className="mt-2 text-slate-600">Проверьте ссылку</p>
            <div className="mt-6">
              <Button asChild variant="primary">
                <Link href="/community/forums">К списку форумов</Link>
              </Button>
            </div>
          </Card>
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
            <Link href="/community/forums">
              <button className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад к форумам
              </button>
            </Link>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                style={{ backgroundColor: `${forum.color}20` }}
              >
                {forum.icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{forum.name}</h1>
                <p className="text-slate-600">{forum.description}</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <Card variant="glass" className="p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Поиск тем..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<HiSearch className="w-5 h-5" />}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border border-app-border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Новые</option>
                <option value="popular">Популярные</option>
                <option value="replies">Больше ответов</option>
              </select>
            </div>
          </Card>
        </ScrollAnimation>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-600">
            Найдено: <span className="font-semibold text-slate-900">{filteredAndSorted.length}</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<HiPlus />}
            onClick={() => router.push(`/community/create?forum=${forumId}`)}
            className="rounded-xl"
          >
            Создать тему
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка тем...</p>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-12 text-center">
              <HiChatAlt2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Темы не найдены</h3>
              <p className="text-slate-600 mb-6">Создайте первую тему в этом форуме</p>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<HiPlus />}
                onClick={() => router.push(`/community/create?forum=${forumId}`)}
                className="rounded-xl"
              >
                Создать тему
              </Button>
            </Card>
          </ScrollAnimation>
        ) : (
          <div className="space-y-4">
            {filteredAndSorted.map((topic, index) => (
              <ScrollAnimation key={topic.id} delay={200 + index * 30}>
                <TopicCard topic={topic} />
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
