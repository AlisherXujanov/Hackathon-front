'use client'

import ScrollAnimation from '../../../components/ScrollAnimation'
import Card from '../../../components/Card'
import { HiClipboardCheck, HiSparkles } from 'react-icons/hi'

export default function TestingPage() {
  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper pt-24 pb-10 sm:pt-28 md:pb-14 px-4 lg:px-8">
        <ScrollAnimation>
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <HiClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">
                  Testing & Assessment
                </h1>
                <p className="text-base md:text-lg text-gray-600">
                  Comprehensive tests to assess your English proficiency.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card variant="glass" className="p-12 max-w-2xl text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl">
                  <HiSparkles className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Coming Soon
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We're working hard to bring you comprehensive testing and assessment features. 
                This section will include placement tests, progress assessments, and detailed 
                performance analytics.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </Card>
          </div>
        </ScrollAnimation>
      </div>
    </main>
  )
}
