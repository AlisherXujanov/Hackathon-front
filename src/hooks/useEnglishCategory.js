import { useState, useEffect, useCallback, useMemo } from 'react'
import { usePagination, paginate } from './usePagination'

const ENGLISH_LEVEL_STORAGE_KEY = 'english_selected_level'

/**
 * Custom hook to manage English category page state and logic
 * Consolidates all category page functionality into a single reusable hook
 * 
 * @param {Object} categoryConfig - Category configuration object with loader function
 * @param {string} initialLevel - Initial selected level (default: 'A1')
 * @returns {Object} Category page state and handlers
 */
export function useEnglishCategory(categoryConfig, initialLevel = 'A1') {
  const [selectedLevel, setSelectedLevel] = useState(() => {
    if (typeof window === 'undefined') return initialLevel
    return localStorage.getItem(ENGLISH_LEVEL_STORAGE_KEY) || initialLevel
  })
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = usePagination()

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(ENGLISH_LEVEL_STORAGE_KEY, selectedLevel)
    window.dispatchEvent(
      new CustomEvent('english-level-changed', {
        detail: { level: selectedLevel }
      })
    )
  }, [selectedLevel])

  // Define loadTopics before useEffect to avoid initialization error
  const loadTopics = useCallback(async () => {
    if (!categoryConfig?.loader) {
      setError('Category loader not configured')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await categoryConfig.loader(selectedLevel)
      setTopics(data)
    } catch (err) {
      const categoryName = categoryConfig.name || 'topics'
      setError(`Failed to load ${categoryName.toLowerCase()}. Please try again.`)
      console.error(`Error loading ${categoryConfig.id} topics:`, err)
    } finally {
      setLoading(false)
    }
  }, [selectedLevel, categoryConfig])

  // Load topics when level or category config changes
  useEffect(() => {
    loadTopics()
    setCurrentPage(1) // Reset to first page when level changes
  }, [selectedLevel, loadTopics])

  const handleTopicClick = useCallback((topic) => {
    // Navigation logic can be customized per category
    console.log('Topic clicked:', topic)
    // TODO: Navigate to topic detail page
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    // Scroll to top is handled by Pagination component
  }, [])

  const handleLevelChange = useCallback((e) => {
    setSelectedLevel(e.target.value)
  }, [])

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    return paginate(topics, currentPage, itemsPerPage)
  }, [topics, currentPage, itemsPerPage])

  return {
    // State
    selectedLevel,
    topics,
    loading,
    error,
    currentPage,
    itemsPerPage,
    
    // Computed
    paginatedItems: paginationData.paginatedItems,
    totalPages: paginationData.totalPages,
    
    // Handlers
    setSelectedLevel,
    handleLevelChange,
    handleTopicClick,
    handlePageChange,
    reloadTopics: loadTopics
  }
}
