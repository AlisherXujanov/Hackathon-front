'use client'

import { useState } from 'react'
import Card from '../../components/Card'
import Select from '../../components/Select'
import ScrollAnimation from '../../components/ScrollAnimation'
import { FaTrophy, FaAward, FaMedal } from 'react-icons/fa'

export default function LeaderboardPage() {
  const [period, setPeriod] = useState('daily')
  const [subject, setSubject] = useState('all')

  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ]

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'english', label: 'English' },
    { value: 'programming', label: 'Programming' },
  ]

  const leaderboardData = [
    { rank: 1, username: 'User1', points: 1250, avatar: 'U1', medal: 'gold' },
    { rank: 2, username: 'User2', points: 1100, avatar: 'U2', medal: 'silver' },
    { rank: 3, username: 'User3', points: 980, avatar: 'U3', medal: 'bronze' },
    { rank: 4, username: 'User4', points: 850, avatar: 'U4' },
    { rank: 5, username: 'User5', points: 720, avatar: 'U5' },
  ]

  const getMedalIcon = (medal) => {
    switch (medal) {
      case 'gold':
        return <FaTrophy className="w-6 h-6 text-yellow-500" />
      case 'silver':
        return <FaMedal className="w-6 h-6 text-gray-400" />
      case 'bronze':
        return <FaAward className="w-6 h-6 text-orange-600" />
      default:
        return null
    }
  }

  const getRankBgColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100'
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100'
    return 'bg-white'
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Leaderboard</h1>
            <p className="text-gray-600">Compete with others and see your ranking</p>
          </div>
        </ScrollAnimation>
        
        {/* Filters */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="period"
                label="Period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                options={periods}
              />
              <Select
                id="subject"
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                options={subjects}
              />
            </div>
          </Card>
        </ScrollAnimation>

        {/* Leaderboard */}
        <ScrollAnimation delay={200}>
          <Card variant="glass" className="overflow-hidden">
            <div className="divide-y divide-gray-200">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`p-6 flex items-center justify-between transition-colors ${getRankBgColor(entry.rank)}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12">
                      {entry.medal ? (
                        getMedalIcon(entry.medal)
                      ) : (
                        <div className="text-2xl font-bold text-gray-400">#{entry.rank}</div>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                      entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      entry.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-primary-500 to-accent-500'
                    }`}>
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{entry.username}</div>
                      <div className="text-sm text-gray-500">{entry.points.toLocaleString()} points</div>
                    </div>
                  </div>
                  {entry.rank <= 3 && (
                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                      entry.rank === 1 ? 'bg-yellow-200 text-yellow-800' :
                      entry.rank === 2 ? 'bg-gray-200 text-gray-800' :
                      'bg-orange-200 text-orange-800'
                    }`}>
                      Top {entry.rank}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
