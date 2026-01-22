'use client'

import Card from '../../../Card'

/**
 * Stat Card Component
 * Reusable stat card with icon, label, and value
 */
export default function StatCard({ icon: Icon, label, value, iconBgColor = 'bg-primary-100', iconColor = 'text-primary-600', className = '' }) {
  return (
    <Card variant="glass" className={`p-3 md:p-5 ${className}`}>
      <div className="flex items-center gap-2.5 md:gap-4">
        {Icon && (
          <div className={`p-2 md:p-3 ${iconBgColor} rounded-lg flex-shrink-0`}>
            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </Card>
  )
}
