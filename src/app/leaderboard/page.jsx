'use client'

import { useState } from 'react'
import Card from '../../components/Card'
import Select from '../../components/Select'
import ScrollAnimation from '../../components/ScrollAnimation'
import { FaTrophy, FaAward, FaMedal } from 'react-icons/fa'
import { HiAdjustments } from 'react-icons/hi'

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
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl animate-pulse" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
      </div>
      <div className="container-wrapper relative pt-24 pb-10 sm:pt-28 md:pt-28 md:pb-14">
        <ScrollAnimation>
          <div className="relative mb-10 md:mb-12">
            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 mb-4 tracking-wide">
                  Competitive Mode
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 text-slate-900 font-display break-words">
                  Leaderboard
                </h1>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-accent break-words">
                  Compete with others and see your ranking.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                <Card variant="glass" hover={false} className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Participants</div>
                  <div className="text-2xl font-semibold text-slate-900 mt-2">{leaderboardData.length}</div>
                </Card>
                <Card variant="glass" hover={false} className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Top Score</div>
                  <div className="text-2xl font-semibold text-slate-900 mt-2">{leaderboardData[0].points.toLocaleString()}</div>
                </Card>
              </div>
            </div>
          </div>
        </ScrollAnimation>
        
        {/* Filters */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-5 sm:p-6 mb-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <HiAdjustments className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 font-display">Filters</div>
                  <div className="text-sm text-slate-600 font-accent">
                    Choose a period and subject to refine rankings
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="period"
                label="Period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                options={periods}
                className="rounded-xl border-slate-200 bg-white/80 backdrop-blur hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm hover:shadow-md transition-all"
              />
              <Select
                id="subject"
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                options={subjects}
                className="rounded-xl border-slate-200 bg-white/80 backdrop-blur hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </Card>
        </ScrollAnimation>

        {/* Leaderboard */}
        <ScrollAnimation delay={200}>
          <Card variant="glass" className="overflow-hidden">
            <div className="divide-y divide-slate-200/70">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.rank}
                  className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 ${getRankBgColor(entry.rank)} hover:shadow-lg hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-12 shrink-0">
                      {entry.medal ? (
                        getMedalIcon(entry.medal)
                      ) : (
                        <div className="text-2xl font-bold text-gray-400">#{entry.rank}</div>
                      )}
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0 ${
                      entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      entry.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-primary-500 to-accent-500'
                    }`}>
                      {entry.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-lg font-display truncate">{entry.username}</div>
                      <div className="text-sm text-slate-500">{entry.points.toLocaleString()} points</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">
                      {entry.points.toLocaleString()} pts
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
                </div>
              ))}
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
