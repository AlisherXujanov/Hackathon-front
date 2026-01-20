'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Card from '../../../components/Card'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiMail, HiArrowLeft } from 'react-icons/hi'

export default function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)
    
    // TODO: Implement actual password reset logic with API
    try {
      // Placeholder for API call
      setTimeout(() => {
        setMessage('Password reset link has been sent to your email')
        setIsLoading(false)
      }, 1000)
    } catch (err) {
      setError('Failed to send reset link')
      setIsLoading(false)
    }
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container-wrapper relative z-10 py-12 md:py-20">
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <ScrollAnimation>
            <Card variant="glass" className="w-full max-w-md p-8 md:p-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                  Reset Password
                </h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
                    {message}
                  </div>
                )}

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  required
                  leftIcon={<HiMail className="w-5 h-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Send Reset Link
                </Button>

                <div className="text-center text-sm">
                  <Link 
                    href="/auth/login" 
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center"
                  >
                    <HiArrowLeft className="mr-2" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
