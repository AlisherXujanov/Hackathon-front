'use client'

import Card from '../../../components/Card'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiBookOpen, HiArrowRight } from 'react-icons/hi'

export default function ReadingPage() {
  const levels = [
    {
      title: 'Beginner Level',
      description: 'Simple texts with basic vocabulary and comprehension questions.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Intermediate Level',
      description: 'More complex texts with detailed comprehension exercises.',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Reading Comprehension</h1>
            <p className="text-base md:text-lg text-gray-600">Improve your reading skills with various texts and exercises.</p>
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {levels.map((level, index) => (
            <ScrollAnimation key={level.title} delay={index * 100}>
              <Card variant="glass" className="p-6 md:p-8 h-full group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <HiBookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">{level.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{level.description}</p>
                <Button variant="ghost" className="group-hover:text-primary-600 transition-colors">
                  Start Reading
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
