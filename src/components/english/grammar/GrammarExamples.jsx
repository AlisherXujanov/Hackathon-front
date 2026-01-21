'use client'

import Card from '../../Card'
import { HiCheckCircle } from 'react-icons/hi'
import SectionHeader from './shared/SectionHeader'
import GrammarEmptyState from './shared/GrammarEmptyState'
import { HiLightBulb } from 'react-icons/hi'
import { getLocalizedContent } from '../../../utils/english/grammarUtils'

export default function GrammarExamples({ topic, language = 'en' }) {
  const examples = topic.example_sentences || []

  if (examples.length === 0) {
    return <GrammarEmptyState message="No example sentences available for this topic." />
  }

  return (
    <div className="space-y-4">
      <Card variant="glass" className="p-6">
        <SectionHeader
          icon={HiLightBulb}
          title="Example Sentences"
          description="Study these examples to understand how this grammar topic is used in context."
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example, index) => (
          <Card key={index} variant="glass" className="p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <HiCheckCircle className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium leading-relaxed">
                  {example}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Real-world Context */}
      {topic.real_world_context && (
        <Card variant="glass" className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {getLocalizedContent(topic.real_world_context, language)?.title || 'Real-World Context'}
          </h3>
          <p className="text-gray-700 mb-3 leading-relaxed">
            {getLocalizedContent(topic.real_world_context, language)?.description || ''}
          </p>
          {getLocalizedContent(topic.real_world_context, language)?.example && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-primary-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Example:</p>
              <p className="text-gray-900 font-medium italic">
                {getLocalizedContent(topic.real_world_context, language).example}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
