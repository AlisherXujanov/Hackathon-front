'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Card from '../../../components/Card'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import ScrollAnimation from '../../../components/ScrollAnimation'
import GroupCard from '../../../components/community/GroupCard'
import { communityService } from '../../../services/communityService'
import { HiSearch, HiArrowLeft, HiUserGroup } from 'react-icons/hi'

export default function GroupsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const categories = ['all', 'Languages', 'Frameworks', 'Exams', 'Security']

  useEffect(() => {
    loadGroups()
  }, [category])

  const loadGroups = async () => {
    try {
      setIsLoading(true)
      const data = await communityService.getGroups(category)
      setGroups(data)
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return groups
    const q = query.toLowerCase()
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    )
  }, [query, groups])

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg">
                <HiUserGroup className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Группы</h1>
                <p className="text-slate-600">Присоединяйтесь к сообществам по интересам</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <Card variant="glass" className="p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Поиск групп..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leftIcon={<HiSearch className="w-5 h-5" />}
              />
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categories.map((cat) => ({
                  value: cat,
                  label: cat === 'all' ? 'Все категории' : cat,
                }))}
              />
            </div>
          </Card>
        </ScrollAnimation>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка групп...</p>
          </div>
        ) : filtered.length === 0 ? (
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-12 text-center">
              <HiUserGroup className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Группы не найдены</h3>
              <p className="text-slate-600">Попробуйте изменить запрос или фильтры</p>
            </Card>
          </ScrollAnimation>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((group, index) => (
              <ScrollAnimation key={group.id} delay={200 + index * 50}>
                <GroupCard group={group} onJoin={loadGroups} onLeave={loadGroups} />
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
