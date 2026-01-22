'use client'

import { useState, useEffect } from 'react'
import Button from '../../Button'
import { HiCheck, HiX, HiChat } from 'react-icons/hi'

export default function TeacherCommentForm({ comment, onSubmit, onCancel, isLoading = false }) {
  const [commentText, setCommentText] = useState('')
  const [errors, setErrors] = useState({})

  // Initialize form with comment data if editing
  useEffect(() => {
    if (comment) {
      setCommentText(comment.comment_text || '')
    } else {
      setCommentText('')
    }
    setErrors({})
  }, [comment])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!commentText.trim()) {
      newErrors.commentText = 'Comment text is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      comment_text: commentText.trim()
    })
  }

  const handleCancel = () => {
    setCommentText('')
    setErrors({})
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <HiChat className="w-4 h-4 text-accent-600" />
        <label htmlFor="comment-text" className="text-sm font-semibold text-gray-700">
          {comment ? 'Edit Comment' : 'Add Comment'}
        </label>
      </div>
      
      {/* Comment Text */}
      <div>
        <textarea
          id="comment-text"
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value)
            if (errors.commentText) {
              setErrors({ ...errors, commentText: null })
            }
          }}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all resize-none ${
            errors.commentText
              ? 'border-error-500 focus:ring-error-500'
              : 'border-gray-300 focus:border-accent-500'
          }`}
          placeholder={comment ? 'Edit your comment...' : 'Write your comment here...'}
          disabled={isLoading}
        />
        {errors.commentText && (
          <p className="mt-1 text-sm text-error-600">{errors.commentText}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="submit"
          variant="accent"
          size="sm"
          isLoading={isLoading}
          disabled={isLoading}
          className="flex items-center justify-center gap-2"
        >
          <HiCheck className="w-4 h-4" />
          {comment ? 'Update' : 'Post Comment'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <HiX className="w-4 h-4" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
