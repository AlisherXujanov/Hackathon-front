'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadGrammarTopicData } from '../../../../utils/english/grammarLoader'
import { getNotes, createNote, updateNote, deleteNote } from '../../../../utils/notesService'
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
import NotesSidebar from '../../../../components/english/grammar/NotesSidebar'
import FloatingAIAssistant from '../../../../components/FloatingAIAssistant'
import { HiHome, HiDocumentText } from 'react-icons/hi'
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
  const [notesSidebarOpen, setNotesSidebarOpen] = useState(false)
  const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(false)

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

  // Load notes when topic data is loaded
  useEffect(() => {
    if (topicId && topicData) {
      loadNotes()
    }
  }, [topicId, topicData])

  const loadNotes = async () => {
    if (!topicId) return
    
    setNotesLoading(true)
    try {
      const notesData = await getNotes(topicId)
      setNotes(Array.isArray(notesData) ? notesData : [])
    } catch (err) {
      console.error('Error loading notes:', err)
      // Don't show error to user if it's just auth-related, notes are optional
      if (err.message.includes('Authentication')) {
        setNotes([])
      }
    } finally {
      setNotesLoading(false)
    }
  }

  const handleCreateNote = async (noteData) => {
    if (!topicId || !topicData) return
    
    setNotesLoading(true)
    try {
      const newNote = await createNote(topicId, topicData.topic, noteData)
      setNotes([newNote, ...notes])
    } catch (err) {
      console.error('Error creating note:', err)
      alert(err.message || 'Failed to create note. Please try again.')
      throw err
    } finally {
      setNotesLoading(false)
    }
  }

  const handleUpdateNote = async (noteId, noteData) => {
    if (!topicId) return
    
    setNotesLoading(true)
    try {
      const updatedNote = await updateNote(topicId, noteId, noteData)
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note))
    } catch (err) {
      console.error('Error updating note:', err)
      alert(err.message || 'Failed to update note. Please try again.')
      throw err
    } finally {
      setNotesLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!topicId) return
    
    setNotesLoading(true)
    try {
      await deleteNote(topicId, noteId)
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (err) {
      console.error('Error deleting note:', err)
      alert(err.message || 'Failed to delete note. Please try again.')
      throw err
    } finally {
      setNotesLoading(false)
    }
  }

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
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50 relative">
      <div className={`container-wrapper py-8 md:py-12 transition-all duration-300 ${notesSidebarOpen ? 'lg:pr-[400px]' : ''}`}>
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNotesSidebarOpen(!notesSidebarOpen)}
                className="flex items-center gap-2"
                title="Toggle Notes"
              >
                <HiDocumentText className="w-4 h-4" />
                <span className="hidden sm:inline">Notes</span>
                {notes.length > 0 && (
                  <Badge variant="primary" className="ml-1 text-xs">
                    {notes.length}
                  </Badge>
                )}
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

        {/* Floating AI Assistant */}
        <FloatingAIAssistant
          subjectName="English Grammar"
          topicName={topicData.topic}
          category="grammar"
          description={`Grammar practice interface for ${topicData.level?.toUpperCase() || 'English'} level students studying the topic: "${topicData.topic}". ${topicData.difficulty ? `Difficulty level: ${topicData.difficulty}. ` : ''}Currently viewing the "${activeSection}" section. ${topicData.estimated_hours ? `Estimated study time: ${topicData.estimated_hours} hours.` : ''}Language preference: ${language === 'en' ? 'English' : language === 'ru' ? 'Russian' : 'Uzbek'}.`}
          buttonLabel="AI Helper"
        />

        {/* Notes Sidebar */}
        <NotesSidebar
          topicId={topicId}
          topicTitle={topicData.topic}
          isOpen={notesSidebarOpen}
          onToggle={() => setNotesSidebarOpen(!notesSidebarOpen)}
          notes={notes}
          loading={notesLoading}
          onCreateNote={handleCreateNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </main>
  )
}
