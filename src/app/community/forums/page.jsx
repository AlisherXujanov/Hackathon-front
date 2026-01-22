'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Input from '../../../components/Input'
import ScrollAnimation from '../../../components/ScrollAnimation'
import ForumCard from '../../../components/community/ForumCard'
import { getForums } from '../../../store/community/communityData'
import { HiSearch, HiArrowLeft, HiChatAlt2 } from 'react-icons/hi'

export default function ForumsPage() {
  const [query, setQuery] = useState('')
  const forums = useMemo(() => getForums(), [])

  const filtered = useMemo(() => {
    if (!query.trim()) return forums
    const q = query.toLowerCase()
    return forums.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    )
  }, [query, forums])

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-6">
            <Link href="/community">
              <button className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4 transition-colors">
                <HiArrowLeft className="w-4 h-4 mr-2" />
                Назад в Community
              </button>
            </Link>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                <HiChatAlt2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Форумы</h1>
                <p className="text-slate-600">Выберите форум для обсуждения</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <Card variant="glass" className="p-5 mb-8">
            <Input
              placeholder="Поиск форумов..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<HiSearch className="w-5 h-5" />}
            />
          </Card>
        </ScrollAnimation>

        {filtered.length === 0 ? (
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-12 text-center">
              <HiChatAlt2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Форумы не найдены</h3>
              <p className="text-slate-600">Попробуйте изменить запрос</p>
            </Card>
          </ScrollAnimation>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((forum, index) => (
              <ScrollAnimation key={forum.id} delay={200 + index * 50}>
                <ForumCard forum={forum} />
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
