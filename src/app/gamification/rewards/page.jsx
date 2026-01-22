'use client'

import { useState, useEffect, useMemo } from 'react'
import Card from '../../../components/Card'
import ScrollAnimation from '../../../components/ScrollAnimation'
import RewardsList from '../../../components/gamification/RewardsList'
import { getUserGamification, getLevelRewards } from '../../../store/gamification/gamificationData'
import { authService } from '../../../services/api'
import { HiGift } from 'react-icons/hi'

export default function RewardsPage() {
  const [gamification, setGamification] = useState(null)
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

  const allRewards = useMemo(() => {
    if (!gamification) return []
    
    const levelRewards = getLevelRewards(gamification.currentLevel)
    
    // Можно добавить другие награды (за достижения, бейджи и т.д.)
    return levelRewards
  }, [gamification])

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
            <p className="text-slate-600">Для просмотра наград необходимо войти в систему</p>
          </Card>
        </div>
      </main>
    )
  }

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-lg">
                <HiGift className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Награды</h1>
                <p className="text-slate-600">Ваши разблокированные награды и бонусы</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-6 md:p-8 mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">
              Награды за уровень {gamification.currentLevel}
            </h2>
            <RewardsList rewards={allRewards} />
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
