'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { authService } from '../../services/api'
import { HiUserCircle, HiChartBar, HiCog, HiLogout, HiMail, HiUser, HiGlobe, HiClock, HiPhotograph } from 'react-icons/hi'
import { FaTrophy } from 'react-icons/fa'

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    bio: '',
    birth_date: '',
    language_preference: 'uz',
    theme: 'light',
  })
  const [formError, setFormError] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: HiUserCircle },
    { id: 'progress', label: 'Прогресс', icon: HiChartBar },
    { id: 'achievements', label: 'Достижения', icon: FaTrophy },
    { id: 'settings', label: 'Настройки', icon: HiCog },
  ]

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Проверяем авторизацию
        if (!authService.isAuthenticated()) {
          router.push('/auth/login')
          return
        }
        
        // Получаем данные пользователя из backend
        try {
          const profileResponse = await authService.getProfile()
          console.log('Данные профиля с backend:', profileResponse)
          
          // Обрабатываем структуру ответа (может быть data.data или просто data)
          const userData = profileResponse?.data || profileResponse
          
          if (userData) {
            setProfile(userData)
            setUser(userData)
            setError(null)
            
            // Устанавливаем URL аватара если есть
            if (userData.profile?.avatar_url) {
              setAvatarUrl(userData.profile.avatar_url)
            } else if (userData.avatar) {
              setAvatarUrl(userData.avatar)
            } else if (userData.profile?.avatar) {
              setAvatarUrl(userData.profile.avatar)
            }
            
            // Заполняем форму данными
            setFormData({
              first_name: userData.first_name || '',
              last_name: userData.last_name || '',
              username: userData.username || '',
              email: userData.email || '',
              bio: userData.profile?.bio || '',
              birth_date: userData.profile?.birth_date ? userData.profile.birth_date.split('T')[0] : '',
              language_preference: userData.profile?.language_preference || 'uz',
              theme: userData.profile?.theme || 'light',
            })
          } else {
            throw new Error('Данные профиля не получены')
          }
        } catch (profileError) {
          // Если не удалось получить профиль с backend, используем данные из localStorage
          console.warn('Не удалось загрузить профиль с backend, используем localStorage:', profileError)
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            const userDataFromStorage = currentUser?.data || currentUser
            setUser(userDataFromStorage)
            setProfile(userDataFromStorage)
            setError(null)
            
            // Устанавливаем URL аватара если есть
            if (userDataFromStorage?.profile?.avatar_url) {
              setAvatarUrl(userDataFromStorage.profile.avatar_url)
            } else if (userDataFromStorage?.avatar) {
              setAvatarUrl(userDataFromStorage.avatar)
            } else if (userDataFromStorage?.profile?.avatar) {
              setAvatarUrl(userDataFromStorage.profile.avatar)
            }
            
            // Заполняем форму данными из localStorage
            setFormData({
              first_name: userDataFromStorage?.first_name || '',
              last_name: userDataFromStorage?.last_name || '',
              username: userDataFromStorage?.username || '',
              email: userDataFromStorage?.email || '',
              bio: userDataFromStorage?.profile?.bio || '',
              birth_date: userDataFromStorage?.profile?.birth_date ? userDataFromStorage.profile.birth_date.split('T')[0] : '',
              language_preference: userDataFromStorage?.profile?.language_preference || 'uz',
              theme: userDataFromStorage?.profile?.theme || 'light',
            })
          } else {
            setError('Не удалось загрузить данные профиля')
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
        setError('Ошибка при загрузке данных пользователя')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Функция для получения классов цвета
  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-100',
        text: 'text-primary-600',
      },
      success: {
        bg: 'bg-green-100',
        text: 'text-green-600',
      },
      info: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
      },
      accent: {
        bg: 'bg-accent-100',
        text: 'text-accent-600',
      },
      gray: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
      },
    }
    return colorMap[color] || colorMap.primary
  }

  // Получение данных пользователя
  const userData = profile || user
  const username = userData?.username || ''
  const email = userData?.email || ''
  const firstName = userData?.first_name || ''
  const lastName = userData?.last_name || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || username
  const bio = userData?.profile?.bio || ''
  const languagePreference = userData?.profile?.language_preference || 'uz'
  const theme = userData?.profile?.theme || 'light'
  const totalLearningHours = userData?.profile?.total_learning_hours || 0
  const streakDays = userData?.profile?.streak_days || 0
  const isPro = userData?.profile?.is_pro || false
  const userInitial = username ? username.charAt(0).toUpperCase() : 'U'

  // Функция для получения полного URL аватара
  const getAvatarUrl = (url) => {
    if (!url) return null
    // Если URL уже полный (начинается с http:// или https://), возвращаем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // Если относительный путь, добавляем базовый URL API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crucially-innate-chimp.cloudpub.ru'
    return `${API_URL}${url.startsWith('/') ? url : '/' + url}`
  }

  const displayAvatarUrl = avatarUrl ? getAvatarUrl(avatarUrl) : null

  const getLanguageLabel = (code) => {
    const value = (code || '').toLowerCase()
    if (value === 'uz') return 'Uzbek (UZ)'
    if (value === 'ru') return 'Русский (RU)'
    if (value === 'en') return 'English (EN)'
    return value ? value.toUpperCase() : '—'
  }

  const handleOpenSettings = () => {
    setActiveTab('settings')
  }

  const handleEditFromHeader = () => {
    setActiveTab('settings')
    setIsEditing(true)
  }

  // Получение статистики из профиля или значения по умолчанию
  const stats = [
    {
      label: 'Серия дней',
      value: streakDays || '0',
      hint: 'подряд',
      color: 'gray',
      icon: HiChartBar,
    },
    {
      label: 'Часы обучения',
      value: totalLearningHours || '0',
      hint: 'всего',
      color: 'gray',
      icon: HiClock,
    },
    {
      label: 'Язык интерфейса',
      value: getLanguageLabel(languagePreference),
      hint: null,
      color: 'gray',
      icon: HiGlobe,
    },
    {
      label: 'Статус',
      value: isPro ? 'PRO' : 'Free',
      hint: null,
      color: 'gray',
      icon: FaTrophy,
    },
  ]

  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
      // Всё равно перенаправляем на страницу входа, даже если запрос не удался
      router.push('/auth/login')
    }
  }

  // Обработчик сохранения профиля
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setFormError('')
    setIsSaving(true)

    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        profile: {
          bio: formData.bio,
          birth_date: formData.birth_date || null,
          language_preference: formData.language_preference,
          theme: formData.theme,
        },
      }

      const updatedProfile = await authService.updateProfile(updateData)
      const updatedUserData = updatedProfile?.data || updatedProfile
      
      setProfile(updatedUserData)
      setUser(updatedUserData)
      
      // Обновляем URL аватара если есть
      if (updatedUserData?.profile?.avatar_url) {
        setAvatarUrl(updatedUserData.profile.avatar_url)
      } else if (updatedUserData?.avatar) {
        setAvatarUrl(updatedUserData.avatar)
      } else if (updatedUserData?.profile?.avatar) {
        setAvatarUrl(updatedUserData.profile.avatar)
      }
      
      // Обновляем форму с новыми данными
      setFormData({
        first_name: updatedUserData?.first_name || '',
        last_name: updatedUserData?.last_name || '',
        username: updatedUserData?.username || '',
        email: updatedUserData?.email || '',
        bio: updatedUserData?.profile?.bio || '',
        birth_date: updatedUserData?.profile?.birth_date ? updatedUserData.profile.birth_date.split('T')[0] : '',
        language_preference: updatedUserData?.profile?.language_preference || 'uz',
        theme: updatedUserData?.profile?.theme || 'light',
      })
      
      setIsEditing(false)
      setFormError('')
    } catch (err) {
      const errorMessage = err?.message || 'Ошибка при сохранении профиля'
      setFormError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  // Обработчик отмены редактирования
  const handleCancelEdit = () => {
    const userData = profile || user
    setFormData({
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      username: userData?.username || '',
      email: userData?.email || '',
      bio: userData?.profile?.bio || '',
      birth_date: userData?.profile?.birth_date ? userData.profile.birth_date.split('T')[0] : '',
      language_preference: userData?.profile?.language_preference || 'uz',
      theme: userData?.profile?.theme || 'light',
    })
    setIsEditing(false)
    setFormError('')
  }

  // Обработчик загрузки аватара
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setFormError('Пожалуйста, выберите файл изображения')
      return
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Размер файла не должен превышать 5MB')
      return
    }

    setIsUploadingAvatar(true)
    setFormError('')

    try {
      await authService.uploadAvatar(file)

      // Перезагружаем профиль для получения актуальных данных с аватаром
      const profileResponse = await authService.getProfile()
      const userData = profileResponse?.data || profileResponse
      if (userData) {
        setProfile(userData)
        setUser(userData)
        // Обновляем URL аватара из ответа
        if (userData.profile?.avatar_url) {
          setAvatarUrl(userData.profile.avatar_url)
        } else if (userData.avatar) {
          setAvatarUrl(userData.avatar)
        } else if (userData.profile?.avatar) {
          setAvatarUrl(userData.profile.avatar)
        }
      }
    } catch (err) {
      const errorMessage = err?.message || 'Ошибка при загрузке аватара'
      setFormError(errorMessage)
    } finally {
      setIsUploadingAvatar(false)
      // Очищаем input для возможности повторной загрузки того же файла
      e.target.value = ''
    }
  }

  // Обработчик клика на аватар
  const handleAvatarClick = () => {
    const fileInput = document.getElementById('avatar-upload-input')
    if (fileInput) {
      fileInput.click()
    }
  }

  // Показываем загрузку только во время загрузки
  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-[#F7F8FA]">
        <section className="relative h-[200px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/18 via-accent-600/12 to-secondary-600/14" />
          <div className="absolute inset-0 bg-white/75" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F7F8FA]" />

          <div className="container-wrapper relative h-full">
            <div className="max-w-[1200px] mx-auto h-full flex items-end pb-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
                <div>
                  <div className="h-8 w-56 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="mt-2 h-5 w-72 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-wrapper py-8 md:py-10">
          <div className="max-w-[1200px] mx-auto">
            <Card variant="glass" hover={false} className="rounded-2xl p-2">
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-10 flex-1 rounded-xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} variant="glass" hover={false} className="rounded-2xl p-6">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="mt-4 h-4 w-24 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="mt-2 h-8 w-20 rounded-lg bg-gray-200 animate-pulse" />
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Card variant="glass" hover={false} className="rounded-2xl p-6">
                <div className="h-6 w-48 rounded-lg bg-gray-200 animate-pulse" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-14 rounded-xl bg-gray-200 animate-pulse" />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Показываем ошибку только если нет данных вообще
  if (error && !user && !profile) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-error-600 mb-4">{error}</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#F7F8FA]">
      <section className="relative h-[200px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/18 via-accent-600/12 to-secondary-600/14" />
        <div className="absolute inset-0 bg-white/75" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#F7F8FA]" />

        <div className="container-wrapper relative h-full">
          <div className="max-w-[1200px] mx-auto h-full flex items-end pb-6">
            <ScrollAnimation>
              <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      id="avatar-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                    <div
                      onClick={handleAvatarClick}
                      onMouseEnter={() => !isUploadingAvatar && setIsHoveringAvatar(true)}
                      onMouseLeave={() => setIsHoveringAvatar(false)}
                      className={`
                        h-20 w-20 rounded-full bg-white border border-app-border shadow-card
                        flex items-center justify-center text-slate-900 text-3xl font-extrabold
                        ${isUploadingAvatar ? 'opacity-60 cursor-wait' : 'cursor-pointer transition-all duration-200'}
                        overflow-hidden relative
                      `}
                      title={isUploadingAvatar ? 'Загрузка...' : 'Нажмите для загрузки фото'}
                    >
                      {isUploadingAvatar ? (
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-600"></div>
                      ) : displayAvatarUrl ? (
                        <>
                          <img
                            src={displayAvatarUrl}
                            alt={fullName || username}
                            className={`w-full h-full object-cover transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-60' : 'opacity-100'}`}
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <span
                            className="absolute inset-0 hidden items-center justify-center bg-white"
                            style={{ display: displayAvatarUrl ? 'none' : 'flex' }}
                          >
                            {userInitial}
                          </span>
                        </>
                      ) : (
                        <span className={`transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-60' : 'opacity-100'}`}>{userInitial}</span>
                      )}
                      {isHoveringAvatar && !isUploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/35 rounded-full">
                          <HiPhotograph className="w-7 h-7 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="text-[28px] leading-[32px] md:text-[32px] md:leading-[36px] font-extrabold text-slate-900 truncate">
                      {fullName || username}
                    </div>
                    <div className="mt-1 text-[14px] md:text-[15px] text-slate-600 truncate">{email}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenSettings}
                    className="h-10 rounded-xl"
                  >
                    <HiCog className="w-4 h-4 mr-2" />
                    Настройки
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleEditFromHeader}
                    className="h-10 rounded-xl"
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="h-10 rounded-xl"
                  >
                    <HiLogout className="w-4 h-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto">
          <Card variant="glass" className="rounded-2xl mb-8">
            <div className="p-2">
              <nav className="flex flex-wrap gap-2" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40
                        ${isActive ? 'bg-white shadow-card text-slate-900 border border-app-border' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <ScrollAnimation>
                <div className="space-y-6">
                  {/* Статистика */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat) => {
                      const Icon = stat.icon
                      const iconTone = getColorClasses(stat.color)
                      return (
                        <Card key={stat.label} variant="glass" className="rounded-2xl p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className={`h-10 w-10 rounded-xl ${iconTone.bg} flex items-center justify-center shadow-card`}>
                                <Icon className={`w-5 h-5 ${iconTone.text}`} />
                              </div>
                              <div className="mt-4 text-[13px] text-slate-500">{stat.label}</div>
                              <div className="mt-1 flex items-baseline gap-2">
                                <div className="text-[30px] leading-[34px] font-extrabold text-slate-900">{stat.value}</div>
                                {stat.hint && <div className="text-[13px] text-slate-500">{stat.hint}</div>}
                              </div>
                            </div>

                            {stat.label === 'Статус' && (
                              <div className="pt-1">
                                <Badge variant={isPro ? 'accent' : 'gray'} size="sm">
                                  {isPro ? 'PRO' : 'Free'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Информация о профиле */}
                  <Card variant="glass" className="rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-[18px] leading-[1.25] font-extrabold text-slate-900">Данные профиля</h3>
                        <p className="mt-1 text-[13px] text-slate-500">Основная информация аккаунта</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleOpenSettings} className="h-10 rounded-xl">
                          <HiCog className="w-4 h-4 mr-2" />
                          Настройки
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleEditFromHeader} className="h-10 rounded-xl">
                          Редактировать
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                      <div className="py-3 border-b border-app-border">
                        <div className="text-[12px] text-slate-500">Имя пользователя</div>
                        <div className="mt-1 text-[15px] font-semibold text-slate-900">{username}</div>
                      </div>
                      <div className="py-3 border-b border-app-border">
                        <div className="text-[12px] text-slate-500">Email</div>
                        <div className="mt-1 text-[15px] font-semibold text-slate-900">{email}</div>
                      </div>
                      {firstName && (
                        <div className="py-3 border-b border-app-border">
                          <div className="text-[12px] text-slate-500">Имя</div>
                          <div className="mt-1 text-[15px] font-semibold text-slate-900">{firstName}</div>
                        </div>
                      )}
                      {lastName && (
                        <div className="py-3 border-b border-app-border">
                          <div className="text-[12px] text-slate-500">Фамилия</div>
                          <div className="mt-1 text-[15px] font-semibold text-slate-900">{lastName}</div>
                        </div>
                      )}
                      <div className="py-3 border-b border-app-border">
                        <div className="text-[12px] text-slate-500">Язык интерфейса</div>
                        <div className="mt-1 text-[15px] font-semibold text-slate-900">{getLanguageLabel(languagePreference)}</div>
                      </div>
                      <div className="py-3 border-b border-app-border">
                        <div className="text-[12px] text-slate-500">Тема</div>
                        <div className="mt-1 text-[15px] font-semibold text-slate-900 capitalize">{theme}</div>
                      </div>
                    </div>
                    {bio && (
                      <div className="mt-4">
                        <div className="text-[12px] text-slate-500">О себе</div>
                        <div className="mt-1 text-[15px] leading-[1.6] text-slate-900">{bio}</div>
                      </div>
                    )}
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card variant="glass" className="rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[18px] leading-[1.25] font-extrabold text-slate-900">Продолжить обучение</div>
                          <div className="mt-1 text-[13px] text-slate-500">Вернитесь к курсам или выберите новый трек</div>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                        <Button variant="primary" size="sm" className="h-10 rounded-xl" onClick={() => router.push('/courses')}>
                          Перейти к курсам
                        </Button>
                        <Button variant="outline" size="sm" className="h-10 rounded-xl" onClick={() => router.push('/learning-paths')}>
                          Пути обучения
                        </Button>
                      </div>
                    </Card>

                    <Card variant="glass" className="rounded-2xl p-6">
                      <div className="text-[18px] leading-[1.25] font-extrabold text-slate-900">Следующие шаги</div>
                      <div className="mt-1 text-[13px] text-slate-500">Быстрые действия для роста прогресса</div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start gap-2 text-[14px] text-slate-700">
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-primary-400" />
                          <span>Завершите уроки, чтобы получить сертификаты</span>
                        </div>
                        <div className="flex items-start gap-2 text-[14px] text-slate-700">
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-primary-400" />
                          <span>Проверьте прогресс в разделе «Прогресс»</span>
                        </div>
                        <div className="flex items-start gap-2 text-[14px] text-slate-700">
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-primary-400" />
                          <span>Настройте язык и тему в «Настройках»</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'progress' && (
              <ScrollAnimation>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 text-slate-900">Прогресс</h3>
                  <Card variant="glass" className="rounded-2xl p-6">
                    <p className="text-slate-600">Графики и статистика прогресса будут отображаться здесь.</p>
                  </Card>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'achievements' && (
              <ScrollAnimation>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Сертификаты и достижения</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/certificates')}
                      className="rounded-xl"
                    >
                      Все сертификаты
                    </Button>
                  </div>
                  
                  {/* Certificates Section */}
                  <Card variant="glass" className="rounded-2xl p-6 mb-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Мои сертификаты</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* This will be populated from API */}
                      <div className="text-center py-8 text-slate-500">
                        <FaTrophy className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">Завершайте курсы, чтобы получать сертификаты</p>
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-4 rounded-xl"
                          onClick={() => router.push('/courses')}
                        >
                          Перейти к курсам
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Achievements Section */}
                  <Card variant="glass" className="rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Достижения и бейджи</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Achievement badges will be displayed here */}
                      <div className="text-center py-4 text-slate-500">
                        <p className="text-sm">Завершайте курсы, чтобы открывать достижения</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'settings' && (
              <ScrollAnimation>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-semibold">Настройки</h3>
                    {!isEditing && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="rounded-xl"
                      >
                        Редактировать профиль
                      </Button>
                    )}
                  </div>
                  
                  <Card variant="glass" className="rounded-2xl p-6">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      {formError && (
                        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                          {formError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          id="first_name"
                          name="first_name"
                          type="text"
                          label="Имя"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          placeholder="Введите ваше имя"
                          leftIcon={<HiUser className="w-5 h-5" />}
                          disabled={!isEditing}
                        />

                        <Input
                          id="last_name"
                          name="last_name"
                          type="text"
                          label="Фамилия"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          placeholder="Введите вашу фамилию"
                          leftIcon={<HiUser className="w-5 h-5" />}
                          disabled={!isEditing}
                        />

                        <Input
                          id="username"
                          name="username"
                          type="text"
                          label="Имя пользователя"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="Введите имя пользователя"
                          leftIcon={<HiUserCircle className="w-5 h-5" />}
                          disabled={!isEditing}
                          required
                        />

                        <Input
                          id="email"
                          name="email"
                          type="email"
                          label="Email"
                          value={formData.email}
                          placeholder="your@email.com"
                          leftIcon={<HiMail className="w-5 h-5" />}
                          disabled={true}
                        />
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                          О себе
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows="4"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Расскажите о себе..."
                          disabled={!isEditing}
                          className={`
                            block w-full rounded-lg border px-3 py-2.5
                            ${!isEditing 
                              ? 'border-gray-200 bg-gray-50 text-gray-500' 
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }
                            text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-offset-0
                            transition-colors duration-200
                            resize-none
                          `}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          id="birth_date"
                          name="birth_date"
                          type="date"
                          label="Дата рождения"
                          value={formData.birth_date}
                          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                          disabled={!isEditing}
                        />

                        <Select
                          id="language_preference"
                          name="language_preference"
                          label="Язык интерфейса"
                          value={formData.language_preference}
                          onChange={(e) => setFormData({ ...formData, language_preference: e.target.value })}
                          options={[
                            { value: 'uz', label: 'O\'zbek' },
                            { value: 'ru', label: 'Русский' },
                            { value: 'en', label: 'English' },
                          ]}
                          disabled={!isEditing}
                        />

                        <Select
                          id="theme"
                          name="theme"
                          label="Тема"
                          value={formData.theme}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                          options={[
                            { value: 'light', label: 'Светлая' },
                            { value: 'dark', label: 'Тёмная' },
                            { value: 'auto', label: 'Автоматически' },
                          ]}
                          disabled={!isEditing}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex items-center space-x-4 pt-4 border-t border-app-border">
                          <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            isLoading={isSaving}
                            disabled={isSaving}
                            className="rounded-xl"
                          >
                            Сохранить изменения
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="rounded-xl"
                          >
                            Отмена
                          </Button>
                        </div>
                      )}
                    </form>

                    <div className="pt-6 mt-6 border-t border-app-border">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-error-50 border-error-300 text-error-700 hover:bg-error-100 hover:border-error-400 rounded-xl"
                      >
                        <HiLogout className="w-5 h-5" />
                        <span>Выйти из аккаунта</span>
                      </Button>
                    </div>
                  </Card>
                </div>
              </ScrollAnimation>
            )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
