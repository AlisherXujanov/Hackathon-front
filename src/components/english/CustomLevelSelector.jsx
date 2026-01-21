'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiAcademicCap, HiChevronDown } from 'react-icons/hi'
import { ENGLISH_LEVELS } from '../../config/englishCategories'

/**
 * Custom Level Selector Component
 * Красивый селектор уровня с slide-in анимацией
 */
export default function CustomLevelSelector({ value, onChange, className = '', compact = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  // Получение текущего уровня
  const currentLevel = ENGLISH_LEVELS.find(level => level.value === value) || ENGLISH_LEVELS[0]

  // Вычисление позиции dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect()
          setDropdownPosition({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right - 20
          })
        }
      }
      
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
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

  const handleLevelSelect = (levelValue) => {
    onChange({ target: { value: levelValue } })
    setIsOpen(false)
  }

  // Анимация для dropdown меню (slide-in)
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -15,
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
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.03
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

  // Анимация для элементов списка (stagger effect)
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -10,
      scale: 0.9
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.04,
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  }

  // Получение цвета для уровня
  const getLevelColor = (levelValue) => {
    const colors = {
      'A1': 'from-green-500 to-emerald-500',
      'A2': 'from-blue-500 to-cyan-500',
      'B1': 'from-yellow-500 to-orange-500',
      'B2': 'from-orange-500 to-red-500',
      'C1': 'from-purple-500 to-pink-500',
      'C2': 'from-indigo-500 to-purple-500'
    }
    return colors[levelValue] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className={`relative z-[100] ${className}`} ref={containerRef}>
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-lg px-4 py-2.5 text-base font-medium text-gray-700 border border-white/30 hover:bg-white hover:border-primary-300/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg hover:shadow-xl min-w-[160px] group ${
          compact ? 'text-sm px-3.5 py-2' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <HiAcademicCap className={`text-gray-600 group-hover:text-primary-600 transition-colors duration-200 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <span className="flex-1 text-left font-semibold">{currentLevel.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="flex-shrink-0"
        >
          <HiChevronDown className={`text-gray-500 group-hover:text-primary-600 transition-colors duration-200 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        </motion.div>
      </motion.button>

      {/* Animated Dropdown Menu with Slide-in - Rendered via Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bg-white/98 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-2xl z-[99999] w-[170px] overflow-hidden"
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {ENGLISH_LEVELS.map((level, index) => (
                <motion.button
                  key={level.value}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleLevelSelect(level.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 relative ${
                    value === level.value
                      ? `bg-gradient-to-r ${getLevelColor(level.value)} text-white shadow-md`
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                  whileHover={{ 
                    x: value === level.value ? 0 : 2,
                    transition: { duration: 0.15 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{level.value}</span>
                    <span className="text-xs opacity-90">{level.label.split(' - ')[1]}</span>
                  </div>
                  {value === level.value && (
                    <motion.div
                      layoutId="activeLevel"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
