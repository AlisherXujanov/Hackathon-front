'use client'

import { useState, useEffect } from 'react'
import Card from '../../../Card'
import Button from '../../../Button'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { getLocalizedContent } from '../../../../utils/english/grammarUtils'
import { normalizeAnswer, isAnswerCorrect } from '../../../../utils/english/exerciseUtils'

export default function MultipleGapFillingExercise({ exercise, language = 'en', onAnswer }) {
  const [answers, setAnswers] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState({})
  const [score, setScore] = useState(null)

  const prompt = getLocalizedContent(exercise?.prompt, language) || ''
  const text = exercise?.text || ''
  const correctAnswers = exercise?.answers || []
  const explanation = getLocalizedContent(exercise?.explanation, language)

  // Extract blank numbers from text (___1___, ___2___, etc.)
  const blankMatches = text.match(/___(\d+)___/g) || []
  const blankNumbers = blankMatches.map(match => parseInt(match.match(/\d+/)[0]))
  
  // Create a mapping from blank number to answer key (handle both string and number keys)
  const blankKeyMap = {}
  correctAnswers.forEach(({ blank }) => {
    const num = typeof blank === 'string' ? parseInt(blank) : blank
    blankKeyMap[num] = blank
  })

  useEffect(() => {
    // Initialize answers object
    const initialAnswers = {}
    blankNumbers.forEach(num => {
      initialAnswers[num] = ''
    })
    setAnswers(initialAnswers)
  }, [text])

  const handleAnswerChange = (blankNum, value) => {
    if (isSubmitted) return
    setAnswers(prev => ({
      ...prev,
      [blankNum]: value
    }))
  }

  const handleSubmit = () => {
    // Check if all blanks are filled
    const allFilled = blankNumbers.every(num => answers[num]?.trim())
    if (!allFilled) {
      alert('Please fill in all blanks before submitting.')
      return
    }

    // Check answers
    const newResults = {}
    let correctCount = 0

    correctAnswers.forEach(({ blank, answer: correctAnswer }) => {
      // Handle both string and number blank identifiers
      const blankNum = typeof blank === 'string' ? parseInt(blank) : blank
      const userAnswer = answers[blankNum]
      const isCorrect = isAnswerCorrect(userAnswer, correctAnswer)
      
      // Store result using the original blank identifier
      newResults[blank] = {
        correct: isCorrect,
        userAnswer: userAnswer.trim(),
        correctAnswer: correctAnswer,
        blankNum: blankNum
      }
      
      if (isCorrect) correctCount++
    })

    setResults(newResults)
    setScore({
      correct: correctCount,
      total: blankNumbers.length,
      percentage: Math.round((correctCount / blankNumbers.length) * 100)
    })
    setIsSubmitted(true)

    if (onAnswer) {
      onAnswer({
        exerciseId: exercise.id,
        correct: correctCount === blankNumbers.length,
        score: correctCount,
        total: blankNumbers.length,
        results: newResults
      })
    }
  }

  const handleReset = () => {
    const initialAnswers = {}
    blankNumbers.forEach(num => {
      initialAnswers[num] = ''
    })
    setAnswers(initialAnswers)
    setResults({})
    setScore(null)
    setIsSubmitted(false)
  }

  // Render text with input fields
  const renderTextWithInputs = () => {
    let parts = text.split(/(___\d+___)/g)
    
    return parts.map((part, index) => {
      const blankMatch = part.match(/___(\d+)___/)
      if (blankMatch) {
        const blankNum = parseInt(blankMatch[1])
        const result = results[blankNum]
        const isCorrect = result?.correct
        const showResult = isSubmitted && result

        return (
          <span key={index} className="inline-block mx-1">
            <input
              type="text"
              value={answers[blankNum] || ''}
              onChange={(e) => handleAnswerChange(blankNum, e.target.value)}
              disabled={isSubmitted}
              className={`
                inline-block min-w-[80px] px-2 py-1 text-center border-b-2 font-medium
                focus:outline-none focus:ring-2 focus:ring-primary-500 rounded
                ${
                  showResult
                    ? isCorrect
                      ? 'border-success-500 bg-success-50 text-success-900'
                      : 'border-error-500 bg-error-50 text-error-900'
                    : 'border-primary-300 bg-white text-gray-900'
                }
                ${isSubmitted ? 'cursor-default' : ''}
              `}
              style={{ width: `${Math.max(80, (answers[blankNum]?.length || 5) * 10)}px` }}
            />
            {showResult && (
              <span className="ml-1">
                {isCorrect ? (
                  <HiCheckCircle className="w-4 h-4 text-success-600 inline" />
                ) : (
                  <HiXCircle className="w-4 h-4 text-error-600 inline" />
                )}
              </span>
            )}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="space-y-4">
        {/* Prompt */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{prompt}</h3>
        </div>

        {/* Text with blanks */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {renderTextWithInputs()}
          </p>
        </div>

        {/* Score */}
        {isSubmitted && score && (
          <div className={`
            p-4 rounded-lg border-l-4
            ${score.percentage === 100 ? 'bg-success-50 border-success-500' : 'bg-warning-50 border-warning-500'}
          `}>
            <p className="text-lg font-bold text-gray-900 mb-1">
              Score: {score.correct} / {score.total} ({score.percentage}%)
            </p>
            {score.percentage === 100 && (
              <p className="text-sm text-success-700 font-medium">Perfect! All answers are correct.</p>
            )}
          </div>
        )}

        {/* Incorrect Answers Details */}
        {isSubmitted && score && score.correct < score.total && (
          <div className="space-y-2">
            {Object.entries(results).map(([blank, result]) => {
              if (result.correct) return null
              const blankNum = result.blankNum || blank
              return (
                <div key={blank} className="p-3 bg-error-50 rounded-lg border border-error-200">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">Blank {blankNum}:</span>{' '}
                    Your answer: <span className="text-error-700 font-medium">{result.userAnswer}</span>{' '}
                    → Correct: <span className="text-success-700 font-semibold">{result.correctAnswer}</span>
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Explanation */}
        {isSubmitted && explanation && (
          <div className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
            <p className="text-sm font-semibold text-gray-900 mb-1">Explanation</p>
            <p className="text-sm text-gray-700">{explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={blankNumbers.some(num => !answers[num]?.trim())}
              className="flex-1"
            >
              Check Answers
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
