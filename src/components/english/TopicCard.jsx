'use client'

import Card from '../Card'
import Button from '../Button'
import Badge from '../Badge'
import { HiArrowRight, HiClock, HiAcademicCap, HiClipboardList } from 'react-icons/hi'
import styles from './TopicCard.module.scss'

export default function TopicCard({
  title,
  description,
  level,
  difficulty,
  estimatedHours,
  duration,
  wordCount,
  questionCount,
  onClick,
  className = ''
}) {
  const getDifficultyColor = (diff) => {
    if (!diff) return 'primary'
    if (diff <= 2) return 'success'
    if (diff <= 4) return 'warning'
    return 'error'
  }

  const getDifficultyLabel = (diff) => {
    if (!diff) return null
    if (diff <= 2) return 'Beginner'
    if (diff <= 4) return 'Intermediate'
    return 'Advanced'
  }

  const getLevelGradient = (level) => {
    if (!level) return 'from-primary-500 to-primary-600'
    const levelMap = {
      'A1': 'from-blue-500 to-cyan-500',
      'A2': 'from-cyan-500 to-teal-500',
      'B1': 'from-green-500 to-emerald-500',
      'B2': 'from-purple-500 to-pink-500',
      'C1': 'from-orange-500 to-red-500',
      'C2': 'from-indigo-500 to-purple-500'
    }
    return levelMap[level] || 'from-primary-500 to-primary-600'
  }

  return (
    <Card variant="glass" hover={false} className={`${styles.topicCard} ${className} group`}>
      <div className="flex flex-col h-full relative">
        {/* Gradient Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getLevelGradient(level)} ${styles.accentBar}`} />
        
        {/* Card Content */}
        <div className="flex flex-col h-full pt-5 pb-4 px-5">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              {level && (
                <Badge variant="primary" className="mb-2 text-[10px] font-semibold px-2 py-0.5">
                  {level}
                </Badge>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors duration-300">
                {title}
              </h3>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-600 mb-4 text-xs leading-relaxed line-clamp-3 flex-1 min-h-[3.5rem]">
              {description}
            </p>
          )}

          {/* Metadata Section */}
          <div className="mb-4 space-y-2">
            {/* Difficulty Badge */}
            {difficulty && (
              <div className="flex items-center">
                <Badge variant={getDifficultyColor(difficulty)} className="text-[10px] font-medium px-2 py-0.5">
                  {getDifficultyLabel(difficulty)}
                </Badge>
              </div>
            )}

            {/* Metadata Items */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {estimatedHours && (
                <div className="flex items-center space-x-1.5 text-gray-600">
                  <HiClock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{estimatedHours}h</span>
                </div>
              )}
              {duration && (
                <div className="flex items-center space-x-1.5 text-gray-600">
                  <HiClock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{duration} min</span>
                </div>
              )}
              {wordCount && (
                <div className="flex items-center space-x-1.5 text-gray-600">
                  <HiAcademicCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{wordCount} words</span>
                </div>
              )}
              {questionCount && (
                <div className="flex items-center space-x-1.5 text-gray-600">
                  <HiClipboardList className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{questionCount} questions</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`w-full mt-auto ${styles.actionButton}`}
            onClick={onClick}
          >
            <span className="font-semibold text-sm">Start Learning</span>
            <HiArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
