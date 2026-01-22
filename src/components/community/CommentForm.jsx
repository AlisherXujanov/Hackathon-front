'use client'

import { useState } from 'react'
import Button from '../Button'
import Textarea from '../Textarea'
import UserAvatar from './UserAvatar'
import { HiPaperAirplane } from 'react-icons/hi'
import { authService } from '../../services/api'

export default function CommentForm({ onSubmit, placeholder = 'Написать комментарий...', replyTo = null }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUser = authService.getCurrentUser()
  const userData = currentUser?.data || currentUser

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent('')
    } catch (error) {
      console.error('Ошибка при отправке комментария:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-3">
        <UserAvatar user={userData} size="md" />
        <div className="flex-1">
          {replyTo && (
            <div className="mb-2 text-sm text-slate-600">
              Ответ на комментарий от {replyTo.author?.first_name}
            </div>
          )}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="resize-none"
          />
          <div className="mt-2 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!content.trim() || isSubmitting}
              rightIcon={<HiPaperAirplane />}
            >
              Отправить
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
