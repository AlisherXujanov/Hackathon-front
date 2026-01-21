'use client'

import Card from '../../../Card'

/**
 * Grammar Empty State Component
 * Specialized empty state for grammar sections
 */
export default function GrammarEmptyState({ message = 'No content available for this section.', className = '' }) {
  return (
    <Card variant="glass" className={`p-6 ${className}`}>
      <p className="text-gray-500 italic text-center py-8">
        {message}
      </p>
    </Card>
  )
}
