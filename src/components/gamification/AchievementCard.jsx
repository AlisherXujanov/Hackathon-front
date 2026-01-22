'use client'

import Card from '../Card'
import Badge from '../Badge'
import { HiLockClosed, HiCheckCircle } from 'react-icons/hi'

export default function AchievementCard({ achievement, isUnlocked = false, progress = null }) {
  const progressPercent = progress !== null ? Math.min(100, (progress.current / progress.total) * 100) : 0

  return (
    <Card
      variant="glass"
      className={`p-5 relative overflow-hidden ${
        isUnlocked ? 'border-2 border-yellow-400' : 'opacity-75'
      }`}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-10">
          <HiLockClosed className="w-8 h-8 text-slate-400" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-extrabold ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
              {achievement.title}
            </h3>
            {isUnlocked && (
              <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-600 mb-3">{achievement.description}</p>
          
          {!isUnlocked && progress !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Прогресс</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" size="sm">
              {achievement.category}
            </Badge>
            {achievement.points > 0 && (
              <Badge variant="accent" size="sm">
                +{achievement.points} очков
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
