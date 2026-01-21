'use client'

import { useState } from 'react'
import Card from '../../../Card'
import Button from '../../../Button'
import { getLocalizedContent } from '../../../../utils/english/grammarUtils'

/**
 * Base Exercise Component
 * Provides shared functionality for all exercise types
 */
export default function BaseExercise({ exercise, language = 'en', onAnswer, children, renderActions }) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const explanation = getLocalizedContent(exercise?.explanation, language)

  const handleSubmit = (correctness) => {
    setIsCorrect(correctness)
    setIsSubmitted(true)

    if (onAnswer && exercise) {
      onAnswer({
        exerciseId: exercise.id,
        correct: correctness
      })
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setIsCorrect(null)
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="space-y-4">
        {children({ isSubmitted, isCorrect, handleSubmit, handleReset })}

        {/* Explanation */}
        {isSubmitted && explanation && (
          <div className={`
            p-4 rounded-lg border-l-4
            ${isCorrect ? 'bg-success-50 border-success-500' : 'bg-warning-50 border-warning-500'}
          `}>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm text-gray-700">{explanation}</p>
          </div>
        )}

        {/* Actions */}
        {renderActions && renderActions({ isSubmitted, handleReset })}
      </div>
    </Card>
  )
}
