'use client'

import { useRef } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

/**
 * Reading Progress Bar Component
 * Shows question navigation dots and passage navigation
 */
export default function ReadingProgressBar({
  questions,
  userAnswers,
  isReviewMode,
  results,
  onQuestionClick,
  isMultiPassage,
  passages,
  activePassageId,
  onPassageChange
}) {
  const scrollContainerRef = useRef(null)

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const getQuestionStatus = (questionId) => {
    if (isReviewMode && results) {
      const questionResult = results.questionResults?.[questionId]
      if (questionResult?.correct) return 'correct'
      if (questionResult?.answered && !questionResult?.correct) return 'incorrect'
      return 'unanswered'
    }
    
    const answered = userAnswers[questionId] !== null && 
                     userAnswers[questionId] !== undefined && 
                     userAnswers[questionId] !== ''
    return answered ? 'answered' : 'unanswered'
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll('left')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Scroll left"
        >
          <HiChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Questions Dots */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {questions.map((question, index) => {
            const status = getQuestionStatus(question.id)
            return (
              <button
                key={question.id}
                onClick={() => onQuestionClick(question.id)}
                className={`
                  flex-shrink-0 w-10 h-10 rounded-full border-2 transition-all
                  ${status === 'answered' ? 'bg-green-100 border-green-500' : ''}
                  ${status === 'unanswered' ? 'bg-gray-100 border-gray-300' : ''}
                  ${status === 'correct' ? 'bg-green-500 border-green-600' : ''}
                  ${status === 'incorrect' ? 'bg-red-500 border-red-600' : ''}
                  hover:scale-110 active:scale-95
                `}
                title={`Question ${index + 1}`}
                aria-label={`Question ${index + 1}, ${status}`}
              >
                <span className="text-xs font-semibold text-gray-700">
                  {index + 1}
                </span>
              </button>
            )
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => handleScroll('right')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Scroll right"
        >
          <HiChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Passage Navigation (for multi-passage) */}
        {isMultiPassage && passages && (
          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            {passages.map((passage, index) => (
              <button
                key={passage.passageId}
                onClick={() => onPassageChange(passage.passageId)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${activePassageId === passage.passageId 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                P{index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
