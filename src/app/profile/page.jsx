'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Select from '../../components/Select'
import { authService } from '../../services/api'
import { HiUserCircle, HiChartBar, HiCog, HiLogout, HiMail, HiUser, HiGlobe, HiSun, HiMoon, HiClock, HiPhotograph } from 'react-icons/hi'
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
    { id: 'overview', label: 'Overview', icon: HiUserCircle },
    { id: 'progress', label: 'Progress', icon: HiChartBar },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy },
    { id: 'settings', label: 'Settings', icon: HiCog },
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

  // Получение статистики из профиля или значения по умолчанию
  const stats = [
    { 
      label: 'Streak Days', 
      value: streakDays || '0', 
      color: 'success', 
      icon: HiChartBar 
    },
    { 
      label: 'Learning Hours', 
      value: totalLearningHours || '0', 
      color: 'primary', 
      icon: HiClock 
    },
    { 
      label: 'Language', 
      value: languagePreference?.toUpperCase() || 'UZ', 
      color: 'info', 
      icon: HiGlobe 
    },
    { 
      label: 'Status', 
      value: isPro ? 'PRO' : 'Free', 
      color: isPro ? 'accent' : 'gray', 
      icon: FaTrophy 
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
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка данных профиля из backend...</p>
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
    <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
      {/* Profile Header with Gradient */}
      <section className="relative bg-gradient-to-br from-primary-600 via-accent-600 to-secondary-600 py-12 md:py-16">
        <div className="container-wrapper">
          <ScrollAnimation>
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between space-y-6 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6">
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
                      w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 
                      flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl
                      ${isUploadingAvatar ? 'opacity-50 cursor-wait' : 'cursor-pointer transition-all duration-200'}
                      ${isHoveringAvatar ? 'bg-black/60 backdrop-blur-md' : ''}
                      overflow-hidden relative
                    `}
                    title={isUploadingAvatar ? 'Загрузка...' : 'Нажмите для загрузки фото'}
                  >
                    {isUploadingAvatar ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : displayAvatarUrl ? (
                      <>
                        <img
                          src={displayAvatarUrl}
                          alt={fullName || username}
                          className={`w-full h-full object-cover transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-50' : 'opacity-100'}`}
                          onError={(e) => {
                            // Если изображение не загрузилось, скрываем его
                            e.target.style.display = 'none'
                          }}
                        />
                        <span 
                          className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md"
                          style={{ display: displayAvatarUrl ? 'none' : 'flex' }}
                        >
                          {userInitial}
                        </span>
                      </>
                    ) : (
                      <span className={`transition-opacity duration-200 ${isHoveringAvatar ? 'opacity-50' : 'opacity-100'}`}>{userInitial}</span>
                    )}
                    {isHoveringAvatar && !isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full">
                        <HiPhotograph className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center md:text-left text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{fullName || username}</h1>
                  <p className="text-white/90 text-lg">{email}</p>
                  {bio && (
                    <p className="text-white/80 text-sm mt-2 max-w-md">{bio}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50"
                >
                  <HiLogout className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        {/* Tabs */}
        <Card variant="glass" className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap space-x-1 px-4 md:px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-4 md:px-6 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <ScrollAnimation>
                <div className="space-y-6">
                  {/* Статистика */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon
                      const colorClasses = getColorClasses(stat.color)
                      return (
                        <Card key={stat.label} variant="stat" className="p-6">
                          <div className={`w-12 h-12 rounded-lg ${colorClasses.bg} flex items-center justify-center mb-4`}>
                            <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                          </div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
                          <p className={`text-2xl md:text-3xl font-bold ${colorClasses.text}`}>{stat.value}</p>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Информация о профиле */}
                  <Card variant="glass" className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Информация о профиле</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Имя пользователя</p>
                        <p className="text-base font-medium text-gray-900">{username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-base font-medium text-gray-900">{email}</p>
                      </div>
                      {firstName && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Имя</p>
                          <p className="text-base font-medium text-gray-900">{firstName}</p>
                        </div>
                      )}
                      {lastName && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Фамилия</p>
                          <p className="text-base font-medium text-gray-900">{lastName}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Язык интерфейса</p>
                        <p className="text-base font-medium text-gray-900">{languagePreference?.toUpperCase() || 'UZ'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Тема</p>
                        <p className="text-base font-medium text-gray-900 capitalize">{theme}</p>
                      </div>
                    </div>
                    {bio && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-1">О себе</p>
                        <p className="text-base text-gray-900">{bio}</p>
                      </div>
                    )}
                  </Card>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'progress' && (
              <ScrollAnimation>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">Learning Progress</h3>
                  <Card variant="glass" className="p-6">
                    <p className="text-gray-600">Progress charts and statistics will be displayed here.</p>
                  </Card>
                </div>
              </ScrollAnimation>
            )}

            {activeTab === 'achievements' && (
              <ScrollAnimation>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-4">Achievements</h3>
                  <Card variant="glass" className="p-6">
                    <p className="text-gray-600">Your achievements and badges will be displayed here.</p>
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
                      >
                        Редактировать профиль
                      </Button>
                    )}
                  </div>
                  
                  <Card variant="glass" className="p-6">
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
                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                          <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            isLoading={isSaving}
                            disabled={isSaving}
                          >
                            Сохранить изменения
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                          >
                            Отмена
                          </Button>
                        </div>
                      )}
                    </form>

                    <div className="pt-6 mt-6 border-t border-gray-200">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-error-50 border-error-300 text-error-700 hover:bg-error-100 hover:border-error-400"
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
    </main>
  )
}
