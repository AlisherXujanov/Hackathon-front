'use client'

import { useMemo, useCallback } from 'react'
import ScrollAnimation from '../ScrollAnimation'
import TopicCard from './TopicCard'
import Pagination from '../Pagination'
import CategoryHeader from './CategoryHeader'
import LevelSelector from './LevelSelector'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import { useEnglishCategory } from '../../hooks/useEnglishCategory'

export default function EnglishCategoryPage({
  category,
  topicCardPropsMapper,
  onTopicClick,
  emptyStateTitle = 'No topics found for this level.',
  emptyStateMessage = 'Try selecting a different level.'
}) {
  const categoryLogic = useEnglishCategory(category)

  // Memoize click handler to prevent unnecessary re-renders
  const handleTopicClick = useCallback((topic) => {
    if (onTopicClick) {
      onTopicClick(topic)
    } else {
      categoryLogic.handleTopicClick(topic)
    }
  }, [onTopicClick, categoryLogic])

  // Memoize topic cards to prevent unnecessary re-renders
  const topicCards = useMemo(() => {
    return categoryLogic.paginatedItems.map((topic, index) => {
      const cardProps = topicCardPropsMapper ? topicCardPropsMapper(topic) : topic
      
      return (
        <ScrollAnimation key={topic.id} delay={index * 50}>
          <TopicCard
            {...cardProps}
            onClick={() => handleTopicClick(topic)}
          />
        </ScrollAnimation>
      )
    })
  }, [categoryLogic.paginatedItems, topicCardPropsMapper, handleTopicClick])

  return (
    <div className="w-full overflow-x-hidden relative">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.03),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10">
        <div className="container-wrapper py-8 md:py-12 lg:py-16">
          <CategoryHeader
            icon={category.icon}
            title={category.name}
            description={category.description}
            color={category.color}
          />

          {/* Visual Separator */}
          <div className="relative mb-10 md:mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-4">
                <LevelSelector
                  value={categoryLogic.selectedLevel}
                  onChange={categoryLogic.handleLevelChange}
                />
              </div>
            </div>
          </div>

          {categoryLogic.loading && <LoadingState />}

          {categoryLogic.error && (
            <ErrorState
              message={categoryLogic.error}
              onRetry={categoryLogic.reloadTopics}
            />
          )}

          {!categoryLogic.loading && !categoryLogic.error && (
            <>
              {categoryLogic.topics.length === 0 ? (
                <EmptyState
                  icon={category.icon}
                  title={emptyStateTitle}
                  message={emptyStateMessage}
                />
              ) : (
                <>
                  {/* Enhanced Grid Layout with Better Spacing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mb-12">
                    {topicCards}
                  </div>

                  {/* Pagination Section with Visual Separation */}
                  {categoryLogic.totalPages > 1 && (
                    <div className="pt-8 border-t border-gray-200">
                      <Pagination
                        currentPage={categoryLogic.currentPage}
                        totalPages={categoryLogic.totalPages}
                        onPageChange={categoryLogic.handlePageChange}
                        totalItems={categoryLogic.topics.length}
                        itemsPerPage={categoryLogic.itemsPerPage}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
