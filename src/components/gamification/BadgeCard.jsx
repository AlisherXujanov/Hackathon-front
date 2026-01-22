'use client'

import Card from '../Card'
import { HiLockClosed, HiCheckCircle } from 'react-icons/hi'

export default function BadgeCard({ badge, isUnlocked = false }) {
  return (
    <Card
      variant="glass"
      className={`p-6 text-center relative overflow-hidden ${
        isUnlocked ? 'border-2 border-yellow-400' : 'opacity-60'
      }`}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <HiLockClosed className="w-10 h-10 text-slate-400" />
        </div>
      )}
      
      <div className="text-6xl mb-3">{badge.icon}</div>
      <h3 className={`text-lg font-extrabold mb-2 ${isUnlocked ? 'text-slate-900' : 'text-slate-600'}`}>
        {badge.title}
      </h3>
      <p className="text-sm text-slate-600 mb-3">{badge.description}</p>
      
      {isUnlocked && (
        <div className="flex items-center justify-center gap-1 text-green-600">
          <HiCheckCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">Получен</span>
        </div>
      )}
    </Card>
  )
}
