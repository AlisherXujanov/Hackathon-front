'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '../services/api'
import { HiMenu, HiX, HiUserCircle, HiFire } from 'react-icons/hi'
import Button from './Button'

const Header = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Проверяем статус авторизации при монтировании и при изменении пути
    setIsAuthenticated(authService.isAuthenticated())
    
    // Получаем роль пользователя
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser()
      const userData = user?.data || user
      setUserRole(userData?.role)
    } else {
      setUserRole(null)
    }
  }, [pathname])

  // Базовые ссылки навигации
  const baseNavLinks = [
    { href: '/community', label: 'Community' },
    { href: '/cybersecurity', label: 'Security' },
    { href: '/about', label: 'About' },
    { href: '/english', label: 'English' },
    { href: '/programming', label: 'Code' },
    { href: '/courses', label: 'Courses' },
    { href: '/learning-paths', label: 'Paths' },
    { href: '/leaderboard', label: 'Ranking' },
    { href: '/plan', label: 'Pricing' },
  ]

  // Формируем навигационные ссылки
  // Для учителей добавляем Classes между Programming и Courses
  // Для авторизованных пользователей добавляем Certificates между Learning Paths и Leaderboard
  const buildNavLinks = () => {
    let links = [...baseNavLinks]
    
    // Для учителей: вставляем Classes после Programming
    if (userRole === 'teacher') {
      const programmingIndex = links.findIndex((l) => l.href === '/programming')
      const already = links.some((l) => l.href === '/classes')
      if (programmingIndex !== -1 && !already) {
        links = [
          ...links.slice(0, programmingIndex + 1),
          { href: '/classes', label: 'Classes' },
          ...links.slice(programmingIndex + 1),
        ]
      }
    }

    
    if (isAuthenticated) {
      const learningPathsIndex = links.findIndex(link => link.href === '/learning-paths')
      if (learningPathsIndex !== -1) {
        links = [
          ...links.slice(0, learningPathsIndex + 1),
          { href: '/certificates', label: 'Certs' },
          ...links.slice(learningPathsIndex + 1),
        ]
      }
      if (userRole === 'student') {
        const certIndex = links.findIndex(link => link.href === '/certificates')
        if (certIndex !== -1) {
          links = [
            ...links.slice(0, certIndex + 1),
            { href: '/invitations', label: 'Invites' },
            ...links.slice(certIndex + 1),
          ]
        } else {
          const lpIndex = links.findIndex(link => link.href === '/learning-paths')
          links = [
            ...links.slice(0, (lpIndex !== -1 ? lpIndex : 0) + 1),
            { href: '/invitations', label: 'Invites' },
            ...links.slice((lpIndex !== -1 ? lpIndex : 0) + 1),
          ]
        }
      }
    }
    return links
  }

  const navLinks = buildNavLinks()

  const isActive = (href) => pathname?.startsWith(href)

  return (
    <header
      data-header="true"
      className={`
        fixed top-0 left-0 right-0 z-50
        overflow-hidden
        transition-all duration-300
        ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm'
        }
      `}
    >
      <nav className="container-wrapper py-1">
        <div className="flex items-center justify-between h-19 gap-3 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0 min-w-0">
            <img 
              src="/assets/images/logos/logo_long1.png" 
              alt="FrameSchool Logo" 
              className="p-1 h-16 w-auto group-hover:scale-105 transition-all duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  whitespace-nowrap px-2.5 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.href)
                    ? 'text-primary-700 bg-primary-100 shadow-sm'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                  }
                `}
                title={link.href === '/cybersecurity' ? 'Cybersecurity' : link.href === '/programming' ? 'Programming' : link.href === '/learning-paths' ? 'Learning Paths' : link.href === '/leaderboard' ? 'Leaderboard' : link.href === '/certificates' ? 'Certificates' : link.href === '/invitations' ? 'Invitations' : link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* Условное отображение: иконка профиля или кнопки Login/Register */}
            {isAuthenticated ? (
              // Если пользователь авторизован - показываем иконку геймификации и профиля
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/gamification"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                  aria-label="Gamification"
                  title="Геймификация"
                >
                  <HiFire className="w-6 h-6 text-orange-500" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Profile"
                >
                  <HiUserCircle className="w-6 h-6 text-gray-700" />
                </Link>
              </div>
            ) : (
              // Если пользователь не авторизован - показываем кнопки Login и Register
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="secondary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6 text-gray-700" />
              ) : (
                <HiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    block px-4 py-2 text-base font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                // Если авторизован - показываем ссылки на геймификацию и профиль
                <>
                  <Link
                    href="/gamification"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <HiFire className="w-5 h-5 text-orange-500" />
                    <span>Геймификация</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <HiUserCircle className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                </>
              ) : (
                // Если не авторизован - показываем кнопки Login и Register
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
