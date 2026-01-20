'use client'

import { useState } from 'react'
import Card from '../../../components/Card'
import Textarea from '../../../components/Textarea'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiPencil, HiSparkles } from 'react-icons/hi'

export default function WritingPage() {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async () => {
    // TODO: Implement AI writing feedback
    setFeedback('AI feedback will appear here after submission.')
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Writing Practice</h1>
            <p className="text-base md:text-lg text-gray-600">Practice writing and get AI-powered feedback on your work.</p>
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-4">
                <HiPencil className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl md:text-2xl font-semibold">Write Your Text</h3>
              </div>
              <Textarea
                className="min-h-[300px]"
                placeholder="Start writing here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="mt-4 w-full"
              >
                Get Feedback
              </Button>
            </Card>
          </ScrollAnimation>
          
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-4">
                <HiSparkles className="w-6 h-6 text-accent-600" />
                <h3 className="text-xl md:text-2xl font-semibold">AI Feedback</h3>
              </div>
              <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                {feedback || <p className="text-gray-500">Your feedback will appear here...</p>}
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
