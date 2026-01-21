'use client'

import { useMemo, useState } from 'react'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiUsers, HiClipboardList, HiKey, HiChartBar, HiSparkles, HiClock, HiSearch, HiFilter } from 'react-icons/hi'

export default function ClassDetailPage({ params }) {
  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const students = [
    { id: 1, name: 'Student Name 1', progress: 75, status: 'On track' },
    { id: 2, name: 'Student Name 2', progress: 90, status: 'Excellent' },
    { id: 3, name: 'Student Name 3', progress: 60, status: 'Needs help' },
    { id: 4, name: 'Student Name 4', progress: 82, status: 'On track' },
    { id: 5, name: 'Student Name 5', progress: 47, status: 'Needs help' },
  ]

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return students.filter((student) => {
      const matchesQuery = normalizedQuery
        ? student.name.toLowerCase().includes(normalizedQuery)
        : true
      const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus
      return matchesQuery && matchesStatus
    })
  }, [query, selectedStatus, students])

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl animate-pulse" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
      </div>
      <div className="container-wrapper relative pt-22 pb-10 md:pt-24 md:pb-14">
        <div className="relative mb-10 md:mb-12">
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <ScrollAnimation>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 mb-4 tracking-wide">
                  Cohort Overview
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 text-slate-900 font-display">
                  Class Details
                </h1>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-accent">
                  Manage your learning space, monitor performance, and keep progress steady with clear insights.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Updated 2 hours ago</span>
                  <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Avg. progress 78%</span>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={150}>
              <div className="flex items-center gap-3">
                <Badge variant="primary" className="flex items-center space-x-2 px-4 py-2">
                  <HiKey className="w-4 h-4" />
                  <span>Invite Code: ABC123</span>
                </Badge>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600">
                  <HiClock className="h-4 w-4" />
                  Next session in 2 days
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>

        <ScrollAnimation delay={220}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-200/40 blur-2xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-slate-500">Active Learners</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">24</p>
              <p className="text-sm text-emerald-600 mt-2">+4 new this month</p>
              <div className="mt-4 flex items-center gap-2">
                {[32, 60, 40, 72, 55, 90, 68].map((value, index) => (
                  <span
                    key={`learners-${index}`}
                    className="h-6 w-1.5 rounded-full bg-gradient-to-t from-emerald-200 via-emerald-400 to-emerald-500"
                    style={{ height: `${Math.max(12, value / 2)}px` }}
                  />
                ))}
              </div>
            </Card>
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden group">
              <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-slate-500">Completion Rate</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">86%</p>
              <p className="text-sm text-blue-600 mt-2">+9% since last cycle</p>
              <div className="mt-4 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-300 animate-pulse" />
              </div>
            </Card>
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-amber-200/40 blur-2xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-slate-500">Assignments Due</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">3</p>
              <p className="text-sm text-amber-600 mt-2">Next deadline in 48h</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Due window opening soon
              </div>
            </Card>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={280}>
          <Card variant="glass" className="p-6 md:p-8 mb-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.7),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold uppercase tracking-[0.2em]">
                  <HiSparkles className="h-4 w-4" />
                  Class Focus
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold mt-2 text-slate-900 font-display">Advanced Grammar Sprint</h2>
                <p className="text-slate-600 mt-2 leading-relaxed font-accent">
                  Deep dive into advanced grammar structures, peer review sessions, and guided writing labs.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary" className="flex items-center space-x-2 px-4 py-2">
                  <HiKey className="w-4 h-4" />
                  <span>Invite Code: ABC123</span>
                </Badge>
                <Badge variant="secondary" className="flex items-center space-x-2 px-4 py-2 text-slate-700">
                  <HiChartBar className="w-4 h-4" />
                  <span>Health score 92</span>
                </Badge>
              </div>
            </div>
          </Card>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation delay={320}>
            <Card variant="glass" className="p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.7),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center space-x-2 mb-6">
                <HiUsers className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl md:text-2xl font-semibold font-display">Students</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600">
                  <HiSearch className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="bg-transparent outline-none placeholder:text-slate-400"
                    placeholder="Search students"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600">
                  <HiFilter className="h-4 w-4" />
                  {['All', 'On track', 'Excellent', 'Needs help'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`rounded-full px-2 py-1 transition-all ${
                        selectedStatus === status
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-emerald-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {filteredStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-4 bg-white/70 rounded-xl border border-white/70 hover:bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">Active in discussion thread #{index + 1}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 font-medium">{student.progress}%</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.status === 'Excellent'
                          ? 'bg-emerald-100 text-emerald-700'
                          : student.status === 'Needs help'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                ))}
                {!filteredStudents.length && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                    No students found. Try another search or status filter.
                  </div>
                )}
              </div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={380}>
            <Card variant="glass" className="p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.7),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center space-x-2 mb-6">
                <HiClipboardList className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl md:text-2xl font-semibold font-display">Activities</h3>
              </div>
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Weekly energy</span>
                  <span className="text-emerald-600 font-semibold">+8%</span>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  {[18, 28, 20, 32, 24, 36, 30].map((value, index) => (
                    <span
                      key={`activity-${index}`}
                      className="w-3 rounded-full bg-gradient-to-t from-amber-200 via-amber-400 to-orange-400"
                      style={{ height: `${value}px` }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  'Grammar lab: Passive voice mastery session',
                  'Live review: Error patterns & feedback',
                  'Writing sprint: 20-minute essay drill',
                ].map((activity, index) => (
                  <div
                    key={activity}
                    className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-sm text-slate-500">Today • Session {index + 1}</p>
                    <p className="text-slate-900 font-medium mt-1">{activity}</p>
                  </div>
                ))}
                <div className="rounded-xl bg-slate-900 text-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Next highlight</p>
                  <p className="text-white mt-1">Peer review meetup — Thu, 4:00 PM</p>
                </div>
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
