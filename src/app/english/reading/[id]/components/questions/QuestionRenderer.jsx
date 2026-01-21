'use client'

import { useState, useEffect } from 'react'
import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import ShortAnswerQuestion from './ShortAnswerQuestion'
import TrueFalseQuestion from './TrueFalseQuestion'

/**
 * Question Renderer Component
 * Renders questions based on their type
 */
export default function QuestionRenderer({ 
  question, 
  userAnswer, 
  onAnswerChange, 
  isReviewMode,
  correctAnswer 
}) {
  const [localAnswer, setLocalAnswer] = useState(userAnswer || null)

  useEffect(() => {
    setLocalAnswer(userAnswer || null)
  }, [userAnswer])

  const handleAnswerChange = (answer) => {
    setLocalAnswer(answer)
    onAnswerChange(question.id, answer)
  }

  const props = {
    question,
    userAnswer: localAnswer,
    onAnswerChange: handleAnswerChange,
    isReviewMode,
    correctAnswer
  }

  switch (question.type) {
    case 'multiple_choice':
      return <MultipleChoiceQuestion {...props} />
    
    case 'short_answer':
      return <ShortAnswerQuestion {...props} />
    
    case 'true_false':
      return <TrueFalseQuestion {...props} />
    
    default:
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">
            Unsupported question type: {question.type}
          </p>
        </div>
      )
  }
}
