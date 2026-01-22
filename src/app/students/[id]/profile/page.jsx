'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '../../../../components/Card'
import ScrollAnimation from '../../../../components/ScrollAnimation'
import Badge from '../../../../components/Badge'
import { studentService } from '../../../../services/api'
import { 
  HiUserCircle, 
  HiClock, 
  HiAcademicCap, 
  HiUserGroup, 
  HiKey, 
  HiCalendar,
  HiArrowLeft,
  HiSparkles
} from 'react-icons/hi'
import { FaTrophy, FaFire } from 'react-icons/fa'

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params?.id
  const [studentData, setStudentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Загрузка данных профиля студента
  useEffect(() => {
    const loadStudentProfile = async () => {
      if (!studentId) {
        setError('ID студента не указан')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const response = await studentService.getStudentProfile(studentId)
        
        // Обрабатываем структуру ответа (может быть data.data или просто data)
        const profileData = response?.data || response
        
        if (profileData) {
          setStudentData(profileData)
        } else {
          throw new Error('Данные профиля не получены')
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля студента:', err)
        setError(err?.message || 'Ошибка при загрузке профиля студента')
      } finally {
        setIsLoading(false)
      }
    }

    loadStudentProfile()
  }, [studentId])

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

  // Получение данных студента
  const firstName = studentData?.first_name || ''
  const lastName = studentData?.last_name || ''
  const username = studentData?.username || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || username
  const bio = studentData?.bio || ''
  const avatarUrl = studentData?.avatar_url ? getAvatarUrl(studentData.avatar_url) : null
  const userInitial = username ? username.charAt(0).toUpperCase() : 'S'
  const dateJoined = studentData?.date_joined ? new Date(studentData.date_joined).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null

  // Статистика
  const streakDays = studentData?.streak_days || 0
  const totalLearningHours = studentData?.total_learning_hours || 0

  // Информация о классе
  const classInfo = studentData?.class_info || null
  const className = classInfo?.name || ''
  const classCode = classInfo?.code || ''
  const studentsCount = classInfo?.students_count || 0
  const teacher = classInfo?.teacher || null
  const teacherName = teacher ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || teacher.username : null
  const joinedAt = classInfo?.joined_at ? new Date(classInfo.joined_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null

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
      warning: {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
      },
    }
    return colorMap[color] || colorMap.primary
  }

  // Показываем загрузку
  if (isLoading) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка профиля студента...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Показываем ошибку
  if (error || !studentData) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-gray-50">
        <div className="container-wrapper py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-error-600 mb-4 text-lg">{error || 'Профиль студента не найден'}</p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Вернуться назад
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
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName || username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <span>{userInitial}</span>
                    )}
                  </div>
                </div>
                
                {/* Name and Info */}
                <div className="text-center md:text-left text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{fullName || username}</h1>
                  <p className="text-white/90 text-lg">@{username}</p>
                  {bio && (
                    <p className="text-white/80 text-sm mt-2 max-w-md">{bio}</p>
                  )}
                </div>
              </div>
              
              {/* Back Button */}
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  <span>Назад</span>
                </button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-12">
        {/* Statistics Cards */}
        <ScrollAnimation delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* Streak Days */}
            <Card variant="stat" className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses('warning').bg} flex items-center justify-center mb-4`}>
                    <FaFire className={`w-6 h-6 ${getColorClasses('warning').text}`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Дней подряд</h3>
                  <p className={`text-2xl md:text-3xl font-bold ${getColorClasses('warning').text}`}>
                    {streakDays}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="warning" size="sm">
                    Активная серия
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Total Learning Hours */}
            <Card variant="stat" className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses('success').bg} flex items-center justify-center mb-4`}>
                    <HiClock className={`w-6 h-6 ${getColorClasses('success').text}`} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Часов обучения</h3>
                  <p className={`text-2xl md:text-3xl font-bold ${getColorClasses('success').text}`}>
                    {totalLearningHours}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="success" size="sm">
                    Всего
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </ScrollAnimation>

        {/* Class Information */}
        {classInfo && (
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="p-6 md:p-8 mb-8 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary-200/40 blur-2xl" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.7),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex items-start gap-3 mb-6">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <HiAcademicCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900 font-display">Информация о классе</div>
                  <div className="text-sm text-slate-600 font-accent">
                    Данные о классе студента
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Class Name */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <HiSparkles className="h-4 w-4" />
                    Название класса
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{className}</p>
                </div>

                {/* Class Code */}
                {classCode && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <HiKey className="h-4 w-4" />
                      Код класса
                    </div>
                    <Badge variant="primary" size="md" className="font-mono">
                      {classCode}
                    </Badge>
                  </div>
                )}

                {/* Students Count */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <HiUserGroup className="h-4 w-4" />
                    Количество студентов
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{studentsCount}</p>
                </div>

                {/* Teacher */}
                {teacherName && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <HiUserCircle className="h-4 w-4" />
                      Учитель
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{teacherName}</p>
                  </div>
                )}

                {/* Joined Date */}
                {joinedAt && (
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <HiCalendar className="h-4 w-4" />
                      Дата присоединения к классу
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{joinedAt}</p>
                  </div>
                )}
              </div>
            </Card>
          </ScrollAnimation>
        )}

        {/* Additional Information */}
        <ScrollAnimation delay={300}>
          <Card variant="glass" className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4 text-slate-900">Дополнительная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Имя пользователя</p>
                <p className="text-base font-medium text-gray-900">@{username}</p>
              </div>

              {/* Full Name */}
              {(firstName || lastName) && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Полное имя</p>
                  <p className="text-base font-medium text-gray-900">{fullName}</p>
                </div>
              )}

              {/* Date Joined */}
              {dateJoined && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Дата регистрации</p>
                  <p className="text-base font-medium text-gray-900">{dateJoined}</p>
                </div>
              )}

              {/* Bio */}
              {bio && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">О себе</p>
                  <p className="text-base text-gray-900">{bio}</p>
                </div>
              )}
            </div>
          </Card>
        </ScrollAnimation>
      </div>
    </main>
  )
}
