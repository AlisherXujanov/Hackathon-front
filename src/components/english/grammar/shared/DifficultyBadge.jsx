'use client'

import Badge from '../../../Badge'
import { getDifficultyLabel, getDifficultyColor } from '../../../../utils/english/grammarUtils'

/**
 * Difficulty Badge Component
 * Displays difficulty with appropriate color and label
 */
export default function DifficultyBadge({ difficulty, showScore = false, className = '' }) {
  if (!difficulty) return null

  const label = getDifficultyLabel(difficulty)
  const variant = getDifficultyColor(difficulty)

  return (
    <Badge variant={variant} className={`text-sm font-semibold px-3 py-1 ${className}`}>
      {label}
      {showScore && ` (${difficulty}/6)`}
    </Badge>
  )
}
