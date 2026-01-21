'use client'

import { useState } from 'react'
import Card from '../../../Card'
import Button from '../../../Button'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { getLocalizedContent } from '../../../../utils/english/grammarUtils'
import { normalizeAnswer, isAnswerCorrect } from '../../../../utils/english/exerciseUtils'

export default function ShortAnswerExercise({ exercise, language = 'en', onAnswer }) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const prompt = getLocalizedContent(exercise?.prompt, language) || ''
  const options = exercise?.options || []
  const correctAnswer = options.find(opt => opt.correct === true)?.answer || ''
  const explanation = getLocalizedContent(exercise?.explanation, language)

  const handleSubmit = () => {
    if (!userAnswer.trim()) return

    // Check for exact match or if user answer is in the options
    const correct = isAnswerCorrect(userAnswer, correctAnswer) || 
                    options.some(opt => normalizeAnswer(opt.answer) === normalizeAnswer(userAnswer) && opt.correct)
    
    setIsCorrect(correct)
    setIsSubmitted(true)

    if (onAnswer) {
      onAnswer({
        exerciseId: exercise.id,
        correct,
        userAnswer: userAnswer.trim(),
        correctAnswer: correctAnswer
      })
    }
  }

  const handleReset = () => {
    setUserAnswer('')
    setIsSubmitted(false)
    setIsCorrect(null)
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="space-y-4">
        {/* Prompt */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{prompt}</h3>
        </div>

        {/* Input */}
        <div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => !isSubmitted && setUserAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isSubmitted && userAnswer.trim()) {
                handleSubmit()
              }
            }}
            disabled={isSubmitted}
            placeholder="Type your answer here..."
            className={`
              w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all
              ${
                isSubmitted
                  ? isCorrect
                    ? 'border-success-500 bg-success-50'
                    : 'border-error-500 bg-error-50'
                  : 'border-gray-200 bg-white focus:border-primary-500'
              }
            `}
          />
        </div>

        {/* Result */}
        {isSubmitted && (
          <div className={`
            p-4 rounded-lg border-l-4 flex items-start gap-3
            ${isCorrect ? 'bg-success-50 border-success-500' : 'bg-error-50 border-error-500'}
          `}>
            {isCorrect ? (
              <HiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
            ) : (
              <HiXCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {!isCorrect && (
                <p className="text-sm text-gray-700 mb-2">
                  Correct answer: <span className="font-semibold">{correctAnswer}</span>
                </p>
              )}
              {explanation && (
                <p className="text-sm text-gray-700">{explanation}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="flex-1"
            >
              Check Answer
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex-1"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
