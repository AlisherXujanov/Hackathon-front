'use client'

import Card from '../../Card'
import Badge from '../../Badge'
import { HiAcademicCap, HiClock, HiCheckCircle } from 'react-icons/hi'
import StatCard from './shared/StatCard'
import LearningObjectivesList from './shared/LearningObjectivesList'
import DifficultyBadge from './shared/DifficultyBadge'
import { getDifficultyLabel, getPriorityColor, capitalizeFirst } from '../../../utils/english/grammarUtils'

export default function GrammarOverview({ topic, language = 'en' }) {
  const priority = topic.priority || 'medium'
  const difficulty = topic.difficulty || 0

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={HiClock}
          label="Estimated Time"
          value={`${topic.estimated_hours || 'N/A'}h`}
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
        />

        <StatCard
          icon={HiAcademicCap}
          label="Difficulty"
          value={getDifficultyLabel(difficulty) || 'N/A'}
          iconBgColor="bg-warning-100"
          iconColor="text-warning-600"
        />

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-100 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Priority</p>
              <Badge variant={getPriorityColor(priority)} className="text-sm font-semibold px-3 py-1">
                {capitalizeFirst(priority)}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Learning Objectives */}
      <LearningObjectivesList topic={topic} language={language} />

      {/* Topic Information */}
      <Card variant="glass" className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Topic</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Level</p>
            <Badge variant="primary" className="text-sm font-semibold px-3 py-1">
              {topic.level} - {topic.levelName || 'Beginner'}
            </Badge>
          </div>
          
          {topic.difficulty && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Difficulty</p>
              <DifficultyBadge difficulty={topic.difficulty} showScore />
            </div>
          )}

          {topic.priority && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Priority</p>
              <Badge variant={getPriorityColor(topic.priority)} className="text-sm font-semibold px-3 py-1">
                {capitalizeFirst(topic.priority)} Priority
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
