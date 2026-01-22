'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import { 
  HiBookOpen, 
  HiCode, 
  HiAcademicCap, 
  HiChartBar, 
  HiSparkles,
  HiArrowRight,
  HiUsers,
  HiLightBulb,
  HiGlobe,
  HiTrendingUp
} from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function AboutPage() {
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    success: 0,
    countries: 0,
  })

  useEffect(() => {
    const targets = { students: 10000, courses: 50, success: 95, countries: 120 }
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const timers = Object.keys(targets).map((key) => {
      const target = targets[key]
      const increment = target / steps
      let current = 0

      return setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, interval)
    })

    return () => timers.forEach(clearInterval)
  }, [])

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
    <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section with Logo */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-secondary-50/50" />
        <div className="container-wrapper relative">
          <ScrollAnimation>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12 md:mb-16">
              {/* Logo */}
              <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/assets/images/logos/logo_x.png" 
                  alt="FrameSchool Logo" 
                  className="h-24 md:h-32 w-auto drop-shadow-2xl"
                />
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                  О нашей платформе
                </h1>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-3 md:mb-4">
                  FrameSchool — это инновационная образовательная платформа, созданная для комплексного изучения английского языка, программирования и подготовки к экзаменам с использованием искусственного интеллекта.
                </p>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Мы объединяем лучшие практики обучения с современными технологиями, чтобы помочь вам достичь ваших образовательных целей быстрее и эффективнее.
                </p>
              </div>
            </div>
          </ScrollAnimation>

          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            <ScrollAnimation delay={100}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 ease-out p-6 md:p-8 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4 mx-auto">
                    <HiUsers className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-block text-3xl md:text-4xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700 mb-2">
                    {counters.students.toLocaleString()}+
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">Активных студентов</div>
                  <div className="text-xs text-gray-500">Учатся ежедневно</div>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={200}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-secondary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 ease-out p-6 md:p-8 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-600 mb-4 mx-auto">
                    <HiBookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-block text-3xl md:text-4xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-secondary-700 mb-2">
                    {counters.courses}+
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">Экспертных курсов</div>
                  <div className="text-xs text-gray-500">Комплексный контент</div>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation delay={300}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 ease-out p-6 md:p-8 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 mb-4 mx-auto">
                    <HiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-block text-3xl md:text-4xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-700 mb-2">
                    {counters.success}%
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">Успешность</div>
                  <div className="text-xs text-gray-500">Достижения студентов</div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform scale-95 group-hover:scale-100" />
                <div className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 ease-out p-6 md:p-8 text-center border border-gray-200/70 group-hover:border-transparent group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4 mx-auto">
                    <HiGlobe className="w-6 h-6 text-white" />
                  </div>
                  <div className="inline-block text-3xl md:text-4xl font-bold leading-tight pb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-700 mb-2">
                    {counters.countries}+
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">Стран</div>
                  <div className="text-xs text-gray-500">По всему миру</div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                Наша миссия
              </h2>
              
              <div className="space-y-4 md:space-y-5 text-base text-gray-700 leading-relaxed">
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 md:p-5 border-l-4 border-primary-500">
                  <h3 className="text-lg font-semibold mb-2 md:mb-3 text-gray-900 flex items-center">
                    <HiLightBulb className="w-5 h-5 text-primary-600 mr-2" />
                    Инновационный подход к обучению
                  </h3>
                  <p className="text-sm md:text-base">
                    FrameSchool использует передовые технологии искусственного интеллекта для персонализации обучения. 
                    Наша платформа адаптируется под индивидуальные потребности каждого студента, обеспечивая оптимальный 
                    темп и методы обучения.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-secondary-50 to-accent-50 rounded-xl p-4 md:p-5 border-l-4 border-secondary-500">
                  <h3 className="text-lg font-semibold mb-2 md:mb-3 text-gray-900 flex items-center">
                    <HiAcademicCap className="w-5 h-5 text-secondary-600 mr-2" />
                    Комплексное образование
                  </h3>
                  <p className="text-sm md:text-base">
                    Мы предлагаем широкий спектр курсов: от изучения английского языка и грамматики до программирования 
                    и подготовки к экзаменам SAT. Каждый курс разработан экспертами в своей области и включает интерактивные 
                    упражнения, практические задания и систему отслеживания прогресса.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl p-4 md:p-5 border-l-4 border-accent-500">
                  <h3 className="text-lg font-semibold mb-2 md:mb-3 text-gray-900 flex items-center">
                    <HiSparkles className="w-5 h-5 text-accent-600 mr-2" />
                    Искусственный интеллект в обучении
                  </h3>
                  <p className="text-sm md:text-base">
                    Наш AI-ассистент помогает студентам 24/7, отвечая на вопросы, объясняя сложные концепции и предоставляя 
                    персонализированные рекомендации. Это делает обучение более эффективным и доступным для всех.
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Наши возможности
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Исследуйте все функции платформы и начните свой путь к успеху
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
                      className={`${feature.size} p-6 md:p-8 h-full group cursor-pointer hover:shadow-2xl transition-all duration-300`}
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
                        Начать
                        <HiArrowRight className="ml-2 w-5 h-5" />
                      </div>
                    </Card>
                  </Link>
                </ScrollAnimation>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
