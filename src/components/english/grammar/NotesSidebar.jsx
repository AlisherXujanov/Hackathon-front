'use client'

import { useState } from 'react'
import Card from '../../Card'
import Button from '../../Button'
import NoteForm from './NoteForm'
import NoteList from './NoteList'
import { HiX, HiDocumentText, HiPlus, HiRefresh, HiExclamationCircle } from 'react-icons/hi'

export default function NotesSidebar({ topicId, topicTitle, isOpen, onToggle, notes, loading, error, onRetry, onCreateNote, onUpdateNote, onDeleteNote }) {
  const [isCreating, setIsCreating] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  const handleCreateNote = async (noteData) => {
    try {
      await onCreateNote(noteData)
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    }
  }

  const handleUpdateNote = async (noteData) => {
    try {
      await onUpdateNote(editingNote.id, noteData)
      setEditingNote(null)
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsCreating(false)
  }

  const handleDeleteNote = async (note) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await onDeleteNote(note.id)
        if (editingNote?.id === note.id) {
          setEditingNote(null)
        }
      } catch (error) {
        console.error('Error deleting note:', error)
        alert('Failed to delete note. Please try again.')
      }
    }
  }

  const handleCancelForm = () => {
    setIsCreating(false)
    setEditingNote(null)
  }

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 md:top-20 right-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]
          w-full sm:w-96 lg:w-96
          bg-white shadow-2xl
          z-[10000]
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center gap-2">
            <HiDocumentText className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Notes</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2"
            title="Close sidebar"
          >
            <HiX className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Topic Info */}
          <Card variant="glass" className="p-3 bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Topic</p>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">
              {topicTitle}
            </p>
          </Card>

          {/* Network Error Notification */}
          {error === 'network' && !loading && (
            <Card variant="glass" className="p-3 bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-2">
                <HiExclamationCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 font-medium mb-1">
                    Unable to load notes
                  </p>
                  <p className="text-xs text-yellow-700 mb-2">
                    Check your connection and try again.
                  </p>
                  {onRetry && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onRetry}
                      className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                    >
                      <HiRefresh className="w-4 h-4" />
                      <span>Retry</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Form Section */}
          {isCreating && !editingNote && (
            <Card variant="glass" className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Note</h3>
              <NoteForm
                onSubmit={handleCreateNote}
                onCancel={handleCancelForm}
                isLoading={loading}
              />
            </Card>
          )}

          {editingNote && !isCreating && (
            <Card variant="glass" className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Note</h3>
              <NoteForm
                note={editingNote}
                onSubmit={handleUpdateNote}
                onCancel={handleCancelForm}
                isLoading={loading}
              />
            </Card>
          )}

          {/* Notes List */}
          {!isCreating && !editingNote && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Notes ({notes?.length || 0})
                </h3>
                <div className="flex items-center gap-2">
                  {error === 'network' && onRetry && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onRetry}
                      className="flex items-center gap-1"
                      title="Retry loading notes"
                    >
                      <HiRefresh className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsCreating(true)
                      setEditingNote(null)
                    }}
                    className="flex items-center gap-2"
                  >
                    <HiPlus className="w-4 h-4" />
                    New Note
                  </Button>
                </div>
              </div>

              <NoteList
                notes={notes}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                loading={loading}
              />
            </>
          )}
        </div>
      </aside>
    </>
  )
}
