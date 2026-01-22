'use client'

import { useState, useEffect } from 'react'
import Card from '../Card'
import Badge from '../Badge'
import UserAvatar from './UserAvatar'
import LikeButton from './LikeButton'
import CommentList from './CommentList'
import CommentForm from './CommentForm'
import { communityService } from '../../services/communityService'
import { HiEye, HiChat, HiLockClosed, HiPencil } from 'react-icons/hi'

export default function TopicDetail({ topic, onCommentAdded }) {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [likes, setLikes] = useState(topic.likes)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    loadComments()
    setIsLiked(communityService.isTopicLiked(topic.id))
  }, [topic.id])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const data = await communityService.getTopicComments(topic.id)
      setComments(data.results || [])
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      const result = await communityService.likeTopic(topic.id)
      setLikes(result.likes)
      setIsLiked(result.liked)
    } catch (error) {
      console.error('Ошибка при лайке:', error)
    }
  }

  const handleAddComment = async (content) => {
    try {
      await communityService.addComment(topic.id, { content })
      await loadComments()
      if (onCommentAdded) onCommentAdded()
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error)
      throw error
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Тема */}
      <Card variant="glass" className="p-6 md:p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {topic.isPinned && (
              <Badge variant="accent" size="sm">
                Закреплено
              </Badge>
            )}
            {topic.isLocked && (
              <Badge variant="outline" size="sm">
                <HiLockClosed className="w-3 h-3 mr-1" />
                Закрыто
              </Badge>
            )}
            {topic.tags?.map((tag, idx) => (
              <Badge key={idx} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{topic.title}</h1>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-app-border">
          <UserAvatar user={topic.author} size="lg" showOnline />
          <div className="flex-1">
            <div className="font-extrabold text-slate-900">
              {topic.author.first_name} {topic.author.last_name}
            </div>
            <div className="text-sm text-slate-600">{formatDate(topic.createdAt)}</div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <HiEye className="w-4 h-4" />
              <span>{topic.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiChat className="w-4 h-4" />
              <span>{topic.replies}</span>
            </div>
            <LikeButton
              isLiked={isLiked}
              likes={likes}
              onLike={handleLike}
            />
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{topic.content}</p>
        </div>
      </Card>

      {/* Комментарии */}
      <Card variant="glass" className="p-6 md:p-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
          Комментарии ({comments.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка комментариев...</p>
          </div>
        ) : (
          <>
            <CommentList
              comments={comments}
              topicId={topic.id}
              onCommentAdded={onCommentAdded}
            />
            <div className="mt-8 pt-6 border-t border-app-border">
              <CommentForm onSubmit={handleAddComment} />
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
