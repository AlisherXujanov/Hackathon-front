'use client'

import Card from '../../Card'
import { HiExclamationCircle } from 'react-icons/hi'
import SectionHeader from './shared/SectionHeader'
import GrammarEmptyState from './shared/GrammarEmptyState'
import MistakeComparison from './shared/MistakeComparison'
import { getLocalizedArray } from '../../../utils/english/grammarUtils'

export default function GrammarCommonMistakes({ topic, language = 'en' }) {
  const mistakes = getLocalizedArray(topic?.common_mistakes, language)

  if (mistakes.length === 0) {
    return <GrammarEmptyState message="No common mistakes information available for this topic." />
  }

  return (
    <div className="space-y-4">
      <Card variant="glass" className="p-6">
        <SectionHeader
          icon={HiExclamationCircle}
          title="Common Mistakes"
          description="Avoid these common errors when using this grammar topic. Pay attention to the differences between incorrect and correct usage."
        />
      </Card>

      <div className="space-y-4">
        {mistakes.map((mistake, index) => (
          <MistakeComparison key={index} mistake={mistake} index={index} />
        ))}
      </div>

      {/* Tips Card */}
      <Card variant="glass" className="p-6 bg-gradient-to-br from-warning-50 to-error-50 border-warning-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips to Avoid Mistakes</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-warning-600 mt-1">•</span>
            <span>Read each sentence carefully before choosing your answer</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning-600 mt-1">•</span>
            <span>Pay attention to subject-verb agreement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning-600 mt-1">•</span>
            <span>Review the theory section if you're unsure about a rule</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning-600 mt-1">•</span>
            <span>Practice regularly to reinforce correct usage</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
