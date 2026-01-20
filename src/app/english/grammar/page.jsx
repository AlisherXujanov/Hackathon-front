'use client'

import Card from '../../../components/Card'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiBookOpen, HiArrowRight } from 'react-icons/hi'

export default function GrammarPage() {
  const topics = [
    {
      title: 'Present Tense',
      description: 'Learn about present simple, continuous, and perfect tenses.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Past Tense',
      description: 'Master past simple, continuous, and perfect tenses.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Future Tense',
      description: 'Understand future forms and their usage.',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">English Grammar</h1>
            <p className="text-base md:text-lg text-gray-600">Learn and practice English grammar rules and exercises.</p>
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <ScrollAnimation key={topic.title} delay={index * 100}>
              <Card variant="glass" className="p-6 h-full group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <HiBookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{topic.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{topic.description}</p>
                <Button variant="ghost" className="group-hover:text-primary-600 transition-colors">
                  Start Learning
                  <HiArrowRight className="ml-2" />
                </Button>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </main>
  )
}
