'use client'

import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import PointsDisplay from '../../components/gamification/PointsDisplay'
import LevelProgress from '../../components/gamification/LevelProgress'
import ActivityFeed from '../../components/gamification/ActivityFeed'
import LeaderboardWidget from '../../components/gamification/LeaderboardWidget'
import { getUserGamification, getLevelRewards } from '../../store/gamification/gamificationData'
import { authService } from '../../services/api'
import { leaderboardService } from '../../services/api'
import { HiStar, HiFire, HiChartBar } from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function GamificationPage() {
  const [gamification, setGamification] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const user = authService.getCurrentUser()
      const userData = user?.data || user
      const userId = userData?.id

      if (!userId) {
        setIsLoading(false)
        return
      }

      setCurrentUserId(userId)
      const gamificationData = getUserGamification(userId)
      setGamification(gamificationData)

      // Загружаем лидерборд
      const leaderboardData = await leaderboardService.getLeaderboard({ page: 1, page_size: 10 })
      setLeaderboard(leaderboardData.results || [])
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const levelRewards = useMemo(() => {
    if (!gamification) return []
    return getLevelRewards(gamification.currentLevel)
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

  if (!gamification || !currentUserId) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper pt-24 sm:pt-28 pb-12">
          <Card variant="glass" className="p-10 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Войдите в аккаунт</h1>
            <p className="text-slate-600">Для просмотра геймификации необходимо войти в систему</p>
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 text-slate-900">Геймификация</h1>
            <p className="text-slate-600">Отслеживайте свой прогресс, зарабатывайте очки и разблокируйте достижения</p>
          </div>
        </ScrollAnimation>

        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HiStar className="w-8 h-8 text-yellow-500" />
                <PointsDisplay points={gamification.totalPoints} size="sm" showLabel={false} />
              </div>
              <div className="text-sm font-semibold text-slate-600">Всего очков</div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={150}>
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HiFire className="w-8 h-8 text-orange-500" />
                <div className="text-2xl font-extrabold text-slate-900">{gamification.dailyPoints}</div>
              </div>
              <div className="text-sm font-semibold text-slate-600">Очков сегодня</div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <HiChartBar className="w-8 h-8 text-blue-500" />
                <div className="text-2xl font-extrabold text-slate-900">{gamification.currentLevel}</div>
              </div>
              <div className="text-sm font-semibold text-slate-600">Текущий уровень</div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={250}>
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FaTrophy className="w-8 h-8 text-purple-500" />
                <div className="text-2xl font-extrabold text-slate-900">
                  {gamification.unlockedAchievements.length}
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-600">Достижений</div>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Прогресс уровня */}
        <ScrollAnimation delay={300}>
          <Card variant="glass" className="p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Прогресс уровня</h2>
            <LevelProgress points={gamification.totalPoints} level={gamification.currentLevel} />
          </Card>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Лента активности */}
          <ScrollAnimation delay={350}>
            <Card variant="glass" className="p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Последняя активность</h2>
              <ActivityFeed activities={gamification.activityHistory || []} limit={10} />
            </Card>
          </ScrollAnimation>

          {/* Лидерборд */}
          <ScrollAnimation delay={400}>
            <LeaderboardWidget users={leaderboard} currentUserId={currentUserId} limit={5} />
          </ScrollAnimation>
        </div>

        {/* Награды за уровень */}
        {levelRewards.length > 0 && (
          <ScrollAnimation delay={450}>
            <Card variant="glass" className="p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Награды за уровень {gamification.currentLevel}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levelRewards.map((reward, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="text-3xl mb-2">
                      {reward.type === 'badge' ? '🏆' : '⭐'}
                    </div>
                    <div className="font-extrabold text-slate-900">
                      {reward.type === 'badge' ? 'Новый бейдж' : `+${reward.amount} очков`}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </ScrollAnimation>
        )}
      </div>
    </main>
  )
}
