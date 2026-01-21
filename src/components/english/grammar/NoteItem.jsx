'use client'

import Card from '../../Card'
import Badge from '../../Badge'
import Button from '../../Button'
import { NOTE_IMPORTANCE_LEVELS } from '../../../constants/grammarConstants'
import { HiPencil, HiTrash, HiClock } from 'react-icons/hi'

export default function NoteItem({ note, onEdit, onDelete }) {
  const getImportanceBadge = (importance) => {
    switch (importance) {
      case NOTE_IMPORTANCE_LEVELS.CRITICAL:
        return <Badge variant="error" className="text-xs font-semibold px-2 py-1">Critical</Badge>
      case NOTE_IMPORTANCE_LEVELS.IMPORTANT:
        return <Badge variant="warning" className="text-xs font-semibold px-2 py-1">Important</Badge>
      case NOTE_IMPORTANCE_LEVELS.NORMAL:
        return <Badge variant="primary" className="text-xs font-semibold px-2 py-1">Normal</Badge>
      default:
        return <Badge variant="gray" className="text-xs font-semibold px-2 py-1">Normal</Badge>
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  return (
    <Card variant="glass" className="p-4 hover:shadow-lg transition-all">
      <div className="space-y-3">
        {/* Header with Importance Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {getImportanceBadge(note.importance)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(note)}
              className="p-2"
              title="Edit note"
            >
              <HiPencil className="w-4 h-4 text-gray-600 hover:text-primary-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note)}
              className="p-2"
              title="Delete note"
            >
              <HiTrash className="w-4 h-4 text-gray-600 hover:text-error-600" />
            </Button>
          </div>
        </div>

        {/* Note Text */}
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
          {note.note_text}
        </div>

        {/* Timestamp */}
        {(note.created_at || note.updated_at) && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <HiClock className="w-3 h-3" />
            <span>
              {note.updated_at && note.updated_at !== note.created_at
                ? `Updated ${formatDate(note.updated_at)}`
                : `Created ${formatDate(note.created_at)}`}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
