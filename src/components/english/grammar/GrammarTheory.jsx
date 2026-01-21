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
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <HiBookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              </div>
              {isExpanded ? (
                <HiChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
              ) : (
                <HiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {/* Subtopic Content */}
            {isExpanded && (
              <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
                {/* Content Table */}
                {headers.length > 0 && body.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
                          {headers.map((header, headerIndex) => (
                            <th
                              key={headerIndex}
                              className="px-4 py-3 text-left font-semibold text-sm"
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
                            className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100"
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
                  <div className="prose prose-sm max-w-none">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Explanation</h4>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
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
