'use client'

import Card from '../Card'
import { FaTrophy } from 'react-icons/fa'

export default function LeaderboardWidget({ users, currentUserId, limit = 5 }) {
  const displayedUsers = users.slice(0, limit)
  const currentUserIndex = users.findIndex(u => u.id === currentUserId)

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500'
    if (rank === 2) return 'text-slate-400'
    if (rank === 3) return 'text-orange-600'
    return 'text-slate-600'
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaTrophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-extrabold text-slate-900">Топ игроков</h3>
      </div>
      
      <div className="space-y-2">
        {displayedUsers.map((user, index) => {
          const rank = index + 1
          const isCurrentUser = user.id === currentUserId
          
          return (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50'
              }`}
            >
              <div className={`w-8 text-center font-extrabold ${getRankColor(rank)}`}>
                {getRankIcon(rank) || rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 truncate">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs text-slate-600">@{user.username}</div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-slate-900">{user.total_points?.toLocaleString() || 0}</div>
                <div className="text-xs text-slate-500">очков</div>
              </div>
            </div>
          )
        })}
      </div>
      
      {currentUserIndex >= limit && (
        <div className="mt-4 pt-4 border-t border-app-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <div className="w-8 text-center font-extrabold text-slate-600">
              {currentUserIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900">Ваше место</div>
            </div>
            <div className="text-right">
              <div className="font-extrabold text-slate-900">
                {users[currentUserIndex]?.total_points?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
