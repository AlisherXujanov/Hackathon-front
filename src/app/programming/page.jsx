'use client'

import Link from 'next/link'
import Card from '../../components/Card'
import Button from '../../components/Button'
import ScrollAnimation from '../../components/ScrollAnimation'
import { HiCode, HiClipboardCheck, HiArrowRight, HiSparkles } from 'react-icons/hi'

export default function ProgrammingPage() {
  const options = [
    {
      id: 'tests',
      title: 'Тесты и Задачи',
      description: 'Проверьте свои знания программирования, решая практические задачи и тесты различной сложности. От простых упражнений до сложных алгоритмических задач.',
      icon: HiClipboardCheck,
      href: '/programming/tasks',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      bgGradient: 'from-purple-50 via-pink-50 to-red-50',
      features: [
        'Задачи разной сложности',
        'Множество языков программирования',
        'Отслеживание прогресса',
        'Интерактивные упражнения'
      ],
      buttonText: 'Начать тестирование',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      id: 'coding',
      title: 'Кодирование',
      description: 'Используйте интерактивную песочницу для написания и тестирования кода. Экспериментируйте с различными языками программирования и получайте мгновенную обратную связь.',
      icon: HiCode,
      href: '/programming/sandbox',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
      features: [
        'Песочница для кода',
        'Поддержка множества языков',
        'Мгновенный вывод результатов',
        'Редактор с подсветкой синтаксиса'
      ],
      buttonText: 'Открыть песочницу',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    }
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container-wrapper">
          <ScrollAnimation>
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Развивайте навыки
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                  программирования
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Выберите способ обучения: решайте практические задачи или экспериментируйте в интерактивной песочнице
              </p>
            </div>
          </ScrollAnimation>

          {/* Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
            {options.map((option, index) => {
              const Icon = option.icon
              return (
                <ScrollAnimation key={option.id} delay={index * 150}>
                  <Card 
                    variant="glass" 
                    className="relative overflow-hidden h-full group"
                    hover={true}
                  >
                    {/* Gradient Background Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Content */}
                    <div className="relative z-10 p-4 md:p-5">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg ${option.iconBg} flex items-center justify-center shadow-lg mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {option.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {option.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-1.5 mb-4">
                        {option.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${option.gradient} mr-2 flex-shrink-0`} />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button
                        asChild
                        variant="primary"
                        size="sm"
                        className={`w-full bg-gradient-to-r ${option.gradient} hover:shadow-2xl transform transition-all duration-300 group-hover:scale-105 text-white border-none text-sm`}
                      >
                        <Link href={option.href} className="inline-flex items-center justify-center w-full">
                          <span>{option.buttonText}</span>
                          <HiArrowRight className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>

                    {/* Decorative Corner Element */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${option.gradient} opacity-10 rounded-bl-full transform transition-transform duration-500 group-hover:scale-150`} />
                  </Card>
                </ScrollAnimation>
              )
            })}
          </div>

          {/* Additional Info Section */}
          <ScrollAnimation delay={300}>
            <div className="mt-16 text-center">
              <div className="inline-flex items-center px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/70">
                <div className="flex items-center space-x-2 text-gray-600">
                  <HiSparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-base font-medium">
                    Оба режима помогут вам стать лучше в программировании
                  </span>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </main>
  )
}