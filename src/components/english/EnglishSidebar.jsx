'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HiBookOpen, 
  HiEye, 
  HiVolumeUp, 
  HiPencil, 
  HiLightBulb, 
  HiMicrophone,
  HiClipboardCheck,
  HiChevronRight,
  HiChevronLeft
} from 'react-icons/hi'
import styles from './EnglishSidebar.module.scss'
import { ENGLISH_LEVELS } from '../../config/englishCategories'

const ENGLISH_LEVEL_STORAGE_KEY = 'english_selected_level'

const categories = [
  {
    id: 'grammar',
    label: 'Grammar',
    icon: HiBookOpen,
    href: '/english/grammar',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: HiEye,
    href: '/english/reading',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'listening',
    label: 'Listening',
    icon: HiVolumeUp,
    href: '/english/listening',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'writing',
    label: 'Writing',
    icon: HiPencil,
    href: '/english/writing',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    icon: HiLightBulb,
    href: '/english/vocabulary',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'speaking',
    label: 'Speaking',
    icon: HiMicrophone,
    href: '/english/speaking',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: HiClipboardCheck,
    href: '/english/testing',
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function EnglishSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [level, setLevel] = useState('A1')

  const sidebarId = 'english-learning-sidebar'

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(ENGLISH_LEVEL_STORAGE_KEY)
    if (saved) setLevel(saved)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncLevel = (next) => {
      const saved = typeof next === 'string' ? next : localStorage.getItem(ENGLISH_LEVEL_STORAGE_KEY)
      if (saved) setLevel(saved)
    }

    const onCustom = (e) => syncLevel(e?.detail?.level)
    const onStorage = () => syncLevel()

    window.addEventListener('english-level-changed', onCustom)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('english-level-changed', onCustom)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    if (!isMobileOpen) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileOpen])

  const isActive = (href) => {
    if (href === '/english/testing') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  const activeByHref = useMemo(() => {
    const map = new Map()
    for (const item of categories) {
      map.set(item.href, isActive(item.href))
    }
    return map
  }, [pathname])

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((v) => !v)
  }, [])

  const levelMeta = useMemo(() => {
    const idx = ENGLISH_LEVELS.findIndex((l) => l.value === level)
    const safeIndex = idx >= 0 ? idx : 0
    const current = ENGLISH_LEVELS[safeIndex]
    const max = Math.max(ENGLISH_LEVELS.length - 1, 1)
    const percent = Math.round((safeIndex / max) * 100)
    return {
      value: current?.value || 'A1',
      label: current?.label || 'A1 - Beginner',
      percent
    }
  }, [level])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={toggleMobile}
        className={`lg:hidden fixed top-20 left-4 z-50 p-2 rounded-xl shadow-md border border-gray-200 transition-colors ${
          isMobileOpen ? 'bg-primary-600 text-white border-primary-700' : 'bg-white text-gray-700'
        }`}
        aria-label="Toggle menu"
        aria-expanded={isMobileOpen}
        aria-controls={sidebarId}
      >
        {isMobileOpen ? (
          <HiChevronLeft className="w-5 h-5" />
        ) : (
          <HiChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobile}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar="true"
        id={sidebarId}
        aria-label="English Learning navigation"
        className={`
          ${styles.sidebar}
          fixed lg:sticky top-0 lg:top-16 left-0 h-screen lg:h-[calc(100vh-4rem)]
          w-64 lg:w-72
          bg-white
          border-r border-gray-200
          shadow-sm
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-20 lg:pt-8
          overflow-y-auto
        `}
      >
        <div className="px-4 py-5">
          <div className="px-2 mb-4">
            <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
              English
            </div>
            <h2 className="text-base font-semibold text-gray-900 mt-2 font-display">
              Learning
            </h2>
          </div>
          
          <nav className="space-y-1" aria-label="English categories">
            {categories.map((category) => {
              const Icon = category.icon
              const active = activeByHref.get(category.href)
              
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`
                    ${styles.categoryLink}
                    ${active ? 'active' : ''}
                    flex items-center space-x-3 px-3 py-2 rounded-lg
                    transition-colors duration-150
                    ${
                      active
                        ? 'bg-primary-50 text-primary-800 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }
                  `}
                  onClick={closeMobile}
                >
                  <div
                    className={`
                      w-9 h-9 rounded-lg flex items-center justify-center
                      transition-colors duration-150
                      ${
                        active
                          ? `bg-gradient-to-br ${category.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                    {category.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <div className="px-2 pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Difficulty
                </span>
                <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-full px-2 py-0.5">
                  {levelMeta.value}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {levelMeta.label}
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
                  style={{ width: `${levelMeta.percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
