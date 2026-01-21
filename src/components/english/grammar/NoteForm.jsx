'use client'

import { useState, useEffect } from 'react'
import Button from '../../Button'
import Badge from '../../Badge'
import { NOTE_IMPORTANCE_LEVELS } from '../../../constants/grammarConstants'
import { HiX, HiCheck } from 'react-icons/hi'

export default function NoteForm({ note, onSubmit, onCancel, isLoading = false }) {
  const [noteText, setNoteText] = useState('')
  const [importance, setImportance] = useState(NOTE_IMPORTANCE_LEVELS.NORMAL)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (note) {
      setNoteText(note.note_text || '')
      setImportance(note.importance || NOTE_IMPORTANCE_LEVELS.NORMAL)
    } else {
      setNoteText('')
      setImportance(NOTE_IMPORTANCE_LEVELS.NORMAL)
    }
    setErrors({})
  }, [note])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!noteText.trim()) {
      newErrors.noteText = 'Note text is required'
    }

    if (!importance) {
      newErrors.importance = 'Please select an importance level'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      note_text: noteText.trim(),
      importance
    })
  }

  const importanceOptions = [
    { value: NOTE_IMPORTANCE_LEVELS.CRITICAL, label: 'Critical', color: 'error' },
    { value: NOTE_IMPORTANCE_LEVELS.IMPORTANT, label: 'Important', color: 'warning' },
    { value: NOTE_IMPORTANCE_LEVELS.NORMAL, label: 'Normal', color: 'primary' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Note Text */}
      <div>
        <label htmlFor="note-text" className="block text-sm font-semibold text-gray-700 mb-2">
          Note Text <span className="text-error-600">*</span>
        </label>
        <textarea
          id="note-text"
          value={noteText}
          onChange={(e) => {
            setNoteText(e.target.value)
            if (errors.noteText) {
              setErrors({ ...errors, noteText: null })
            }
          }}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${
            errors.noteText
              ? 'border-error-500 focus:ring-error-500'
              : 'border-gray-300 focus:border-primary-500'
          }`}
          placeholder="Write your note here..."
          disabled={isLoading}
        />
        {errors.noteText && (
          <p className="mt-1 text-sm text-error-600">{errors.noteText}</p>
        )}
      </div>

      {/* Importance Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Importance <span className="text-error-600">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {importanceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setImportance(option.value)
                if (errors.importance) {
                  setErrors({ ...errors, importance: null })
                }
              }}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                importance === option.value
                  ? option.color === 'error'
                    ? 'border-error-600 bg-error-50'
                    : option.color === 'warning'
                    ? 'border-warning-600 bg-warning-50'
                    : 'border-primary-600 bg-primary-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Badge
                variant={option.color}
                className={`text-sm font-semibold ${
                  importance === option.value ? '' : 'opacity-60'
                }`}
              >
                {option.label}
              </Badge>
            </button>
          ))}
        </div>
        {errors.importance && (
          <p className="mt-1 text-sm text-error-600">{errors.importance}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <HiCheck className="w-5 h-5" />
          {note ? 'Update Note' : 'Save Note'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex items-center justify-center gap-2"
        >
          <HiX className="w-5 h-5" />
          Cancel
        </Button>
      </div>
    </form>
  )
}
