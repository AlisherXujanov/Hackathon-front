'use client'

import NoteItem from './NoteItem'
import { HiDocumentText, HiRefresh } from 'react-icons/hi'

export default function NoteList({ 
  notes, 
  onEdit, 
  onDelete, 
  loading = false,
  topicId,
  userRole,
  currentUserId,
  onCommentUpdate
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-2xl border border-gray-200 animate-pulse"
          >
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <HiDocumentText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Notes Yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Start taking notes to keep track of important information about this grammar topic.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          topicId={topicId}
          userRole={userRole}
          currentUserId={currentUserId}
          onCommentUpdate={onCommentUpdate}
        />
      ))}
    </div>
  )
}
