'use client'

import Card from '../Card'
import Badge from '../Badge'
import { HiGift, HiStar } from 'react-icons/hi'

export default function RewardsList({ rewards }) {
  if (!rewards || rewards.length === 0) {
    return (
      <Card variant="glass" className="p-8 text-center">
        <HiGift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">Пока нет доступных наград</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rewards.map((reward, index) => (
        <Card key={index} variant="glass" className="p-5">
          <div className="flex items-start gap-3">
            {reward.type === 'badge' ? (
              <div className="text-3xl">🏆</div>
            ) : (
              <HiStar className="w-8 h-8 text-yellow-500" />
            )}
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-900 mb-1">
                {reward.type === 'badge' ? 'Бейдж разблокирован' : `${reward.amount} очков`}
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                {reward.type === 'badge' ? 'Новый бейдж добавлен в коллекцию' : 'Бонусные очки за достижение'}
              </p>
              <Badge variant="accent" size="sm">
                {reward.type === 'badge' ? 'Бейдж' : 'Очки'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
