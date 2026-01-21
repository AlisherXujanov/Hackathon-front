'use client'

import Card from '../../Card'
import Button from '../../Button'
import Badge from '../../Badge'
import { HiLightBulb, HiExclamationCircle, HiArrowRight } from 'react-icons/hi'
import SectionHeader from './shared/SectionHeader'
import LearningObjectivesList from './shared/LearningObjectivesList'
import DifficultyBadge from './shared/DifficultyBadge'
import { getLocalizedArray, getLocalizedContent } from '../../../utils/english/grammarUtils'

export default function GrammarReview({ topic, language = 'en' }) {
  const subTopics = topic.sub_topics || []
  const examples = topic.example_sentences || []
  const mistakes = getLocalizedArray(topic?.common_mistakes, language)

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card variant="glass" className="p-6 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Topic Summary</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You've completed learning about <strong>{topic.topic}</strong>. Here's a quick review of what you've learned.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" className="text-sm font-semibold px-3 py-1">
            {topic.level}
          </Badge>
          {topic.difficulty && (
            <DifficultyBadge difficulty={topic.difficulty} />
          )}
          {topic.estimated_hours && (
            <Badge variant="primary" className="text-sm font-semibold px-3 py-1">
              {topic.estimated_hours}h estimated
            </Badge>
          )}
        </div>
      </Card>

      {/* Key Points */}
      <LearningObjectivesList topic={topic} language={language} showHeader={false} />

      {/* Sub-topics Quick Reference */}
      {subTopics.length > 0 && (
        <Card variant="glass" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sub-topics Covered</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subTopics.map((subTopic, index) => {
              const name = getLocalizedContent(subTopic.name, language) || `Subtopic ${index + 1}`
              return (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-gray-900 font-medium">{name}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Example Sentences */}
      {examples.length > 0 && (
        <Card variant="glass" className="p-6">
          <SectionHeader icon={HiLightBulb} title="Example Sentences" className="mb-4" />
          <div className="space-y-2">
            {examples.slice(0, 5).map((example, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-primary-500">
                <p className="text-gray-900">{example}</p>
              </div>
            ))}
            {examples.length > 5 && (
              <p className="text-sm text-gray-500 italic mt-2">
                + {examples.length - 5} more examples (see Examples section)
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Common Mistakes Reminder */}
      {mistakes.length > 0 && (
        <Card variant="glass" className="p-6 bg-gradient-to-br from-warning-50 to-error-50 border-warning-200">
          <SectionHeader icon={HiExclamationCircle} title="Remember to Avoid" className="mb-4" />
          <ul className="space-y-2">
            {mistakes.slice(0, 3).map((mistake, index) => {
              const parts = mistake.split('→')
              const incorrect = parts[0]?.trim()
              const correct = parts[1]?.trim()
              return (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-error-600 mt-1">✗</span>
                  <div className="flex-1">
                    {incorrect && (
                      <p className="text-gray-700 line-through decoration-error-600">
                        {incorrect}
                      </p>
                    )}
                    {correct && (
                      <p className="text-gray-900 font-semibold">
                        {correct}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
            {mistakes.length > 3 && (
              <p className="text-sm text-gray-600 italic mt-2">
                + {mistakes.length - 3} more common mistakes (see Common Mistakes section)
              </p>
            )}
          </ul>
        </Card>
      )}

      {/* Next Steps */}
      <Card variant="glass" className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">1</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold mb-1">Practice Exercises</p>
              <p className="text-gray-600 text-sm">
                Complete the practice exercises to reinforce your understanding of this grammar topic.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">2</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold mb-1">Review Theory</p>
              <p className="text-gray-600 text-sm">
                Revisit the theory section if you need to clarify any concepts or rules.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">3</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold mb-1">Move to Next Topic</p>
              <p className="text-gray-600 text-sm">
                Once you're comfortable with this topic, proceed to the next grammar topic in your level.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          variant="secondary"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <HiArrowRight className="w-5 h-5 rotate-[-90deg]" />
          Back to Top
        </Button>
        <Button
          href="/english/grammar"
          className="flex-1 flex items-center justify-center gap-2"
        >
          Browse More Topics
          <HiArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
