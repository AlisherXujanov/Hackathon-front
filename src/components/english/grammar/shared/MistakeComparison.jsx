'use client'

import Card from '../../../Card'
import { HiXCircle, HiCheckCircle } from 'react-icons/hi'

/**
 * Mistake Comparison Component
 * Displays incorrect vs correct comparison
 */
export default function MistakeComparison({ mistake, index }) {
  const parseMistake = (mistakeText) => {
    const parts = mistakeText.split('→')
    if (parts.length === 2) {
      return {
        incorrect: parts[0].trim(),
        correct: parts[1].trim()
      }
    }
    return {
      incorrect: '',
      correct: mistakeText.trim()
    }
  }

  const parsed = parseMistake(mistake)

  return (
    <Card variant="glass" className="p-5">
      <div className="space-y-3">
        {/* Incorrect */}
        {parsed.incorrect && (
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <HiXCircle className="w-5 h-5 text-error-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-error-600 mb-1 uppercase tracking-wide">
                Incorrect
              </p>
              <p className="text-gray-900 font-medium line-through decoration-error-600 decoration-2">
                {parsed.incorrect}
              </p>
            </div>
          </div>
        )}

        {/* Arrow */}
        {parsed.incorrect && (
          <div className="flex justify-center py-1">
            <div className="w-8 h-0.5 bg-gray-300"></div>
          </div>
        )}

        {/* Correct */}
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0">
            <HiCheckCircle className="w-5 h-5 text-success-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-success-600 mb-1 uppercase tracking-wide">
              Correct
            </p>
            <p className="text-gray-900 font-semibold">
              {parsed.correct}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
