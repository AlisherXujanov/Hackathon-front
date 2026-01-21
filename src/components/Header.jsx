'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX, HiUserCircle, HiLogout } from 'react-icons/hi'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/english', label: 'English' },
    { href: '/programming', label: 'Programming' },
    { href: '/classes', label: 'Classes' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ]

  const isActive = (href) => pathname?.startsWith(href)

  return (
    <header
      data-header="true"
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
        }
      `}
    >
      <nav className="container-wrapper">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              U
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
              UnitSchool
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.href)
                    ? 'text-primary-700 bg-primary-100 shadow-sm'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Sign In Button */}
            <Link 
              href="/auth/login"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 rounded-lg transition-all duration-200"
            >
              Sign in
            </Link>
            
            {/* Get Started Button */}
            <Link 
              href="/auth/register"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get started
            </Link>

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
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mx-4 px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 text-center"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
