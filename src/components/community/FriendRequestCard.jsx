'use client'

import Card from '../Card'
import Button from '../Button'
import UserAvatar from './UserAvatar'
import { HiCheck, HiX } from 'react-icons/hi'
import { communityService } from '../../services/communityService'

export default function FriendRequestCard({ request, onRespond }) {
  const handleAccept = async () => {
    try {
      await communityService.acceptFriendRequest(request.id)
      if (onRespond) onRespond(request.id, 'accepted')
    } catch (error) {
      console.error('Ошибка при принятии запроса:', error)
      alert(error.message || 'Произошла ошибка')
    }
  }

  const handleReject = async () => {
    try {
      await communityService.rejectFriendRequest(request.id)
      if (onRespond) onRespond(request.id, 'rejected')
    } catch (error) {
      console.error('Ошибка при отклонении запроса:', error)
      alert(error.message || 'Произошла ошибка')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-4">
        <UserAvatar user={request.from} size="lg" showOnline />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">
            {request.from.first_name} {request.from.last_name}
          </h3>
          <p className="text-sm text-slate-600 mb-1">@{request.from.username}</p>
          {request.message && (
            <p className="text-sm text-slate-700 mb-3">{request.message}</p>
          )}
          <p className="text-xs text-slate-500 mb-3">{formatDate(request.createdAt)}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<HiCheck />}
              onClick={handleAccept}
              className="rounded-xl"
            >
              Принять
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<HiX />}
              onClick={handleReject}
              className="rounded-xl"
            >
              Отклонить
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
