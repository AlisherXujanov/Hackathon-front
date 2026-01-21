'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadGrammarTopicData } from '../../../../utils/english/grammarLoader'
import Card from '../../../../components/Card'
import Button from '../../../../components/Button'
import Badge from '../../../../components/Badge'
import LoadingState from '../../../../components/english/LoadingState'
import ErrorState from '../../../../components/english/ErrorState'
import GrammarOverview from '../../../../components/english/grammar/GrammarOverview'
import GrammarTheory from '../../../../components/english/grammar/GrammarTheory'
import GrammarExamples from '../../../../components/english/grammar/GrammarExamples'
import GrammarCommonMistakes from '../../../../components/english/grammar/GrammarCommonMistakes'
import GrammarPractice from '../../../../components/english/grammar/GrammarPractice'
import GrammarReview from '../../../../components/english/grammar/GrammarReview'
import { HiHome } from 'react-icons/hi'
import { SECTIONS, STORAGE_KEYS, DEFAULT_LANGUAGE } from '../../../../constants/grammarConstants'
import { getDifficultyLabel, getDifficultyColor } from '../../../../utils/english/grammarUtils'
import LanguageSelector from '../../../../components/english/grammar/shared/LanguageSelector'
import SectionNavigation from '../../../../components/english/grammar/shared/SectionNavigation'
import DifficultyBadge from '../../../../components/english/grammar/shared/DifficultyBadge'

export default function GrammarTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params?.topicId

  const [activeSection, setActiveSection] = useState('overview')
  const [language, setLanguage] = useState('en')
  const [topicData, setTopicData] = useState(null)
  const [exercises, setExercises] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.GRAMMAR_LANGUAGE) || DEFAULT_LANGUAGE
    setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    // Save language preference to localStorage
    if (language) {
      localStorage.setItem(STORAGE_KEYS.GRAMMAR_LANGUAGE, language)
    }
  }, [language])

  useEffect(() => {
    async function loadData() {
      if (!topicId) {
        setError('Topic ID is required')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await loadGrammarTopicData(topicId)
        
        if (!data.topic) {
          setError(`Topic "${topicId}" not found`)
          setLoading(false)
          return
        }

        setTopicData(data.topic)
        setExercises(data.exercises)
      } catch (err) {
        console.error('Error loading grammar topic:', err)
        setError(err.message || 'Failed to load topic data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [topicId])

  if (loading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <LoadingState />
        </div>
      </main>
    )
  }

  if (error || !topicData) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <ErrorState
            title="Topic Not Found"
            message={error || 'The requested grammar topic could not be found.'}
            actionLabel="Back to Grammar"
            onAction={() => router.push('/english/grammar')}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/english/grammar')}
                className="flex items-center gap-2"
              >
                <HiHome className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Grammar</span>
              </Button>
            </div>
            
            {/* Language Selector */}
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>

          {/* Topic Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="primary" className="text-xs font-semibold px-3 py-1">
                  {topicData.level}
                </Badge>
                {topicData.difficulty && (
                  <DifficultyBadge difficulty={topicData.difficulty} className="text-xs font-semibold px-3 py-1" />
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {topicData.topic}
              </h1>
              {topicData.estimated_hours && (
                <p className="text-gray-600 text-sm">
                  Estimated time: {topicData.estimated_hours} hours
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <SectionNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Section Content */}
        <div className="min-h-[60vh]">
          {activeSection === 'overview' && (
            <GrammarOverview topic={topicData} language={language} />
          )}
          {activeSection === 'theory' && (
            <GrammarTheory topic={topicData} language={language} />
          )}
          {activeSection === 'examples' && (
            <GrammarExamples topic={topicData} language={language} />
          )}
          {activeSection === 'common-mistakes' && (
            <GrammarCommonMistakes topic={topicData} language={language} />
          )}
          {activeSection === 'practice' && (
            <GrammarPractice exercises={exercises} language={language} />
          )}
          {activeSection === 'review' && (
            <GrammarReview topic={topicData} language={language} />
          )}
        </div>
      </div>
    </main>
  )
}
