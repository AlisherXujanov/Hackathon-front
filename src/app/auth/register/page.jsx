'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Select from '../../../components/Select'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { authService } from '../../../services/api'
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Валидация совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    // Валидация минимальной длины пароля
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Вызов API для регистрации
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      
      // После успешной регистрации автоматически входим
      await authService.login({
        email: formData.email,
        password: formData.password,
      })
      
      // Получаем актуальные данные пользователя из /api/v1/users/me/
      try {
        await authService.getProfile()
      } catch (profileError) {
        console.warn('Не удалось получить данные пользователя после регистрации:', profileError)
      }
      
      // Успешная регистрация и вход - перенаправление на profile
      router.push('/profile')
    } catch (err) {
      // Обработка ошибок
      let errorMessage = 'Ошибка при регистрации. Попробуйте еще раз.'
      
      if (err?.message) {
        errorMessage = typeof err.message === 'string' ? err.message : String(err.message)
      } else if (typeof err === 'string') {
        errorMessage = err
      } else if (err && typeof err === 'object') {
        errorMessage = JSON.stringify(err)
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container-wrapper relative z-10 pt-2 md:pt-4 pb-0">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <ScrollAnimation>
            <div className="w-full max-w-md">
              <div className="text-center mb-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                  Create Account
                </h1>
                <p className="text-base md:text-lg text-gray-600">Join UnitSchool and start learning today</p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Input
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  required
                  leftIcon={<HiUser className="w-5 h-5" />}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a username"
                />

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
                  placeholder="Create a password"
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  required
                  leftIcon={<HiLockClosed className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  }
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                />

                <Select
                  id="role"
                  name="role"
                  label="Роль"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { value: 'student', label: 'Студент' },
                    { value: 'teacher', label: 'Преподаватель' },
                  ]}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Create Account
                </Button>

                <div className="text-center text-base">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link 
                    href="/auth/login" 
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
