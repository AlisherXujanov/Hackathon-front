'use client'

import Card from '../../../components/Card'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiVolumeUp, HiClipboardList } from 'react-icons/hi'

export default function ListeningPage() {
  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <ScrollAnimation>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">Listening Practice</h1>
            <p className="text-base md:text-lg text-gray-600">Enhance your listening skills with audio exercises and comprehension tasks.</p>
          </div>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScrollAnimation delay={100}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-4">
                <HiVolumeUp className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl md:text-2xl font-semibold">Audio Exercise</h3>
              </div>
              <div className="mb-4">
                <audio controls className="w-full rounded-lg">
                  <source src="#" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <p className="text-gray-600 mb-4">Listen to the audio and answer the questions below.</p>
              <Button variant="ghost">
                Start Exercise
              </Button>
            </Card>
          </ScrollAnimation>
          
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-4">
                <HiClipboardList className="w-6 h-6 text-accent-600" />
                <h3 className="text-xl md:text-2xl font-semibold">Comprehension Questions</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2 text-gray-700">Question 1:</p>
                  <Input
                    placeholder="Your answer..."
                    className="w-full"
                  />
                </div>
                <div>
                  <p className="font-medium mb-2 text-gray-700">Question 2:</p>
                  <Input
                    placeholder="Your answer..."
                    className="w-full"
                  />
                </div>
              </div>
              <Button variant="primary" className="mt-4 w-full">
                Submit Answers
              </Button>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
