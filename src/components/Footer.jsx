'use client'

import Link from 'next/link'
import { HiAcademicCap, HiMail, HiPhone } from 'react-icons/hi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { href: '/community', label: 'Community' },
      { href: '/cybersecurity', label: 'Cybersecurity' },
      { href: '/about', label: 'About' },
      { href: '/classes', label: 'Classes' },
      { href: '/leaderboard', label: 'Leaderboard' },
      { href: '/analytics', label: 'Analytics' },
    ],
    learning: [
      { href: '/english/grammar', label: 'English Grammar' },
      { href: '/english/vocabulary', label: 'Vocabulary' },
      { href: '/programming/tasks', label: 'Programming Tasks' },
      { href: '/programming/snippets', label: 'Code Snippets' },
      { href: '/ai/conversation', label: 'AI Assistant' },
    ],
    support: [
      { href: '/profile', label: 'Profile' },
      { href: '/auth/login', label: 'Login' },
      { href: '/auth/register', label: 'Register' },
    ],
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-gray-300 border-t border-gray-800">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15), transparent 45%), radial-gradient(circle at 80% 10%, rgba(14, 116, 144, 0.18), transparent 40%)'
      }} />
      <div className="relative container-wrapper py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <img 
                src="/assets/images/logos/logo_x.png" 
                alt="FrameSchool Logo" 
                className="h-12 w-auto group-hover:scale-105 transition-all duration-300"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Comprehensive learning platform for English and Programming education, designed to help you grow faster.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <HiMail className="w-4 h-4 text-primary-300" />
                <span>support@FrameSchool.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <HiPhone className="w-4 h-4 text-secondary-300" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <HiAcademicCap className="w-5 h-5 mr-2 text-primary-300" />
              Platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
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
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white mb-2">Get the latest updates</p>
              <p className="text-xs text-gray-400 mb-3">Weekly tips and product news in your inbox.</p>
              <div className="flex items-center rounded-full border border-white/10 bg-gray-900/80 px-3 py-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 bg-transparent text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none"
                />
                <button className="ml-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/80">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} FrameSchool. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
