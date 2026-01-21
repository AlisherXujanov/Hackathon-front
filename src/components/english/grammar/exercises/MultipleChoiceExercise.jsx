'use client'

import { useState } from 'react'
import Card from '../../../Card'
import Button from '../../../Button'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { getLocalizedContent } from '../../../../utils/english/grammarUtils'

export default function MultipleChoiceExercise({ exercise, language = 'en', onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const question = getLocalizedContent(exercise?.question, language) || ''
  const options = exercise?.options || []
  const explanation = getLocalizedContent(exercise?.explanation, language)
  const correctOption = options.findIndex(opt => opt.correct === true)

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    
    const correct = selectedAnswer === correctOption
    setIsCorrect(correct)
    setIsSubmitted(true)
    
    if (onAnswer) {
      onAnswer({
        exerciseId: exercise.id,
        correct,
        userAnswer: selectedAnswer,
        correctAnswer: correctOption
      })
    }
  }

  const handleReset = () => {
    setSelectedAnswer(null)
    setIsSubmitted(false)
    setIsCorrect(null)
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="space-y-4">
        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectOption = index === correctOption
            const showCorrect = isSubmitted && isCorrectOption
            const showIncorrect = isSubmitted && isSelected && !isCorrectOption

            return (
              <button
                key={index}
                onClick={() => !isSubmitted && setSelectedAnswer(index)}
                disabled={isSubmitted}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${
                    showCorrect
                      ? 'border-success-500 bg-success-50'
                      : showIncorrect
                      ? 'border-error-500 bg-error-50'
                      : isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
                  }
                  ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${
                      showCorrect || (isSelected && isCorrect)
                        ? 'border-success-500 bg-success-500'
                        : showIncorrect
                        ? 'border-error-500 bg-error-500'
                        : isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }
                  `}>
                    {showCorrect && <HiCheckCircle className="w-3 h-3 text-white" />}
                    {showIncorrect && <HiXCircle className="w-3 h-3 text-white" />}
                    {!isSubmitted && isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className={`
                    flex-1
                    ${showCorrect ? 'text-success-900 font-semibold' : ''}
                    ${showIncorrect ? 'text-error-900' : ''}
                    ${!isSubmitted && isSelected ? 'text-primary-900 font-medium' : 'text-gray-700'}
                  `}>
                    {option.answer}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

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
        <div className="flex gap-3 pt-2">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
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
