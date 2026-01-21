/**
 * Grammar Constants
 * Centralized constants for grammar learning features
 */

import {
  HiHome,
  HiBookOpen,
  HiLightBulb,
  HiExclamationCircle,
  HiClipboardCheck,
  HiRefresh
} from 'react-icons/hi'

/**
 * Available languages for grammar content
 */
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "O'zbek" }
]

/**
 * Grammar learning sections configuration
 */
export const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: HiHome },
  { id: 'theory', label: 'Theory', icon: HiBookOpen },
  { id: 'examples', label: 'Examples', icon: HiLightBulb },
  { id: 'common-mistakes', label: 'Common Mistakes', icon: HiExclamationCircle },
  { id: 'practice', label: 'Practice', icon: HiClipboardCheck },
  { id: 'review', label: 'Review', icon: HiRefresh }
]

/**
 * Exercise type labels mapping
 */
export const EXERCISE_TYPES = {
  multiple_choice: 'Multiple Choice',
  short_answer: 'Short Answer',
  multiple_gap_filling: 'Gap Filling'
}

/**
 * Difficulty thresholds
 */
export const DIFFICULTY_THRESHOLDS = {
  BEGINNER: 2,
  INTERMEDIATE: 4,
  ADVANCED: 6
}

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = 'en'

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  GRAMMAR_LANGUAGE: 'grammar-language'
}
