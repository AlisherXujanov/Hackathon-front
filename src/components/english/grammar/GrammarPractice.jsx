'use client'

import { useState, useMemo } from 'react'
import Card from '../../Card'
import Button from '../../Button'
import Badge from '../../Badge'
import MultipleChoiceExercise from './exercises/MultipleChoiceExercise'
import ShortAnswerExercise from './exercises/ShortAnswerExercise'
import MultipleGapFillingExercise from './exercises/MultipleGapFillingExercise'
import GrammarEmptyState from './shared/GrammarEmptyState'
import { HiChevronLeft, HiChevronRight, HiFilter, HiClipboardCheck } from 'react-icons/hi'
import { EXERCISE_TYPES } from '../../../constants/grammarConstants'
import { getExerciseTypeLabel } from '../../../utils/english/exerciseUtils'

export default function GrammarPractice({ exercises, language = 'en' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filterType, setFilterType] = useState('all')
  const [exerciseResults, setExerciseResults] = useState({})

  const exerciseItems = exercises?.items || []

  // Filter exercises by type
  const filteredExercises = useMemo(() => {
    if (filterType === 'all') return exerciseItems
    return exerciseItems.filter(ex => ex.type === filterType)
  }, [exerciseItems, filterType])

  // Get unique exercise types
  const availableTypes = useMemo(() => {
    const types = new Set(exerciseItems.map(ex => ex.type))
    return Array.from(types)
  }, [exerciseItems])

  const currentExercise = filteredExercises[currentIndex]
  const totalExercises = filteredExercises.length

  const handleAnswer = (result) => {
    setExerciseResults(prev => ({
      ...prev,
      [result.exerciseId]: result
    }))
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex(currentIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFilterChange = (type) => {
    setFilterType(type)
    setCurrentIndex(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate progress
  const completedCount = Object.keys(exerciseResults).length
  const progressPercentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0

  if (!exercises || exerciseItems.length === 0) {
    return <GrammarEmptyState message="No exercises available for this topic yet." />
  }

  const renderExercise = () => {
    if (!currentExercise) return null

    const props = {
      exercise: currentExercise,
      language,
      onAnswer: handleAnswer
    }

    switch (currentExercise.type) {
      case 'multiple_choice':
        return <MultipleChoiceExercise {...props} />
      case 'short_answer':
        return <ShortAnswerExercise {...props} />
      case 'multiple_gap_filling':
        return <MultipleGapFillingExercise {...props} />
      default:
        return (
          <GrammarEmptyState message={`Unknown exercise type: ${currentExercise.type}`} />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Exercises</h2>
            <p className="text-gray-600">
              Complete {totalExercises} exercises to master this grammar topic
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="primary" className="text-sm font-semibold px-4 py-2">
              {completedCount} / {totalExercises} completed
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-primary-600 to-accent-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progressPercentage}% complete</p>
        </div>
      </Card>

      {/* Filter */}
      {availableTypes.length > 1 && (
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <HiFilter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by type:</span>
            <button
              onClick={() => handleFilterChange('all')}
              className={`
                px-3 py-1 rounded-lg text-sm font-medium transition-colors
                ${filterType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              All ({exerciseItems.length})
            </button>
            {availableTypes.map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${filterType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {EXERCISE_TYPES[type] || type} ({exerciseItems.filter(ex => ex.type === type).length})
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Exercise Navigation */}
      {totalExercises > 0 && (
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <HiChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Exercise {currentIndex + 1} of {totalExercises}
            </span>
            {currentExercise && (
              <Badge variant="primary" className="text-xs font-semibold px-2 py-1">
                {getExerciseTypeLabel(currentExercise.type)}
              </Badge>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === totalExercises - 1}
            variant="secondary"
            className="flex items-center gap-2"
          >
            Next
            <HiChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Current Exercise */}
      {currentExercise ? (
        renderExercise()
      ) : (
        <GrammarEmptyState message="No exercises match the selected filter." />
      )}

      {/* Summary Card */}
      {completedCount > 0 && (
        <Card variant="glass" className="p-6 bg-gradient-to-br from-success-50 to-primary-50 border-success-200">
          <div className="flex items-center gap-3 mb-3">
            <HiClipboardCheck className="w-6 h-6 text-success-600" />
            <h3 className="text-lg font-bold text-gray-900">Practice Summary</h3>
          </div>
          <p className="text-gray-700">
            You've completed {completedCount} exercise{completedCount !== 1 ? 's' : ''}. 
            {completedCount === totalExercises ? ' Great job! You\'ve completed all exercises.' : ' Keep going!'}
          </p>
        </Card>
      )}
    </div>
  )
}
