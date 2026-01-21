'use client'

import { HiTranslate } from 'react-icons/hi'
import { LANGUAGES } from '../../../../constants/grammarConstants'

/**
 * Language Selector Component
 * Reusable language selector for grammar pages
 */
export default function LanguageSelector({ language, onLanguageChange, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HiTranslate className="w-5 h-5 text-gray-500" />
      <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              language === lang.code
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
