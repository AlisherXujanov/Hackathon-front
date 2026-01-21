'use client'

/**
 * Section Header Component
 * Reusable header component with icon and title
 */
export default function SectionHeader({ icon: Icon, title, description, className = '' }) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      {Icon && <Icon className="w-6 h-6 text-primary-600 flex-shrink-0" />}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="text-gray-600 mt-2">{description}</p>
        )}
      </div>
    </div>
  )
}
