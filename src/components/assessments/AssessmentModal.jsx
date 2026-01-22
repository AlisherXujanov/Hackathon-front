'use client'

import { useState, useEffect } from 'react'
import Card from '../Card'
import Button from '../Button'
import Badge from '../Badge'
import { 
  HiX, 
  HiCheckCircle, 
  HiXCircle,
  HiClock
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'
import { courseService } from '../../services/courseService'

export default function AssessmentModal({ 
  courseId, 
  assessmentId, 
  assessment, 
  isOpen, 
  onClose,
  onComplete 
}) {
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)

  useEffect(() => {
    if (isOpen && assessment) {
      // Initialize answers
      const initialAnswers = {}
      assessment.questions?.forEach((q, idx) => {
        if (q.type === 'multiple_choice') {
          initialAnswers[idx] = null
        } else if (q.type === 'true_false') {
          initialAnswers[idx] = null
        } else {
          initialAnswers[idx] = ''
        }
      })
      setAnswers(initialAnswers)
      setResults(null)

      // Set timer if time limit exists
      if (assessment.timeLimitMinutes) {
        setTimeRemaining(assessment.timeLimitMinutes * 60)
      }
    }
  }, [isOpen, assessment])

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await courseService.submitAssessment(courseId, assessmentId, answers)
      const resultData = response?.data || response
      setResults(resultData)
      
      if (onComplete) {
        onComplete(resultData)
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateScore = () => {
    if (!results || !assessment) return 0
    const total = assessment.questions?.length || 0
    const correct = results.correctAnswers || 0
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }

  const passed = () => {
    const score = calculateScore()
    const passingScore = assessment.passingScore || 70
    return score >= passingScore
  }

  if (!isOpen || !assessment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card variant="glass" className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{assessment.title}</h2>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 mt-1">
                <HiClock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {results ? (
            /* Results View */
            <div className="text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                passed() 
                  ? 'bg-gradient-to-br from-success-500 to-success-600' 
                  : 'bg-gradient-to-br from-error-500 to-error-600'
              }`}>
                {passed() ? (
                  <FaTrophy className="w-12 h-12 text-white" />
                ) : (
                  <HiXCircle className="w-12 h-12 text-white" />
                )}
              </div>
              
              <h3 className={`text-3xl font-bold mb-2 ${
                passed() ? 'text-success-600' : 'text-error-600'
              }`}>
                {passed() ? 'Congratulations!' : 'Try Again'}
              </h3>
              
              <p className="text-xl text-gray-700 mb-6">
                Your Score: <span className="font-bold">{calculateScore()}%</span>
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Correct</p>
                  <p className="text-2xl font-bold text-success-600">
                    {results.correctAnswers || 0}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assessment.questions?.length || 0}
                  </p>
                </div>
              </div>

              {passed() && (
                <div className="p-4 bg-success-50 rounded-lg border border-success-200 mb-6">
                  <p className="text-success-700 font-semibold">
                    You've passed! You can now request a verified certificate.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {passed() && (
                  <Button variant="primary" onClick={() => {
                    onClose()
                    // Navigate to certificate request
                  }}>
                    Request Certificate
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Assessment Questions */
            <div className="space-y-6">
              {assessment.questions?.map((question, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="outline" size="sm">
                      Question {index + 1}
                    </Badge>
                    {question.points && (
                      <Badge variant="info" size="sm">
                        {question.points} points
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    {question.question}
                  </p>

                  {question.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                            answers[index] === optIndex
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={optIndex}
                            checked={answers[index] === optIndex}
                            onChange={() => handleAnswerChange(index, optIndex)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'true_false' && (
                    <div className="space-y-2">
                      {['True', 'False'].map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                            answers[index] === optIndex
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={optIndex}
                            checked={answers[index] === optIndex}
                            onChange={() => handleAnswerChange(index, optIndex)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'short_answer' && (
                    <textarea
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {Object.keys(answers).filter(k => answers[k] !== null && answers[k] !== '').length} of {assessment.questions?.length || 0} questions answered
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit Assessment
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
