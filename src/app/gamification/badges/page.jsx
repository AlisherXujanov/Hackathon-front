'use client'

import { useState, useEffect } from 'react'
import Card from '../../../components/Card'
import ScrollAnimation from '../../../components/ScrollAnimation'
import BadgeCard from '../../../components/gamification/BadgeCard'
import { getUserGamification, badges } from '../../../store/gamification/gamificationData'
import { authService } from '../../../services/api'
import { HiShieldCheck } from 'react-icons/hi'

export default function BadgesPage() {
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
            <p className="text-slate-600">Для просмотра бейджей необходимо войти в систему</p>
          </Card>
        </div>
      </main>
    )
  }

  const unlockedCount = gamification.unlockedBadges.length
  const totalCount = badges.length

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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Бейджи</h1>
                <p className="text-slate-600">
                  Получено: {unlockedCount} из {totalCount}
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => {
            const isUnlocked = gamification.unlockedBadges.includes(badge.id)
            return (
              <ScrollAnimation key={badge.id} delay={100 + index * 50}>
                <BadgeCard badge={badge} isUnlocked={isUnlocked} />
              </ScrollAnimation>
            )
          })}
        </div>
      </div>
    </main>
  )
}
