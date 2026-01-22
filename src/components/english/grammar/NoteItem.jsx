'use client'

import { useState, useEffect } from 'react'
import Card from '../../Card'
import Badge from '../../Badge'
import Button from '../../Button'
import { NOTE_IMPORTANCE_LEVELS } from '../../../constants/grammarConstants'
import { HiPencil, HiTrash, HiClock, HiChat, HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { getNoteComments, createNoteComment, updateNoteComment, deleteNoteComment } from '../../../utils/notesService'
import TeacherCommentForm from './TeacherCommentForm'
import TeacherCommentItem from './TeacherCommentItem'

export default function NoteItem({ 
  note, 
  onEdit, 
  onDelete, 
  topicId, 
  userRole, 
  currentUserId,
  onCommentUpdate 
}) {
  const [comments, setComments] = useState([])
  const [commentsExpanded, setCommentsExpanded] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [isCreatingComment, setIsCreatingComment] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
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

  // Load comments when expanded
  useEffect(() => {
    if (commentsExpanded && topicId && note?.id) {
      loadComments()
    }
  }, [commentsExpanded, topicId, note?.id])

  const loadComments = async () => {
    if (!topicId || !note?.id) return
    
    setCommentsLoading(true)
    try {
      const commentsData = await getNoteComments(topicId, note.id)
      setComments(Array.isArray(commentsData) ? commentsData : [])
    } catch (err) {
      console.error('Error loading comments:', err)
      setComments([])
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleCreateComment = async (commentData) => {
    if (!topicId || !note?.id) return
    
    try {
      const newComment = await createNoteComment(topicId, note.id, commentData)
      if (newComment === null) {
        alert('Unable to save comment. The server is currently unavailable. Please try again later.')
        return
      }
      setComments([newComment, ...comments])
      setIsCreatingComment(false)
      if (onCommentUpdate) {
        onCommentUpdate()
      }
    } catch (err) {
      console.error('Error creating comment:', err)
      alert(err.message || 'Failed to create comment. Please try again.')
      throw err
    }
  }

  const handleUpdateComment = async (commentId, commentData) => {
    if (!topicId || !note?.id) return
    
    try {
      const updatedComment = await updateNoteComment(topicId, note.id, commentId, commentData)
      if (updatedComment === null) {
        alert('Unable to update comment. The server is currently unavailable. Please try again later.')
        return
      }
      setComments(comments.map(comment => comment.id === commentId ? updatedComment : comment))
      setEditingComment(null)
      if (onCommentUpdate) {
        onCommentUpdate()
      }
    } catch (err) {
      console.error('Error updating comment:', err)
      alert(err.message || 'Failed to update comment. Please try again.')
      throw err
    }
  }

  const handleDeleteComment = async (comment) => {
    if (!topicId || !note?.id) return
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteNoteComment(topicId, note.id, comment.id)
        setComments(comments.filter(c => c.id !== comment.id))
        if (editingComment?.id === comment.id) {
          setEditingComment(null)
        }
        if (onCommentUpdate) {
          onCommentUpdate()
        }
      } catch (err) {
        console.error('Error deleting comment:', err)
        alert(err.message || 'Failed to delete comment. Please try again.')
      }
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

  const isTeacher = userRole === 'teacher'
  const commentCount = comments.length

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

        {/* Comments Section */}
        <div className="pt-3 border-t border-gray-200">
          {/* Comments Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCommentsExpanded(!commentsExpanded)
              if (!commentsExpanded && commentCount === 0) {
                loadComments()
              }
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent-600 w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <HiChat className="w-4 h-4" />
              <span>Comments</span>
              {commentCount > 0 && (
                <Badge variant="accent" className="text-xs px-2 py-0.5">
                  {commentCount}
                </Badge>
              )}
            </div>
            {commentsExpanded ? (
              <HiChevronUp className="w-4 h-4" />
            ) : (
              <HiChevronDown className="w-4 h-4" />
            )}
          </Button>

          {/* Expanded Comments Content */}
          {commentsExpanded && (
            <div className="mt-3 space-y-3">
              {/* Loading State */}
              {commentsLoading && (
                <div className="text-center py-4 text-sm text-gray-500">
                  Loading comments...
                </div>
              )}

              {/* Comments List */}
              {!commentsLoading && (
                <>
                  {comments.length > 0 ? (
                    <div className="space-y-2">
                      {comments.map((comment) => (
                        <TeacherCommentItem
                          key={comment.id}
                          comment={comment}
                          onEdit={isTeacher ? (c) => setEditingComment(c) : undefined}
                          onDelete={isTeacher ? handleDeleteComment : undefined}
                          currentUserId={currentUserId}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No comments yet
                    </div>
                  )}

                  {/* Comment Form - Show for teachers or when editing */}
                  {(isTeacher && (isCreatingComment || editingComment)) && (
                    <div className="pt-2">
                      <TeacherCommentForm
                        comment={editingComment}
                        onSubmit={editingComment 
                          ? (data) => handleUpdateComment(editingComment.id, data)
                          : handleCreateComment
                        }
                        onCancel={() => {
                          setIsCreatingComment(false)
                          setEditingComment(null)
                        }}
                        isLoading={commentsLoading}
                      />
                    </div>
                  )}

                  {/* Add Comment Button - Show for teachers when not creating/editing */}
                  {isTeacher && !isCreatingComment && !editingComment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCreatingComment(true)
                        setEditingComment(null)
                      }}
                      className="flex items-center gap-2 text-accent-600 hover:text-accent-700 hover:bg-accent-50"
                    >
                      <HiChat className="w-4 h-4" />
                      Add Comment
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
