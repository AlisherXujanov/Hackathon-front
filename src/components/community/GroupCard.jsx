'use client'

import Link from 'next/link'
import Card from '../Card'
import Badge from '../Badge'
import Button from '../Button'
import { HiUsers, HiChatAlt2 } from 'react-icons/hi'
import { communityService } from '../../services/communityService'

export default function GroupCard({ group, onJoin, onLeave }) {
  const isMember = communityService.isGroupMember(group.id)

  const handleToggleMembership = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      if (isMember) {
        await communityService.leaveGroup(group.id)
        if (onLeave) onLeave()
      } else {
        await communityService.joinGroup(group.id)
        if (onJoin) onJoin()
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert(error.message || 'Произошла ошибка')
    }
  }

  return (
    <Link href={`/community/groups/${group.id}`}>
      <Card variant="glass" className="p-6 h-full group hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${group.color}20` }}
            >
              {group.icon}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {group.name}
              </h3>
              <p className="text-sm text-slate-600 mt-1">{group.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <HiUsers className="w-4 h-4" />
              <span className="font-semibold">{group.membersCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiChatAlt2 className="w-4 h-4" />
              <span>{group.postsCount}</span>
            </div>
            <Badge variant="outline" size="sm">
              {group.category}
            </Badge>
          </div>
          <Button
            variant={isMember ? 'outline' : 'primary'}
            size="sm"
            onClick={handleToggleMembership}
            className="rounded-xl"
          >
            {isMember ? 'Выйти' : 'Присоединиться'}
          </Button>
        </div>
      </Card>
    </Link>
  )
}
