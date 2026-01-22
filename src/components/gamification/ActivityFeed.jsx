'use client'

import Card from '../Card'
import Badge from '../Badge'
import { HiStar, HiCheckCircle, HiFire, HiChat, HiCode } from 'react-icons/hi'

const activityIcons = {
  lesson: HiCheckCircle,
  task: HiCode,
  course: HiCheckCircle,
  streak: HiFire,
  achievement: HiStar,
  project: HiCode,
  comment: HiChat,
  other: HiStar,
}

const activityColors = {
  lesson: 'text-blue-600',
  task: 'text-green-600',
  course: 'text-purple-600',
  streak: 'text-orange-600',
  achievement: 'text-yellow-600',
  project: 'text-indigo-600',
  comment: 'text-pink-600',
  other: 'text-slate-600',
}

export default function ActivityFeed({ activities, limit = 10 }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'только что'
    if (diffMins < 60) return `${diffMins} мин. назад`
    if (diffHours < 24) return `${diffHours} ч. назад`
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }

  const displayedActivities = activities.slice(0, limit)

  if (displayedActivities.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center">
        <p className="text-slate-600">Пока нет активности</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {displayedActivities.map((activity, index) => {
        const Icon = activityIcons[activity.activityType] || activityIcons.other
        const colorClass = activityColors[activity.activityType] || activityColors.other

        return (
          <Card key={index} variant="glass" className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900">+{activity.points} очков</span>
                  <Badge variant="outline" size="sm">
                    {activity.activityType}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{activity.reason}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
