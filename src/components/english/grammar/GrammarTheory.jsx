'use client'

import { useState } from 'react'
import Card from '../../Card'
import { HiChevronDown, HiChevronUp, HiBookOpen } from 'react-icons/hi'
import GrammarEmptyState from './shared/GrammarEmptyState'
import { getLocalizedContent, getLocalizedArray } from '../../../utils/english/grammarUtils'
import { highlightText } from '../../../utils/english/textHighlight'

export default function GrammarTheory({ topic, language = 'en' }) {
  const [expandedSubtopic, setExpandedSubtopic] = useState(0)
  const subTopics = topic.sub_topics || []

  const toggleSubtopic = (index) => {
    setExpandedSubtopic(expandedSubtopic === index ? -1 : index)
  }

  if (subTopics.length === 0) {
    return <GrammarEmptyState message="No theory content available for this topic." />
  }

  return (
    <div className="space-y-4">
      {subTopics.map((subTopic, index) => {
        const isExpanded = expandedSubtopic === index
        const name = getLocalizedContent(subTopic.name, language) || `Subtopic ${index + 1}`
        const explanation = getLocalizedContent(subTopic.explanation, language)
        const content = subTopic.content || {}
        const headers = getLocalizedArray(content.head, language)
        const body = content.body || []

        return (
          <Card key={index} variant="glass" className="overflow-hidden">
            {/* Subtopic Header */}
            <button
              onClick={() => toggleSubtopic(index)}
              className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                isExpanded ? 'bg-primary-50/30' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${isExpanded ? 'bg-white border-primary-200/70' : 'bg-primary-100 border-transparent'}`}>
                  <HiBookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 break-words">{name}</h3>
                </div>
              </div>
              {isExpanded ? (
                <HiChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <HiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {/* Subtopic Content */}
            {isExpanded && (
              <div className="px-3 md:px-5 pb-4 md:pb-5 space-y-4 md:space-y-5 border-t border-gray-100">
                {/* Content Table */}
                {headers.length > 0 && body.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full border-collapse overflow-hidden">
                      <thead>
                        <tr className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
                          {headers.map((header, headerIndex) => (
                            <th
                              key={headerIndex}
                              className="px-2.5 py-2 md:px-4 md:py-3 text-left font-semibold text-xs md:text-sm md:whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {body.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-50/20 transition-colors`}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-2.5 py-2 md:px-4 md:py-3 text-xs md:text-sm text-gray-800 border-b border-gray-100 md:whitespace-nowrap"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Explanation */}
                {explanation && (
                  <div className="rounded-xl border border-gray-200 bg-white p-3 md:p-5">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h4 className="text-base md:text-lg font-semibold text-gray-900">Explanation</h4>
                    </div>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {highlightText(explanation)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
