'use client'

import Card from '../../../components/Card'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiLightBulb, HiCollection, HiClipboardCheck, HiArrowRight } from 'react-icons/hi'

export default function VocabularyPage() {
  const activities = [
    {
      title: 'Flashcards',
      description: 'Learn new words with interactive flashcards.',
      icon: HiLightBulb,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Word Lists',
      description: 'Browse curated word lists by topic and difficulty.',
      icon: HiCollection,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Vocabulary Quiz',
      description: 'Test your knowledge with vocabulary quizzes.',
      icon: HiClipboardCheck,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Vocabulary Builder</h1>
            <p className="text-base md:text-lg text-gray-600">Expand your vocabulary with flashcards, quizzes, and word lists.</p>
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <ScrollAnimation key={activity.title} delay={index * 100}>
                <Card variant="glass" className="p-6 h-full group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{activity.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
                  <Button variant="ghost" className="group-hover:text-primary-600 transition-colors">
                    {activity.title === 'Word Lists' ? 'Browse Lists' : activity.title === 'Vocabulary Quiz' ? 'Take Quiz' : 'Start Learning'}
                    <HiArrowRight className="ml-2" />
                  </Button>
                </Card>
              </ScrollAnimation>
            )
          })}
        </div>
      </div>
    </main>
  )
}
