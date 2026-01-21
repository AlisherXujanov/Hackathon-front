'use client'

import { HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi'
import Button from '../../../../../components/Button'
import Card from '../../../../../components/Card'

/**
 * Results Modal Component
 * Displays submission results and provides action options
 */
export default function ResultsModal({ results, onReview, onRetry, onBack }) {
  if (!results) return null

  const { score, total, percentage, correctCount, incorrectCount, unansweredCount } = results

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Results</h2>
            <div className="text-4xl font-bold text-primary-600">
              {score} / {total}
            </div>
            <div className="text-lg text-gray-600 mt-1">
              {percentage}% Correct
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <HiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{correctCount}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <HiXCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{incorrectCount}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <HiClock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-700">{unansweredCount}</div>
              <div className="text-sm text-gray-600">Unanswered</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={onReview}
            >
              Review Answers
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onRetry}
            >
              Retry Exercise
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={onBack}
            >
              Choose Another Topic
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
