'use client'

import { useState, useEffect, useCallback } from 'react'
import { useReadingState } from '../hooks/useReadingState'
import FullscreenReadingMode from './FullscreenReadingMode'
import ErrorState from '../../../../../components/english/ErrorState'
import LoadingState from '../../../../../components/english/LoadingState'

/**
 * Main ReadingPage component
 * Orchestrates the reading experience and manages fullscreen mode
 */
export default function ReadingPage({ readingExercise, level, id }) {
  const [isFullScreen, setIsFullScreen] = useState(true) // Start in fullscreen by default
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 784)
      if (window.innerWidth < 784) {
        setIsFullScreen(false) // Disable fullscreen on mobile
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize reading state
  const readingState = useReadingState(readingExercise, level, id)

  // Toggle fullscreen mode
  const toggleFullScreen = useCallback(() => {
    if (isMobile) return // Disable for mobile
    setIsFullScreen(prev => !prev)
  }, [isMobile])

  // Add body class to hide Header, Sidebar, and Footer when in fullscreen
  useEffect(() => {
    if (isFullScreen && !isMobile) {
      document.body.classList.add('reading-fullscreen')
      return () => {
        document.body.classList.remove('reading-fullscreen')
      }
    }
  }, [isFullScreen, isMobile])

  // Body scroll lock when in fullscreen
  useEffect(() => {
    if (isFullScreen && !isMobile) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        const savedScrollY = document.body.style.top
        document.body.style.removeProperty('position')
        document.body.style.removeProperty('top')
        document.body.style.removeProperty('width')
        document.body.style.removeProperty('overflow')
        if (savedScrollY) {
          window.scrollTo(0, parseInt(savedScrollY || '0') * -1)
        }
      }
    }
  }, [isFullScreen, isMobile])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F11 or Ctrl+F to toggle fullscreen
      if (e.key === 'F11' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault()
        toggleFullScreen()
      }
      // Esc to exit fullscreen
      if (e.key === 'Escape' && isFullScreen) {
        toggleFullScreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullScreen, toggleFullScreen])

  // Loading state
  if (!readingState.readingData) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <LoadingState />
        </div>
      </main>
    )
  }

  // Error state
  if (!readingExercise) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <ErrorState
            title="Reading Exercise Not Found"
            message="The requested reading exercise could not be found."
            actionLabel="Back to Reading"
            onAction={() => window.location.href = '/english/reading'}
          />
        </div>
      </main>
    )
  }

  // Render fullscreen mode
  if (isFullScreen && !isMobile) {
    return (
      <FullscreenReadingMode
        readingState={readingState}
        onExitFullscreen={toggleFullScreen}
      />
    )
  }

  // Render normal mode (mobile fallback)
  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      <div className="container-wrapper py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={toggleFullScreen}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Enter Fullscreen Mode
            </button>
          </div>
          <FullscreenReadingMode
            readingState={readingState}
            onExitFullscreen={toggleFullScreen}
            isNormalMode={true}
          />
        </div>
      </div>
    </main>
  )
}
