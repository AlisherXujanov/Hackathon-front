'use client'

import Card from '../../Card'
import Button from '../../Button'
import { HiPencil, HiTrash, HiClock, HiUserCircle } from 'react-icons/hi'

export default function TeacherCommentItem({ comment, onEdit, onDelete, currentUserId }) {
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

  const isOwner = comment.teacher?.id === currentUserId || comment.teacher_id === currentUserId

  return (
    <Card variant="glass" className="p-3 ml-4 border-l-4 border-accent-500 bg-accent-50/30">
      <div className="space-y-2">
        {/* Header with Teacher Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <HiUserCircle className="w-5 h-5 text-accent-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {comment.teacher?.first_name && comment.teacher?.last_name
                  ? `${comment.teacher.first_name} ${comment.teacher.last_name}`
                  : comment.teacher?.username || 'Teacher'}
              </p>
              <p className="text-xs text-gray-500">Teacher</p>
            </div>
          </div>
          {isOwner && (onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(comment)}
                  className="p-1.5"
                  title="Edit comment"
                >
                  <HiPencil className="w-3.5 h-3.5 text-gray-600 hover:text-accent-600" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(comment)}
                  className="p-1.5"
                  title="Delete comment"
                >
                  <HiTrash className="w-3.5 h-3.5 text-gray-600 hover:text-error-600" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Comment Text */}
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-sm">
          {comment.comment_text}
        </div>

        {/* Timestamp */}
        {(comment.created_at || comment.updated_at) && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pt-1 border-t border-gray-200">
            <HiClock className="w-3 h-3" />
            <span>
              {comment.updated_at && comment.updated_at !== comment.created_at
                ? `Updated ${formatDate(comment.updated_at)}`
                : `Posted ${formatDate(comment.created_at)}`}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
