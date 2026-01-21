'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiTranslate, HiChevronDown } from 'react-icons/hi'
import { LANGUAGES } from '../../../../constants/grammarConstants'

/**
 * Language Selector Component
 * Reusable language selector for grammar pages with animated dropdown
 */
export default function LanguageSelector({ language, onLanguageChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Get current language label
  const currentLanguage = LANGUAGES.find(lang => lang.code === language) || LANGUAGES[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode)
    setIsOpen(false)
  }

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.2
      }
    })
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HiTranslate className="w-5 h-5 text-gray-500" />
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md min-w-[110px]"
        >
          <span className="flex-1 text-left">{currentLanguage.label}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0"
          >
            <HiChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Animated Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl z-50 min-w-[140px] overflow-hidden"
            >
                {LANGUAGES.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      language === lang.code
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {lang.label}
                  </motion.button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
