'use client'

import { useMemo } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import Button from './Button'
import styles from './Pagination.module.scss'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}) {
  const startItem = useMemo(() => {
    return totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  }, [currentPage, itemsPerPage, totalItems])

  const endItem = useMemo(() => {
    return Math.min(currentPage * itemsPerPage, totalItems)
  }, [currentPage, itemsPerPage, totalItems])

  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisible = 7 // Desktop
    const maxVisibleTablet = 5
    const maxVisibleMobile = 3
    
    // Determine how many pages to show based on screen size
    // We'll use CSS classes for responsive behavior
    let visibleCount = maxVisible
    
    if (totalPages <= visibleCount) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        end = Math.min(5, totalPages - 1)
        start = 2
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 4)
        end = totalPages - 1
      }
      
      // Add ellipsis before middle pages if needed
      if (start > 2) {
        pages.push('ellipsis-start')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis after middle pages if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }, [currentPage, totalPages])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`${styles.pagination} ${className}`}>
      {/* Info Text */}
      <div className={styles.info}>
        <span className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> topics
        </span>
      </div>

      {/* Navigation Controls */}
      <nav className={styles.nav} aria-label="Pagination">
        <div className={styles.controls}>
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.navButton}
            leftIcon={<HiChevronLeft className="w-5 h-5" />}
            aria-label="Previous page"
          >
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className={styles.pageNumbers}>
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={styles.ellipsis}
                    aria-hidden="true"
                  >
                    ...
                  </span>
                )
              }

              const isActive = page === currentPage

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageButton} ${isActive ? styles.active : ''}`}
                  aria-label={`Go to page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.navButton}
            rightIcon={<HiChevronRight className="w-5 h-5" />}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
