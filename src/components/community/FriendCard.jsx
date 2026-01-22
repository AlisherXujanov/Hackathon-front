'use client'

import Link from 'next/link'
import Card from '../Card'
import Button from '../Button'
import UserAvatar from './UserAvatar'
import Badge from '../Badge'
import { HiUserRemove, HiChat } from 'react-icons/hi'
import { communityService } from '../../services/communityService'

export default function FriendCard({ friend, onRemove }) {
  const handleRemove = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm(`Удалить ${friend.first_name} ${friend.last_name} из друзей?`)) return
    
    try {
      await communityService.removeFriend(friend.id)
      if (onRemove) onRemove(friend.id)
    } catch (error) {
      console.error('Ошибка при удалении друга:', error)
      alert(error.message || 'Произошла ошибка')
    }
  }

  return (
    <Link href={`/community/friends/${friend.id}`}>
      <Card variant="glass" className="p-5 group hover:shadow-lg transition-all">
        <div className="flex items-center gap-4">
          <UserAvatar user={friend} size="lg" showOnline />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {friend.first_name} {friend.last_name}
                </h3>
                <p className="text-sm text-slate-600">@{friend.username}</p>
              </div>
              {friend.is_online && (
                <Badge variant="success" size="sm">
                  Онлайн
                </Badge>
              )}
            </div>
            {friend.mutualFriends !== undefined && (
              <p className="text-xs text-slate-500 mb-3">
                {friend.mutualFriends} общих друзей
              </p>
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={<HiChat />} className="rounded-xl">
                Написать
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<HiUserRemove />}
                onClick={handleRemove}
                className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
