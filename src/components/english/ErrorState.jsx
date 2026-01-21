'use client'

import Button from '../Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-red-800 font-medium">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
