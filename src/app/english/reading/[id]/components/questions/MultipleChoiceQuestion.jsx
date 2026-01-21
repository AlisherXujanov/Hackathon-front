'use client'

import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

export default function MultipleChoiceQuestion({
  question,
  userAnswer,
  onAnswerChange,
  isReviewMode,
  correctAnswer
}) {
  const options = question.options || []
  const correct = correctAnswer || options.find(opt => opt.correct === true)?.answer

  const handleSelect = (optionAnswer) => {
    if (!isReviewMode) {
      onAnswerChange(optionAnswer)
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
          {question.question || question.sentence}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => {
          const optionAnswer = option.answer
          const isSelected = userAnswer === optionAnswer
          const isCorrectOption = optionAnswer === correct
          const showCorrect = isReviewMode && isCorrectOption
          const showIncorrect = isReviewMode && isSelected && !isCorrectOption

          return (
            <button
              key={index}
              onClick={() => handleSelect(optionAnswer)}
              disabled={isReviewMode}
              className={`
                w-full text-left p-3 rounded-lg border-2 transition-all
                ${isSelected && !isReviewMode ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}
                ${showCorrect ? 'border-green-500 bg-green-100' : ''}
                ${showIncorrect ? 'border-red-500 bg-red-100' : ''}
                ${!isReviewMode ? 'hover:border-primary-300 cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{optionAnswer}</span>
                {showCorrect && <HiCheckCircle className="w-5 h-5 text-green-600" />}
                {showIncorrect && <HiXCircle className="w-5 h-5 text-red-600" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
