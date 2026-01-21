'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HiBookOpen, 
  HiEye, 
  HiVolumeUp, 
  HiPencil, 
  HiLightBulb, 
  HiClipboardCheck,
  HiChevronRight,
  HiChevronLeft
} from 'react-icons/hi'
import styles from './EnglishSidebar.module.scss'

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const isActive = (href) => {
    if (href === '/english/testing') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-20 left-4 z-50 p-1.5 rounded-lg shadow-lg border border-gray-200 transition-all ${
          isMobileOpen ? 'bg-primary-600 text-white border-primary-700' : 'bg-white text-gray-700'
        }`}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <HiChevronLeft className="w-5 h-5" />
        ) : (
          <HiChevronRight className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-sidebar="true"
        className={`
          ${styles.sidebar}
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-5rem)]
          w-64 lg:w-72
          bg-white/95 backdrop-blur-md
          border-r border-gray-200
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-20 lg:pt-8
          overflow-y-auto
        `}
      >
        <div className="px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 px-2">
            English Learning
          </h2>
          
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              const active = isActive(category.href)
              
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`
                    ${styles.categoryLink}
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      active
                        ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-md border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      transition-all duration-200
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
        </div>
      </aside>
    </>
  )
}
