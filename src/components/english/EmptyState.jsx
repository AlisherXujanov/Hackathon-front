'use client'

export default function EmptyState({ icon: Icon, title = 'No topics found', message = 'Try selecting a different level.' }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg font-medium">{title}</p>
      <p className="text-gray-400 text-sm mt-2">{message}</p>
    </div>
  )
}
