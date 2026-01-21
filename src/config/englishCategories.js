import {
  HiBookOpen,
  HiEye,
  HiVolumeUp,
  HiPencil,
  HiLightBulb,
  HiClipboardCheck
} from 'react-icons/hi'
import {
  loadGrammarTopics,
  loadReadingTopics,
  loadListeningTopics,
  loadWritingTopics,
  loadVocabularyTopics
} from '../utils/english/dataLoader'

export const ENGLISH_LEVELS = [
  { value: 'A1', label: 'A1 - Beginner' },
  { value: 'A2', label: 'A2 - Elementary' },
  { value: 'B1', label: 'B1 - Intermediate' },
  { value: 'B2', label: 'B2 - Upper Intermediate' },
  { value: 'C1', label: 'C1 - Advanced' },
  { value: 'C2', label: 'C2 - Proficiency' }
]

export const ENGLISH_CATEGORIES = {
  grammar: {
    id: 'grammar',
    name: 'English Grammar',
    description: 'Learn and practice English grammar rules and exercises.',
    icon: HiBookOpen,
    color: 'from-blue-500 to-cyan-500',
    loader: loadGrammarTopics,
    route: '/english/grammar'
  },
  reading: {
    id: 'reading',
    name: 'Reading Comprehension',
    description: 'Improve your reading skills with various texts and exercises.',
    icon: HiEye,
    color: 'from-purple-500 to-pink-500',
    loader: loadReadingTopics,
    route: '/english/reading'
  },
  listening: {
    id: 'listening',
    name: 'Listening Practice',
    description: 'Enhance your listening skills with audio exercises and comprehension tasks.',
    icon: HiVolumeUp,
    color: 'from-green-500 to-emerald-500',
    loader: loadListeningTopics,
    route: '/english/listening'
  },
  writing: {
    id: 'writing',
    name: 'Writing Practice',
    description: 'Practice writing and get AI-powered feedback on your work.',
    icon: HiPencil,
    color: 'from-orange-500 to-red-500',
    loader: loadWritingTopics,
    route: '/english/writing'
  },
  vocabulary: {
    id: 'vocabulary',
    name: 'Vocabulary Builder',
    description: 'Expand your vocabulary with flashcards, quizzes, and word lists.',
    icon: HiLightBulb,
    color: 'from-indigo-500 to-blue-500',
    loader: loadVocabularyTopics,
    route: '/english/vocabulary'
  },
  testing: {
    id: 'testing',
    name: 'Testing & Assessment',
    description: 'Comprehensive tests to assess your English proficiency.',
    icon: HiClipboardCheck,
    color: 'from-yellow-500 to-orange-500',
    loader: null,
    route: '/english/testing'
  }
}
