'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Card from '../../../components/Card'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    // TODO: Implement actual login logic with API
    try {
      // Placeholder for API call
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError('Invalid credentials')
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
                  Welcome Back
                </h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  required
                  leftIcon={<HiMail className="w-5 h-5" />}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                />

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    required
                    leftIcon={<HiLockClosed className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                      </button>
                    }
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    href="/auth/password-reset" 
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Sign In
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link 
                    href="/auth/register" 
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Register
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
