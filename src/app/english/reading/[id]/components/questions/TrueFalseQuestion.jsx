'use client'

import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

export default function TrueFalseQuestion({
  question,
  userAnswer,
  onAnswerChange,
  isReviewMode,
  correctAnswer
}) {
  const options = question.options || []
  const correct = correctAnswer || options.find(opt => opt.correct === true)?.answer

  const handleSelect = (value) => {
    if (!isReviewMode) {
      onAnswerChange(value)
    }
  }

  const isCorrect = userAnswer === correct
  const isAnswered = userAnswer !== null && userAnswer !== undefined

  return (
    <div 
      id={`question-${question.id}`}
      className={`
        p-4 rounded-lg border-2 transition-all
        ${isReviewMode && isCorrect ? 'border-green-500 bg-green-50' : ''}
        ${isReviewMode && isAnswered && !isCorrect ? 'border-red-500 bg-red-50' : ''}
        ${!isReviewMode ? 'border-gray-200 hover:border-primary-300' : ''}
        ${!isAnswered && !isReviewMode ? 'bg-white' : ''}
      `}
    >
      <div className="mb-3">
        <p className="font-semibold text-gray-900">
          {question.statement || question.question}
        </p>
      </div>

      <div className="flex gap-3">
        {options.map((option, index) => {
          const optionValue = option.answer.toLowerCase()
          const isSelected = userAnswer === optionValue
          const isCorrectOption = optionValue === correct?.toLowerCase()
          const showCorrect = isReviewMode && isCorrectOption
          const showIncorrect = isReviewMode && isSelected && !isCorrectOption

          return (
            <button
              key={index}
              onClick={() => handleSelect(optionValue)}
              disabled={isReviewMode}
              className={`
                flex-1 p-3 rounded-lg border-2 transition-all font-medium
                ${isSelected && !isReviewMode ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700'}
                ${showCorrect ? 'border-green-500 bg-green-100 text-green-700' : ''}
                ${showIncorrect ? 'border-red-500 bg-red-100 text-red-700' : ''}
                ${!isReviewMode ? 'hover:border-primary-300 cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{option.answer}</span>
                {showCorrect && <HiCheckCircle className="w-5 h-5" />}
                {showIncorrect && <HiXCircle className="w-5 h-5" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
