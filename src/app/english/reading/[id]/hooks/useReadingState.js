'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { loadReadingAnswers } from '../../../../../utils/english/readingLoader'

/**
 * Custom hook for managing reading exercise state
 */
export function useReadingState(readingExercise, level, id) {
  const router = useRouter()
  
  // Process reading data into standardized format
  const processedData = useMemo(() => {
    if (!readingExercise) return null

    // Check if it's multi-passage format (advanced levels)
    if (readingExercise.isMultiPassage && readingExercise.passages) {
      return {
        id: readingExercise.id,
        title: readingExercise.title,
        level: readingExercise.module || level?.toUpperCase(),
        topic: readingExercise.topic,
        isMultiPassage: true,
        totalQuestions: readingExercise.total_questions || 0,
        totalPassages: readingExercise.total_passages || readingExercise.passages.length,
        passages: readingExercise.passages.map(passage => ({
          passageId: passage.passage_id,
          title: passage.title,
          topic: passage.topic,
          text: passage.text,
          questionRange: passage.question_range,
          questions: passage.questions || [],
          paragraphs: passage.text ? passage.text.split('\n\n').filter(p => p.trim()) : [],
          wordCount: passage.text ? passage.text.split(/\s+/).filter(w => w.trim()).length : 0
        })),
        metadata: readingExercise.metadata || {}
      }
    }

    // Basic format (single passage)
    const questions = readingExercise.questions || []
    const passage = readingExercise.passage || ''
    const paragraphs = passage.split('\n\n').filter(p => p.trim())
    const wordCount = passage.split(/\s+/).filter(w => w.trim()).length

    return {
      id: readingExercise.id,
      title: readingExercise.title,
      level: readingExercise.level || level?.toUpperCase(),
      topic: readingExercise.about_passage || '',
      isMultiPassage: false,
      passage: {
        passageId: 1,
        title: readingExercise.title,
        text: passage,
        paragraphs,
        wordCount,
        questions
      },
      passages: [{
        passageId: 1,
        title: readingExercise.title,
        text: passage,
        paragraphs,
        wordCount,
        questions
      }],
      totalQuestions: questions.length,
      totalPassages: 1
    }
  }, [readingExercise, level])

  // State
  const [userAnswers, setUserAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [reviewMap, setReviewMap] = useState({})
  const [results, setResults] = useState(null)
  const [activePassageId, setActivePassageId] = useState(1)
  const [timerStartTime, setTimerStartTime] = useState(null)
  const [isTimerPaused, setIsTimerPaused] = useState(false)

  // Initialize timer when data loads
  useEffect(() => {
    if (processedData && !timerStartTime) {
      setTimerStartTime(Date.now())
    }
  }, [processedData, timerStartTime])

  // Get current passage
  const currentPassage = useMemo(() => {
    if (!processedData) return null
    if (processedData.isMultiPassage) {
      return processedData.passages.find(p => p.passageId === activePassageId) || processedData.passages[0]
    }
    return processedData.passage
  }, [processedData, activePassageId])

  // Get all questions (flattened for multi-passage)
  const allQuestions = useMemo(() => {
    if (!processedData) return []
    if (processedData.isMultiPassage) {
      return processedData.passages.flatMap(p => p.questions)
    }
    return processedData.passage?.questions || []
  }, [processedData])

  // Handle answer change
  const handleAnswerChange = useCallback((questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }, [])

  // Calculate results
  const calculateResults = useCallback(async () => {
    if (!processedData || !allQuestions.length) return null

    let correctCount = 0
    let incorrectCount = 0
    let unansweredCount = 0
    const questionResults = {}

    // Load correct answers for advanced levels
    let correctAnswersMap = {}
    if (['b2', 'c1', 'c2'].includes(level?.toLowerCase())) {
      try {
        const answersData = await loadReadingAnswers(id)
        if (answersData?.tests) {
          answersData.tests.forEach((test, index) => {
            const question = allQuestions[index]
            if (question) {
              if (test.correctAnswers) {
                if (test.correctAnswers.type === 'single_option') {
                  correctAnswersMap[question.id] = test.correctAnswers.correct
                } else if (test.correctAnswers.type === 'multiple_options') {
                  correctAnswersMap[question.id] = test.correctAnswers.correct
                }
              }
            }
          })
        }
      } catch (error) {
        console.error('Error loading answers:', error)
      }
    }

    // Check each question
    allQuestions.forEach(question => {
      const userAnswer = userAnswers[question.id]
      const correctAnswer = correctAnswersMap[question.id] || getCorrectAnswer(question)
      
      if (!userAnswer || (typeof userAnswer === 'object' && Object.keys(userAnswer).length === 0)) {
        unansweredCount++
        questionResults[question.id] = { answered: false }
      } else {
        const isCorrect = checkAnswerCorrectness(question, userAnswer, correctAnswer)
        if (isCorrect) {
          correctCount++
          questionResults[question.id] = { answered: true, correct: true }
        } else {
          incorrectCount++
          questionResults[question.id] = { answered: true, correct: false }
        }
      }
    })

    const total = allQuestions.length
    const score = correctCount
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0

    return {
      score,
      total,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      questionResults,
      correctAnswersMap
    }
  }, [processedData, allQuestions, userAnswers, level, id])

  // Get correct answer from question structure
  const getCorrectAnswer = (question) => {
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      const correctOption = question.options?.find(opt => opt.correct === true)
      return correctOption?.answer
    }
    if (question.type === 'short_answer') {
      const correctOption = question.options?.find(opt => opt.correct === true)
      return correctOption?.answer
    }
    return null
  }

  // Check if answer is correct
  const checkAnswerCorrectness = (question, userAnswer, correctAnswer) => {
    if (!correctAnswer) return false

    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      return userAnswer === correctAnswer || 
             (typeof userAnswer === 'string' && userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim())
    }
    
    if (question.type === 'short_answer') {
      const userAns = typeof userAnswer === 'string' ? userAnswer.toLowerCase().trim() : ''
      const correctAns = correctAnswer.toLowerCase().trim()
      // Allow multiple correct answers separated by "/"
      const correctAnswers = correctAns.split('/').map(a => a.trim())
      return correctAnswers.some(ans => userAns === ans || userAns.includes(ans) || ans.includes(userAns))
    }

    return false
  }

  // Handle submit
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const calculatedResults = await calculateResults()
      setResults(calculatedResults)
      setReviewMap(calculatedResults?.correctAnswersMap || {})
      setShowResults(true)
    } catch (error) {
      console.error('Error submitting answers:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [calculateResults])

  // Handle review
  const handleReview = useCallback(() => {
    setIsReviewMode(true)
    setShowResults(false)
  }, [])

  // Handle retry
  const handleRetry = useCallback(() => {
    setUserAnswers({})
    setIsReviewMode(false)
    setShowResults(false)
    setResults(null)
    setReviewMap({})
    setTimerStartTime(Date.now())
  }, [])

  // Handle back
  const handleBack = useCallback(() => {
    router.push('/english/reading')
  }, [router])

  // Handle question click (navigate to question)
  const handleQuestionClick = useCallback((questionId) => {
    const question = allQuestions.find(q => q.id === questionId)
    if (!question) return

    // If multi-passage, switch to correct passage
    if (processedData?.isMultiPassage && question.passage_id) {
      setActivePassageId(question.passage_id)
    }

    // Scroll to question (handled by component)
    const questionElement = document.getElementById(`question-${questionId}`)
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [allQuestions, processedData])

  // Handle passage change
  const handlePassageChange = useCallback((passageId) => {
    setActivePassageId(passageId)
  }, [])

  return {
    // Data
    readingData: processedData,
    currentPassage,
    allQuestions,
    
    // State
    userAnswers,
    isSubmitting,
    showResults,
    isReviewMode,
    reviewMap,
    results,
    activePassageId,
    timerStartTime,
    isTimerPaused,
    
    // Actions
    handleAnswerChange,
    handleSubmit,
    handleReview,
    handleRetry,
    handleBack,
    handleQuestionClick,
    handlePassageChange,
    setIsTimerPaused
  }
}
