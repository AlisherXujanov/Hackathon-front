import { useState, useEffect, useMemo, useCallback } from 'react'

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Hook to calculate responsive items per page based on screen size
 * Desktop (lg): 12 items (4 rows × 3 columns)
 * Tablet (md): 8 items (4 rows × 2 columns)
 * Mobile: 4 items (4 rows × 1 column)
 */
export function usePagination() {
  const [itemsPerPage, setItemsPerPage] = useState(12) // Default to desktop

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth
      
      if (width >= 1024) {
        // Desktop: 3 columns × 4 rows = 12 items
        setItemsPerPage(12)
      } else if (width >= 768) {
        // Tablet: 2 columns × 4 rows = 8 items
        setItemsPerPage(8)
      } else {
        // Mobile: 1 column × 4 rows = 4 items
        setItemsPerPage(4)
      }
    }

    // Calculate on mount
    calculateItemsPerPage()

    // Debounce resize events to avoid excessive calculations
    const debouncedCalculate = debounce(calculateItemsPerPage, 150)
    
    // Recalculate on resize
    window.addEventListener('resize', debouncedCalculate)
    
    return () => {
      window.removeEventListener('resize', debouncedCalculate)
    }
  }, [])

  return itemsPerPage
}

/**
 * Utility function to paginate an array
 * @param {Array} items - Array of items to paginate
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} - { paginatedItems, totalPages, startIndex, endIndex }
 */
export function paginate(items, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    paginatedItems,
    totalPages,
    startIndex,
    endIndex
  }
}
