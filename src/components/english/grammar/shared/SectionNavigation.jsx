'use client'

import Card from '../../../Card'
import { SECTIONS } from '../../../../constants/grammarConstants'

/**
 * Section Navigation Component
 * Desktop and mobile navigation for grammar sections
 */
export default function SectionNavigation({ activeSection, onSectionChange, className = '' }) {
  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`hidden md:block mb-6 ${className}`}>
        <Card variant="glass" className="p-2">
          <nav className="flex flex-wrap gap-2" aria-label="Section navigation">
            {SECTIONS.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${
                      activeSection === section.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </nav>
        </Card>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden mb-6 ${className}`}>
        <Card variant="glass" className="p-2">
          <select
            value={activeSection}
            onChange={(e) => handleSectionChange(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {SECTIONS.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </Card>
      </div>
    </>
  )
}
