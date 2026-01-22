'use client'

import Link from 'next/link'
import Card from '../Card'
import Badge from '../Badge'
import UserAvatar from './UserAvatar'
import { HiEye, HiChat, HiThumbUp, HiLockClosed, HiPencil } from 'react-icons/hi'

export default function TopicCard({ topic }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Сегодня'
    if (diffDays === 1) return 'Вчера'
    if (diffDays < 7) return `${diffDays} дней назад`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  }

  return (
    <Link href={`/community/forums/${topic.forumId}/${topic.id}`}>
      <Card variant="glass" className="p-5 group hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          <UserAvatar user={topic.author} size="md" showOnline />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {topic.isPinned && (
                    <Badge variant="accent" size="sm">
                      Закреплено
                    </Badge>
                  )}
                  {topic.isLocked && (
                    <HiLockClosed className="w-4 h-4 text-slate-400" />
                  )}
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {topic.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{topic.content}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {topic.author.first_name} {topic.author.last_name}
              </span>
              <span>•</span>
              <span>{formatDate(topic.createdAt)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <HiEye className="w-4 h-4" />
                <span>{topic.views}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <HiChat className="w-4 h-4" />
                <span>{topic.replies}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <HiThumbUp className="w-4 h-4" />
                <span>{topic.likes}</span>
              </div>
            </div>
            {topic.tags && topic.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {topic.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
