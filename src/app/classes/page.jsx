'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import ScrollAnimation from '../../components/ScrollAnimation'
import { HiPlus, HiUsers, HiArrowRight, HiX, HiSparkles, HiChartBar } from 'react-icons/hi'

export default function ClassesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const classes = [
    {
      id: 1,
      name: 'Advanced English Grammar',
      description: 'Master complex grammar rules and improve your writing skills',
      students: 12,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming',
      students: 8,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      name: 'Business English',
      description: 'Professional communication and business writing',
      students: 15,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
      </div>
      <div className="container-wrapper relative pt-24 pb-10 sm:pt-28 md:pt-28 md:pb-14">
        <div className="relative mb-10 md:mb-12">
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <ScrollAnimation>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 mb-4 tracking-wide">
                  Instructor Workspace
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 text-slate-900 font-display break-words">
                  My Classes
                </h1>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-accent break-words">
                  Organize cohorts, monitor engagement, and keep every learner on track with a clear, structured view.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Semester: Spring 2026</span>
                  <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">Overall engagement 92%</span>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={150}>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="primary"
                  leftIcon={<HiPlus />}
                  className="shadow-xl shadow-emerald-500/20"
                >
                  Create Class
                </Button>
                <Button variant="secondary" className="border-slate-200 text-slate-700 w-full sm:w-auto">
                  View Insights
                </Button>
              </div>
            </ScrollAnimation>
          </div>
        </div>

        <ScrollAnimation delay={220}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-200/40 blur-2xl animate-float" />
              <p className="text-sm text-slate-500">Active Classes</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">{classes.length}</p>
              <p className="text-sm text-emerald-600 mt-2">+2 this month</p>
            </Card>
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden">
              <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl animate-float" />
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">
                {classes.reduce((total, item) => total + item.students, 0)}
              </p>
              <p className="text-sm text-blue-600 mt-2">92% average attendance</p>
            </Card>
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-amber-200/40 blur-2xl animate-float" />
              <p className="text-sm text-slate-500">Upcoming Sessions</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">5</p>
              <p className="text-sm text-amber-600 mt-2">Next one in 2 days</p>
            </Card>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map((classItem, index) => (
            <ScrollAnimation key={classItem.id} delay={index * 140}>
              <Link href={`/classes/${classItem.id}`}>
                <Card variant="glass" className="p-6 h-full group cursor-pointer relative overflow-hidden">
                  <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/50 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${classItem.color} flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300 animate-float`}>
                      <HiUsers className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active</span>
                  </div>
                  <h3 className="text-xl font-semibold mt-5 mb-2 text-slate-900 group-hover:text-emerald-600 transition-colors font-display">
                    {classItem.name}
                  </h3>
                  <p className="text-slate-600 mb-5 leading-relaxed">
                    {classItem.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 flex items-center">
                      <HiUsers className="w-4 h-4 mr-1" />
                      {classItem.students} students
                    </span>
                    <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                      View Class
                      <HiArrowRight className="ml-1 w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-5 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full w-2/3 bg-gradient-to-r ${classItem.color} transition duration-500 group-hover:brightness-110 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.25)]`} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Last updated 2 days ago</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">On track</span>
                  </div>
                </Card>
              </Link>
            </ScrollAnimation>
          ))}
        </div>

        {/* Premium Dark Section */}
        <ScrollAnimation delay={320}>
          <div className="mt-12 rounded-3xl bg-slate-950 text-white p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.28),_transparent_60%)]" />
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/30 blur-3xl animate-pulse" />
            <div className="absolute -left-6 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl animate-pulse" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 text-emerald-200">
                  <HiSparkles className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.2em]">Premium Insight</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold mt-2 font-display text-white">
                  <span className="bg-emerald-400/20 px-2 py-1 rounded-lg">Your cohort health is trending upward</span>
                </h2>
                <p className="text-white/70 mt-3 leading-relaxed font-accent">
                  Spotlight the groups that need attention, and keep growth steady with curated checkpoints and smart follow-ups.
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                    <HiChartBar className="h-4 w-4 text-emerald-300" />
                    Weekly pulse: 4.8/5
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    6 learners celebrated this week
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm text-white/60">Engagement Lift</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300" />
                  </div>
                  <p className="text-2xl font-semibold text-emerald-300 mt-2">+14%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm text-white/60">At-risk Learners</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-2/5 bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300" />
                  </div>
                  <p className="text-2xl font-semibold text-amber-300 mt-2">3</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Enhanced Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />

            <ScrollAnimation>
              <Card variant="glass" className="relative z-10 w-full max-w-lg p-5 sm:p-6 md:p-8 max-h-[85vh] overflow-y-auto">
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <HiX className="w-6 h-6" />
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6 pr-10">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 tracking-wide">
                      New cohort
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mt-3 font-display">
                      Create New Class
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-accent">
                      Set up a focused learning space with a clear goal and timeline.
                    </p>
                    <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]" />
                  </div>
                </div>

                <form className="space-y-5">
                  <Input
                    id="className"
                    label="Class Name"
                    placeholder="Enter class name"
                    required
                  />

                  <Input
                    id="maxParticipants"
                    label="Max Participants"
                    placeholder="e.g. 24"
                    type="number"
                    min="1"
                    required
                  />

                  <Textarea
                    id="description"
                    label="Description"
                    placeholder="Enter class description"
                    rows={4}
                    required
                  />

                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Tip: Add a short goal so students understand the outcome for this class.
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                    >
                      Create Class
                    </Button>
                  </div>
                </form>
              </Card>
            </ScrollAnimation>
          </div>
        )}
      </div>
    </main>
  )
}
