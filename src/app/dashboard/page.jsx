'use client'

import Link from 'next/link'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import { 
  HiBookOpen, 
  HiCode, 
  HiAcademicCap, 
  HiChartBar, 
  HiSparkles,
  HiArrowRight
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function DashboardPage() {
  const features = [
    {
      href: '/english/grammar',
      title: 'English Grammar',
      description: 'Learn and practice English grammar with interactive exercises',
      icon: HiBookOpen,
      color: 'from-blue-500 to-cyan-500',
      size: 'col-span-1 md:col-span-2',
    },
    {
      href: '/programming/tasks',
      title: 'Programming Tasks',
      description: 'Solve coding challenges and improve your programming skills',
      icon: HiCode,
      color: 'from-purple-500 to-pink-500',
      size: 'col-span-1',
    },
    {
      href: '/classes',
      title: 'My Classes',
      description: 'Manage your classes and track student progress',
      icon: HiAcademicCap,
      color: 'from-green-500 to-emerald-500',
      size: 'col-span-1',
    },
    {
      href: '/leaderboard',
      title: 'Leaderboard',
      description: 'Compete with others and see your ranking',
      icon: FaTrophy,
      color: 'from-yellow-500 to-orange-500',
      size: 'col-span-1',
    },
    {
      href: '/analytics',
      title: 'Analytics',
      description: 'Track your learning progress and insights',
      icon: HiChartBar,
      color: 'from-indigo-500 to-blue-500',
      size: 'col-span-1 md:col-span-2',
    },
    {
      href: '/ai/conversation',
      title: 'AI Assistant',
      description: 'Get AI-powered help and personalized learning recommendations',
      icon: HiSparkles,
      color: 'from-violet-500 to-purple-500',
      size: 'col-span-1',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Dashboard
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              Welcome back! Continue your learning journey or explore new courses.
            </p>
          </div>
        </ScrollAnimation>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollAnimation key={feature.href} delay={index * 100}>
                <Link href={feature.href}>
                  <Card 
                    variant="glass" 
                    className={`${feature.size} p-6 md:p-8 h-full group cursor-pointer`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-1 transition-transform">
                      Get Started
                      <HiArrowRight className="ml-2 w-5 h-5" />
                    </div>
                  </Card>
                </Link>
              </ScrollAnimation>
            )
          })}
        </div>
      </div>
    </main>
  )
}
