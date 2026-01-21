'use client'

/**
 * FloatingAIAssistant Component
 * 
 * A reusable floating action button component that opens a modal dialog
 * to collect user prompts and send them to the backend AI endpoint.
 * 
 * @component
 * @example
 * ```jsx
 * <FloatingAIAssistant
 *   subjectName="English Grammar"
 *   topicName="Present Perfect"
 *   category="grammar"
 *   description="Grammar practice interface for advanced students"
 * />
 * ```
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiSparkles, HiX, HiPaperAirplane, HiInformationCircle } from 'react-icons/hi'
import Button from './Button'
import Card from './Card'
import Textarea from './Textarea'
import Badge from './Badge'
import { sendAIChatRequest } from '../utils/aiService'
import styles from './FloatingAIAssistant.module.scss'

const FloatingAIAssistant = ({
  subjectName,
  topicName,
  category,
  description = '',
  buttonIcon,
  buttonLabel = 'AI Assistant',
  position = 'bottom-right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)
  const textareaRef = useRef(null)
  const modalRef = useRef(null)

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      // Add class to body for CSS styling
      document.body.classList.add('ai-modal-open')
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      // Remove class from body
      document.body.classList.remove('ai-modal-open')
    }
  }, [isOpen])

  // Focus trap in modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(true)
    setError(null)
    setResponse(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    setPrompt('')
    setError(null)
    setResponse(null)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const payload = {
        subject_name: subjectName,
        topic_name: topicName,
        category: category,
        user_prompt: prompt.trim(),
      }

      // Include description if provided (hidden from user but sent to backend)
      if (description) {
        payload.description = description
      }

      const result = await sendAIChatRequest(payload)

      if (result.success && result.data) {
        setResponse(result.data)
        setPrompt('') // Clear prompt after successful submission
      } else {
        throw new Error(result.error?.message || 'Failed to get AI response')
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  // Get category badge color
  const getCategoryColor = (cat) => {
    const colors = {
      grammar: 'primary',
      reading: 'info',
      writing: 'accent',
      listening: 'success',
      vocabulary: 'warning',
      coding: 'accent',
    }
    return colors[cat?.toLowerCase()] || 'primary'
  }

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className={`${styles.floatingButton} ${positionClasses[position]} ${className}`}
        onClick={handleOpen}
        aria-label={buttonLabel}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {buttonIcon || <HiSparkles className="w-6 h-6" />}
        <span className={styles.buttonLabel}>{buttonLabel}</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              onClick={handleBackdropClick}
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                WebkitBackdropFilter: 'blur(8px)', // Safari support
              }}
              aria-hidden="true"
            />

            {/* Modal Dialog */}
            <motion.div
              ref={modalRef}
              className={styles.modalContainer}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-assistant-title"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card variant="glass" className={styles.modalCard}>
                {/* Header */}
                <div className={styles.modalHeader}>
                  <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                      <HiSparkles className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <h2 id="ai-assistant-title" className={styles.modalTitle}>
                        AI Assistant
                      </h2>
                      <p className={styles.modalSubtitle}>
                        Get help with your learning
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className={styles.closeButton}
                    aria-label="Close dialog"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Context Information */}
                <div className={styles.contextSection}>
                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Subject:</span>
                    <span className={styles.contextValue}>{subjectName}</span>
                  </div>
                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Topic:</span>
                    <span className={styles.contextValue}>{topicName}</span>
                  </div>
                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Category:</span>
                    <Badge
                      variant={getCategoryColor(category)}
                      size="sm"
                      className="inline-flex"
                    >
                      {category}
                    </Badge>
                  </div>
                </div>

                {/* Form */}
                {!response && (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <Textarea
                      ref={textareaRef}
                      label="Your Question"
                      placeholder="Ask anything about this topic..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      error={error}
                      rows={4}
                      disabled={isLoading}
                      className={styles.promptInput}
                    />

                    {error && (
                      <div className={styles.errorMessage} role="alert">
                        <HiInformationCircle className="w-5 h-5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className={styles.formActions}>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        rightIcon={<HiPaperAirplane />}
                        disabled={!prompt.trim() || isLoading}
                      >
                        Send
                      </Button>
                    </div>
                  </form>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner} />
                    <p>Processing your request...</p>
                  </div>
                )}

                {/* Response Display */}
                {response && !isLoading && (
                  <div className={styles.responseSection}>
                    <div className={styles.responseHeader}>
                      <h3 className={styles.responseTitle}>AI Response</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setResponse(null)
                          setPrompt('')
                        }}
                      >
                        Ask Another Question
                      </Button>
                    </div>
                    <div className={styles.responseContent}>
                      {response.answer ? (
                        <div
                          className={styles.responseText}
                          dangerouslySetInnerHTML={{
                            __html: response.answer.replace(/\n/g, '<br />'),
                          }}
                        />
                      ) : (
                        <pre className={styles.responseJson}>
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAIAssistant
