'use client'

import { useState } from 'react'
import UserAvatar from './UserAvatar'
import LikeButton from './LikeButton'
import CommentForm from './CommentForm'
import { communityService } from '../../services/communityService'
import { HiReply, HiDotsVertical } from 'react-icons/hi'

export default function CommentList({ comments: initialComments, topicId, onCommentAdded }) {
  const [comments, setComments] = useState(initialComments || [])
  const [replyingTo, setReplyingTo] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'только что'
    if (diffMins < 60) return `${diffMins} мин. назад`
    if (diffHours < 24) return `${diffHours} ч. назад`
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  const handleLike = async (commentId) => {
    try {
      const result = await communityService.likeComment(commentId)
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: result.likes }
            : {
                ...c,
                replies: c.replies?.map((r) =>
                  r.id === commentId ? { ...r, likes: result.likes } : r
                ),
              }
        )
      )
    } catch (error) {
      console.error('Ошибка при лайке:', error)
    }
  }

  const handleAddReply = async (commentId, content) => {
    try {
      const reply = await communityService.addReply(commentId, { content })
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, replies: [...(c.replies || []), reply] } : c
        )
      )
      setReplyingTo(null)
      if (onCommentAdded) onCommentAdded()
    } catch (error) {
      console.error('Ошибка при добавлении ответа:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-app-border pb-6 last:border-b-0">
          <div className="flex items-start gap-4">
            <UserAvatar user={comment.author} size="md" showOnline />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">
                    {comment.author.first_name} {comment.author.last_name}
                  </span>
                  <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                  {comment.isEdited && (
                    <span className="text-xs text-slate-400">(изменено)</span>
                  )}
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <HiDotsVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-700 leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>
              <div className="flex items-center gap-3">
                <LikeButton
                  isLiked={communityService.isCommentLiked(comment.id)}
                  likes={comment.likes}
                  onLike={() => handleLike(comment.id)}
                />
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-sm font-semibold"
                >
                  <HiReply className="w-4 h-4" />
                  Ответить
                </button>
              </div>

              {/* Форма ответа */}
              {replyingTo === comment.id && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                  <CommentForm
                    onSubmit={(content) => handleAddReply(comment.id, content)}
                    placeholder="Написать ответ..."
                    replyTo={comment}
                  />
                </div>
              )}

              {/* Ответы на комментарий */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-200 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <UserAvatar user={reply.author} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {reply.author.first_name} {reply.author.last_name}
                          </span>
                          <span className="text-xs text-slate-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{reply.content}</p>
                        <div className="mt-2">
                          <LikeButton
                            isLiked={communityService.isCommentLiked(reply.id)}
                            likes={reply.likes}
                            onLike={() => handleLike(reply.id)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
