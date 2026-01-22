'use client'

import { calculateLevelProgress, calculateXPForLevel, calculateXPForNextLevel } from '../../store/gamification/gamificationData'

export default function LevelProgress({ points, level, showDetails = true }) {
  const progress = calculateLevelProgress(points, level)
  const currentXP = calculateXPForLevel(level)
  const nextXP = calculateXPForNextLevel(level)
  const currentProgress = points - currentXP
  const neededProgress = nextXP - currentXP

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-600">Уровень</span>
            <span className="text-xl font-extrabold text-slate-900">{level}</span>
          </div>
          <div className="text-xs text-slate-500">
            {currentProgress} / {neededProgress} XP
          </div>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showDetails && (
        <div className="mt-1 text-xs text-slate-500 text-right">
          {progress.toFixed(1)}% до уровня {level + 1}
        </div>
      )}
    </div>
  )
}
