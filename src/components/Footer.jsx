'use client'

import Link from 'next/link'
import { HiAcademicCap, HiMail, HiPhone } from 'react-icons/hi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/classes', label: 'Classes' },
      { href: '/leaderboard', label: 'Leaderboard' },
      { href: '/analytics', label: 'Analytics' },
    ],
    learning: [
      { href: '/english/grammar', label: 'English Grammar' },
      { href: '/english/vocabulary', label: 'Vocabulary' },
      { href: '/programming/tasks', label: 'Programming Tasks' },
      { href: '/ai/conversation', label: 'AI Assistant' },
    ],
    support: [
      { href: '/profile', label: 'Profile' },
      { href: '/auth/login', label: 'Login' },
      { href: '/auth/register', label: 'Register' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container-wrapper py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                U
              </div>
              <span className="text-xl font-bold text-white">UnitSchool</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Comprehensive learning platform for English and Programming education.
            </p>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <HiMail className="w-4 h-4" />
                <span>support@unitschool.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <HiAcademicCap className="w-5 h-5 mr-2" />
              Platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Learning</h3>
            <ul className="space-y-2">
              {footerLinks.learning.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} UnitSchool. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
