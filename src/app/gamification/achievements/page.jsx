'use client'

import { useState, useEffect, useMemo } from 'react'
import Card from '../../../components/Card'
import ScrollAnimation from '../../../components/ScrollAnimation'
import AchievementCard from '../../../components/gamification/AchievementCard'
import { getUserGamification, achievements, getUserStats } from '../../../store/gamification/gamificationData'
import { authService } from '../../../services/api'
import { HiSearch } from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'
import Input from '../../../components/Input'

export default function AchievementsPage() {
  const [gamification, setGamification] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      setIsLoading(true)
      const user = authService.getCurrentUser()
      const userData = user?.data || user
      const userId = userData?.id

      if (!userId) {
        setIsLoading(false)
        return
      }

      const gamificationData = getUserGamification(userId)
      setGamification(gamificationData)
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAchievements = useMemo(() => {
    if (!gamification) return []
    
    const user = authService.getCurrentUser()
    const userData = user?.data || user
    const userId = userData?.id
    const stats = getUserStats(userId)
    
    return achievements
      .filter((achievement) => {
        // Фильтр по категории
        if (categoryFilter !== 'all' && achievement.category !== categoryFilter) {
          return false
        }
        
        // Фильтр по поиску
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          return (
            achievement.title.toLowerCase().includes(query) ||
            achievement.description.toLowerCase().includes(query)
          )
        }
        
        return true
      })
      .map((achievement) => {
        const isUnlocked = gamification.unlockedAchievements.includes(achievement.id)
        let progress = null
        
        if (!isUnlocked) {
          const req = achievement.requirement
          let current = 0
          let total = req.value
          
          switch (req.type) {
            case 'lessons_completed':
              current = stats.lessonsCompleted
              break
            case 'streak_days':
              current = stats.streakDays
              break
            case 'lessons_by_language':
              current = stats.lessonsByLanguage[req.value.language] || 0
              total = req.value.count
              break
            case 'comments_count':
              current = stats.commentsCount
              break
            case 'courses_completed':
              current = stats.coursesCompleted
              break
            case 'tasks_completed':
              current = stats.tasksCompleted
              break
            case 'daily_logins':
              current = stats.dailyLogins
              break
            case 'helpful_comments':
              current = stats.helpfulComments
              break
          }
          
          progress = { current, total }
        }
        
        return { achievement, isUnlocked, progress }
      })
  }, [gamification, searchQuery, categoryFilter])

  const categories = ['all', 'learning', 'streak', 'programming', 'social']

  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!gamification) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Войдите в аккаунт</h1>
            <p className="text-slate-600">Для просмотра достижений необходимо войти в систему</p>
          </Card>
        </div>
      </main>
    )
  }

  const unlockedCount = gamification.unlockedAchievements.length
  const totalCount = achievements.length

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-yellow-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-600 to-orange-600 text-white flex items-center justify-center shadow-lg">
                <FaTrophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Достижения</h1>
                <p className="text-slate-600">
                  Разблокировано: {unlockedCount} из {totalCount}
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Фильтры */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Поиск достижений..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<HiSearch className="w-5 h-5" />}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-app-border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все категории</option>
              <option value="learning">Обучение</option>
              <option value="streak">Серии</option>
              <option value="programming">Программирование</option>
              <option value="social">Социальные</option>
              </select>
            </div>
          </Card>
        </ScrollAnimation>

        {/* Список достижений */}
        {filteredAchievements.length === 0 ? (
          <ScrollAnimation delay={150}>
            <Card variant="glass" className="p-12 text-center">
              <FaTrophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Достижения не найдены</h3>
              <p className="text-slate-600">Попробуйте изменить фильтры</p>
            </Card>
          </ScrollAnimation>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAchievements.map((item, index) => (
              <ScrollAnimation key={item.achievement.id} delay={150 + index * 50}>
                <AchievementCard
                  achievement={item.achievement}
                  isUnlocked={item.isUnlocked}
                  progress={item.progress}
                />
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
