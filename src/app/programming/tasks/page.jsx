'use client'

import { useState } from 'react'
import Card from '../../../components/Card'
import Select from '../../../components/Select'
import Badge from '../../../components/Badge'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiCode, HiArrowRight } from 'react-icons/hi'

export default function ProgrammingTasksPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ]

  const tasks = [
    {
      id: 1,
      title: 'FizzBuzz Challenge',
      description: 'Write a program that prints numbers from 1 to 100, but for multiples of 3 print "Fizz" and for multiples of 5 print "Buzz".',
      difficulty: 'beginner',
      language: 'python',
    },
    {
      id: 2,
      title: 'Array Manipulation',
      description: 'Implement various array operations including sorting, filtering, and mapping.',
      difficulty: 'intermediate',
      language: 'javascript',
    },
    {
      id: 3,
      title: 'Responsive Layout',
      description: 'Create a responsive website layout using HTML and CSS with mobile-first approach.',
      difficulty: 'intermediate',
      language: 'html',
    },
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'success'
      case 'intermediate':
        return 'warning'
      case 'advanced':
        return 'error'
      default:
        return 'primary'
    }
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper pt-24 sm:pt-28 pb-8 md:pb-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Programming Tasks</h1>
            <p className="text-base md:text-lg text-gray-600">Practice coding with various programming challenges.</p>
          </div>
        </ScrollAnimation>
        
        {/* Filters */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="difficulty"
                label="Difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                options={difficulties}
              />
              <Select
                id="language"
                label="Language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                options={languages}
              />
            </div>
          </Card>
        </ScrollAnimation>

        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <ScrollAnimation key={task.id} delay={index * 100}>
              <Card variant="glass" className="p-6 h-full group">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                    <HiCode className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant={getDifficultyColor(task.difficulty)}>
                    {task.difficulty}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{task.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 capitalize">{task.language}</span>
                  <Button variant="ghost" className="group-hover:text-primary-600 transition-colors">
                    Start Task
                    <HiArrowRight className="ml-2" />
                  </Button>
                </div>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </main>
  )
}
