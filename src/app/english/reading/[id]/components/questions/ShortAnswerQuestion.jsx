'use client'

import { useState } from 'react'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

export default function ShortAnswerQuestion({
  question,
  userAnswer,
  onAnswerChange,
  isReviewMode,
  correctAnswer
}) {
  const [inputValue, setInputValue] = useState(userAnswer || '')
  const options = question.options || []
  const correct = correctAnswer || options.find(opt => opt.correct === true)?.answer

  const handleChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    if (!isReviewMode) {
      onAnswerChange(value)
    }
  }

  const isCorrect = userAnswer && correct && 
    (userAnswer.toLowerCase().trim() === correct.toLowerCase().trim() ||
     correct.toLowerCase().includes(userAnswer.toLowerCase().trim()) ||
     userAnswer.toLowerCase().trim().includes(correct.toLowerCase().trim()))
  const isAnswered = userAnswer && userAnswer.trim() !== ''

  return (
    <div 
      id={`question-${question.id}`}
      className={`
        p-4 rounded-lg border-2 transition-all
        ${isReviewMode && isCorrect ? 'border-green-500 bg-green-50' : ''}
        ${isReviewMode && isAnswered && !isCorrect ? 'border-red-500 bg-red-50' : ''}
        ${!isReviewMode ? 'border-gray-200' : ''}
        ${!isAnswered && !isReviewMode ? 'bg-white' : ''}
      `}
    >
      <div className="mb-3">
        <p className="font-semibold text-gray-900">
          {question.sentence || question.question}
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled={isReviewMode}
          placeholder="Type your answer..."
          className={`
            w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2
            ${isReviewMode && isCorrect ? 'border-green-500 bg-green-50' : ''}
            ${isReviewMode && isAnswered && !isCorrect ? 'border-red-500 bg-red-50' : ''}
            ${!isReviewMode ? 'border-gray-300 focus:border-primary-500 focus:ring-primary-200' : ''}
            ${isReviewMode ? 'cursor-default' : ''}
          `}
        />
        
        {isReviewMode && (
          <div className="flex items-center gap-2 mt-2">
            {isCorrect ? (
              <>
                <HiCheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Correct!</span>
              </>
            ) : isAnswered ? (
              <>
                <HiXCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">
                  Correct answer: {correct}
                </span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
