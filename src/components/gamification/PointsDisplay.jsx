'use client'

import { HiStar } from 'react-icons/hi'

export default function PointsDisplay({ points, size = 'md', showLabel = true }) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <div className="flex items-center gap-2">
      <HiStar className={`${sizeClasses[size]} text-yellow-500 fill-yellow-500`} />
      <div>
        {showLabel && <div className="text-xs text-slate-600">Очки</div>}
        <div className={`${sizeClasses[size]} font-extrabold text-slate-900`}>
          {points.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
