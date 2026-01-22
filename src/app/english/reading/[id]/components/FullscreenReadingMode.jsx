'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { HiX, HiChevronLeft, HiChevronRight, HiCheckCircle } from 'react-icons/hi'
import QuestionRenderer from './questions/QuestionRenderer'
import ReadingProgressBar from './ReadingProgressBar'
import ResultsModal from './ResultsModal'
import Button from '../../../../../components/Button'
import styles from './FullscreenReadingMode.module.scss'

/**
 * Fullscreen Reading Mode Component
 * Main UI component for fullscreen reading experience
 */
export default function FullscreenReadingMode({ 
  readingState, 
  onExitFullscreen,
  isNormalMode = false 
}) {
  const router = useRouter()
  const {
    readingData,
    currentPassage,
    allQuestions,
    userAnswers,
    isSubmitting,
    showResults,
    isReviewMode,
    reviewMap,
    results,
    activePassageId,
    handleAnswerChange,
    handleSubmit,
    handleReview,
    handleRetry,
    handleBack,
    handleQuestionClick,
    handlePassageChange
  } = readingState

  const [columnWidth, setColumnWidth] = useState(50) // 50% each column
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef(null)
  const resizeRef = useRef(null)

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Timer effect
  useEffect(() => {
    if (isPaused || !readingData) return

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, readingData])

  // Handle column resize
  const handleMouseDown = useCallback((e) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100

    // Limit between 35% and 65%
    const clampedPercentage = Math.max(35, Math.min(65, percentage))
    setColumnWidth(clampedPercentage)
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  if (!readingData || !currentPassage) {
    return null
  }

  const currentQuestions = readingData.isMultiPassage
    ? currentPassage.questions || []
    : allQuestions

  const answeredCount = Object.keys(userAnswers).filter(
    id => userAnswers[id] !== null && userAnswers[id] !== undefined && userAnswers[id] !== ''
  ).length

  // Check if all questions are answered
  const allQuestionsAnswered = useMemo(() => {
    if (!allQuestions.length) return false
    
    return allQuestions.every(question => {
      const userAnswer = userAnswers[question.id]
      // Match the validation logic from calculateResults
      if (!userAnswer) return false
      if (typeof userAnswer === 'string' && userAnswer.trim() === '') return false
      if (typeof userAnswer === 'object' && Object.keys(userAnswer).length === 0) return false
      return true
    })
  }, [allQuestions, userAnswers])

  return (
    <div 
      className={`${styles.fullscreenContainer} ${isNormalMode ? styles.normalMode : ''}`}
      ref={containerRef}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {readingData.isMultiPassage && (
            <div className={styles.passageNav}>
              <button
                onClick={() => {
                  const currentIndex = readingData.passages.findIndex(p => p.passageId === activePassageId)
                  if (currentIndex > 0) {
                    handlePassageChange(readingData.passages[currentIndex - 1].passageId)
                  }
                }}
                disabled={readingData.passages.findIndex(p => p.passageId === activePassageId) === 0}
                className={styles.navButton}
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>
              <span className={styles.passageInfo}>
                Passage {readingData.passages.findIndex(p => p.passageId === activePassageId) + 1} of {readingData.totalPassages}
              </span>
              <button
                onClick={() => {
                  const currentIndex = readingData.passages.findIndex(p => p.passageId === activePassageId)
                  if (currentIndex < readingData.passages.length - 1) {
                    handlePassageChange(readingData.passages[currentIndex + 1].passageId)
                  }
                }}
                disabled={readingData.passages.findIndex(p => p.passageId === activePassageId) === readingData.passages.length - 1}
                className={styles.navButton}
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{currentPassage.title || readingData.title}</h1>
            {currentPassage.wordCount > 0 && (
              <span className={styles.wordCount}>{currentPassage.wordCount} words</span>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          {isReviewMode && (
            <div className={styles.reviewBadge}>
              <HiCheckCircle className="w-5 h-5 text-green-600" />
              <span>Review Mode</span>
            </div>
          )}
          {!isReviewMode && !showResults && (
            <div className={styles.timer}>
              <span>{formatTime(elapsedTime)}</span>
            </div>
          )}
          {!isReviewMode && !showResults && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!allQuestionsAnswered}
            >
              Submit Answers
            </Button>
          )}
          {!isNormalMode && (
            <button
              onClick={() => router.push('/english/reading')}
              className={styles.exitButton}
              aria-label="Exit fullscreen"
            >
              <HiX className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content - Resizable Columns */}
      <div className={styles.content}>
        {/* Left Column - Passage */}
        <div 
          className={styles.passageColumn}
          style={{ width: `${columnWidth}%` }}
        >
          <div className={styles.passageContent}>
            <div className={styles.passageText}>
              {currentPassage.paragraphs?.map((paragraph, index) => (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className={styles.resizeHandle}
          onMouseDown={handleMouseDown}
        />

        {/* Right Column - Questions */}
        <div 
          className={styles.questionsColumn}
          style={{ width: `${100 - columnWidth}%` }}
        >
          <div className={styles.questionsContent}>
            <div className={styles.questionsHeader}>
              <h2 className={styles.questionsTitle}>
                Questions ({currentQuestions.length})
              </h2>
              {!isReviewMode && (
                <span className={styles.answeredCount}>
                  {answeredCount} / {allQuestions.length} answered
                </span>
              )}
            </div>

            <div className={styles.questionsList}>
              {currentQuestions.map((question) => {
                const correctAnswer = reviewMap[question.id] || null
                return (
                  <div key={question.id} className={styles.questionItem}>
                    <QuestionRenderer
                      question={question}
                      userAnswer={userAnswers[question.id]}
                      onAnswerChange={handleAnswerChange}
                      isReviewMode={isReviewMode}
                      correctAnswer={correctAnswer}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ReadingProgressBar
        questions={allQuestions}
        userAnswers={userAnswers}
        isReviewMode={isReviewMode}
        results={results}
        onQuestionClick={handleQuestionClick}
        isMultiPassage={readingData.isMultiPassage}
        passages={readingData.passages}
        activePassageId={activePassageId}
        onPassageChange={handlePassageChange}
      />

      {/* Results Modal */}
      {showResults && results && (
        <ResultsModal
          results={results}
          onReview={handleReview}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}
    </div>
  )
}
