'use client'

import { useState } from 'react'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import { HiUserCircle, HiChartBar, HiCog } from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HiUserCircle },
    { id: 'progress', label: 'Progress', icon: HiChartBar },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy },
    { id: 'settings', label: 'Settings', icon: HiCog },
  ]

  const stats = [
    { label: 'Total Points', value: '1,250', color: 'primary', icon: FaTrophy },
    { label: 'Streak Days', value: '7', color: 'success', icon: HiChartBar },
    { label: 'Lessons Completed', value: '45', color: 'info', icon: HiUserCircle },
    { label: 'Tasks Completed', value: '32', color: 'accent', icon: HiChartBar },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Profile Header with Gradient */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 py-12 md:py-16">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl">
                U
              </div>
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Username</h1>
                <p className="text-white/90 text-lg">user@example.com</p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        {/* Tabs */}
        <Card variant="glass" className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap space-x-1 px-4 md:px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-4 md:px-6 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <ScrollAnimation>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                      <Card key={stat.label} variant="stat" className="p-6">
                        <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                        <p className={`text-2xl md:text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      </Card>
                    )
                  })}
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'progress' && (
              <ScrollAnimation>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">Learning Progress</h3>
                  <Card variant="glass" className="p-6">
                    <p className="text-gray-600">Progress charts and statistics will be displayed here.</p>
                  </Card>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'achievements' && (
              <ScrollAnimation>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">Achievements</h3>
                  <Card variant="glass" className="p-6">
                    <p className="text-gray-600">Your achievements and badges will be displayed here.</p>
                  </Card>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'settings' && (
              <ScrollAnimation>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">Settings</h3>
                  <Card variant="glass" className="p-6">
                    <p className="text-gray-600">Account settings and preferences will be displayed here.</p>
                  </Card>
                </div>
              </ScrollAnimation>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
