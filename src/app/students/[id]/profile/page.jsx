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
                  <div className="mt-2 h-5 w-64 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-wrapper py-8 md:py-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} variant="glass" hover={false} className="rounded-2xl p-6">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="mt-4 h-4 w-28 rounded-lg bg-gray-200 animate-pulse" />
                  <div className="mt-2 h-8 w-20 rounded-lg bg-gray-200 animate-pulse" />
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Card variant="glass" hover={false} className="rounded-2xl p-6">
                <div className="h-6 w-56 rounded-lg bg-gray-200 animate-pulse" />
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

  // Показываем ошибку
  if (error || !studentData) {
    return (
      <main className="w-full overflow-x-hidden min-h-screen bg-[#F7F8FA]">
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
                  <div className="h-20 w-20 rounded-full bg-white border border-app-border shadow-card flex items-center justify-center text-slate-900 text-3xl font-extrabold overflow-hidden">
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

                  <div className="min-w-0">
                    <div className="text-[28px] leading-[32px] md:text-[32px] md:leading-[36px] font-extrabold text-slate-900 truncate">
                      {fullName || username}
                    </div>
                    <div className="mt-1 text-[14px] md:text-[15px] text-slate-600 truncate">@{username}</div>
                  </div>
                </div>

                <button
                  onClick={() => router.back()}
                  className="h-10 inline-flex items-center gap-2 px-4 rounded-xl bg-white/70 hover:bg-white border border-app-border text-slate-700 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                >
                  <HiArrowLeft className="w-5 h-5" />
                  <span>Назад</span>
                </button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <div className="container-wrapper py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto">
        {/* Statistics Cards */}
        <ScrollAnimation delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Серия дней', value: streakDays, hint: 'подряд', icon: FaFire },
              { label: 'Часы обучения', value: totalLearningHours, hint: 'всего', icon: HiClock },
              { label: 'Класс', value: className || '—', hint: null, icon: HiAcademicCap },
              { label: 'Учитель', value: teacherName || '—', hint: null, icon: HiUserCircle },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} variant="glass" className="rounded-2xl p-6">
                  <div className="h-10 w-10 rounded-xl bg-white border border-app-border shadow-card flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="mt-4 text-[13px] text-slate-500">{stat.label}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="text-[30px] leading-[34px] font-extrabold text-slate-900 truncate">{stat.value}</div>
                    {stat.hint && <div className="text-[13px] text-slate-500">{stat.hint}</div>}
                  </div>
                </Card>
              )
            })}
          </div>
        </ScrollAnimation>

        {/* Class Information */}
        {classInfo && (
          <ScrollAnimation delay={200}>
            <Card variant="glass" className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden group">
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
          <Card variant="glass" className="rounded-2xl p-6 md:p-8">
            <h3 className="text-[18px] leading-[1.25] font-extrabold mb-4 text-slate-900">Данные профиля</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Username */}
              <div className="py-3 border-b border-app-border">
                <div className="text-[12px] text-slate-500">Имя пользователя</div>
                <div className="mt-1 text-[15px] font-semibold text-slate-900">@{username}</div>
              </div>

              {/* Full Name */}
              {(firstName || lastName) && (
                <div className="py-3 border-b border-app-border">
                  <div className="text-[12px] text-slate-500">Полное имя</div>
                  <div className="mt-1 text-[15px] font-semibold text-slate-900">{fullName}</div>
                </div>
              )}

              {/* Date Joined */}
              {dateJoined && (
                <div className="py-3 border-b border-app-border">
                  <div className="text-[12px] text-slate-500">Дата регистрации</div>
                  <div className="mt-1 text-[15px] font-semibold text-slate-900">{dateJoined}</div>
                </div>
              )}

              {/* Bio */}
              {bio && (
                <div className="md:col-span-2">
                  <div className="text-[12px] text-slate-500">О себе</div>
                  <div className="mt-1 text-[15px] leading-[1.6] text-slate-900">{bio}</div>
                </div>
              )}
            </div>
          </Card>
        </ScrollAnimation>
        </div>
      </div>
    </main>
  )
}
