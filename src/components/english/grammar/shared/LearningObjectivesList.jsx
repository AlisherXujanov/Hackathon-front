'use client'

import Card from '../../../Card'
import SectionHeader from './SectionHeader'
import { HiLightBulb } from 'react-icons/hi'
import { getLocalizedArray } from '../../../../utils/english/grammarUtils'

/**
 * Learning Objectives List Component
 * Displays learning objectives in a formatted list
 */
export default function LearningObjectivesList({ topic, language = 'en', showHeader = true, className = '' }) {
  const learningObjectives = getLocalizedArray(topic?.learning_objectives, language)

  if (learningObjectives.length === 0) {
    return (
      <Card variant="glass" className={`p-6 ${className}`}>
        <p className="text-gray-500 italic">No learning objectives available for this language.</p>
      </Card>
    )
  }

  return (
    <Card variant="glass" className={`p-6 ${className}`}>
      {showHeader && (
        <SectionHeader icon={HiLightBulb} title="Learning Objectives" />
      )}
      <ul className="space-y-3">
        {learningObjectives.map((objective, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-1.5 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-primary-600"></div>
            </div>
            <p className="text-gray-700 leading-relaxed flex-1">{objective}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
