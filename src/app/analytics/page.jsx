'use client'

import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import { HiClock, HiBookOpen, HiCheckCircle, HiFire } from 'react-icons/hi'

export default function AnalyticsPage() {
  const stats = [
    {
      label: 'Total Learning Hours',
      value: '45.5',
      icon: HiClock,
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
    },
    {
      label: 'Lessons Completed',
      value: '32',
      icon: HiBookOpen,
      color: 'success',
      gradient: 'from-success-500 to-success-600',
    },
    {
      label: 'Tasks Completed',
      value: '28',
      icon: HiCheckCircle,
      color: 'info',
      gradient: 'from-info-500 to-info-600',
    },
    {
      label: 'Current Streak',
      value: '7 days',
      icon: HiFire,
      color: 'accent',
      gradient: 'from-accent-500 to-accent-600',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Analytics</h1>
            <p className="text-gray-600">Track your learning progress and insights</p>
          </div>
        </ScrollAnimation>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <ScrollAnimation key={stat.label} delay={index * 100}>
                <Card variant="glass" className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
                  <p className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                    {stat.value}
                  </p>
                </Card>
              </ScrollAnimation>
            )
          })}
        </div>

        {/* Visualization Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation delay={400}>
            <Card variant="glass" className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">Learning Progress</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <p className="text-gray-500">Progress charts will be displayed here</p>
              </div>
            </Card>
          </ScrollAnimation>
          
          <ScrollAnimation delay={500}>
            <Card variant="glass" className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">Activity Timeline</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <p className="text-gray-500">Activity timeline will be displayed here</p>
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
