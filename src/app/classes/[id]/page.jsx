'use client'

import { useMemo, useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Card from '../../../components/Card'
import Badge from '../../../components/Badge'
import ScrollAnimation from '../../../components/ScrollAnimation'
import { authService, classesService } from '../../../services/api'
import { HiUsers, HiClipboardList, HiKey, HiChartBar, HiSparkles, HiClock, HiSearch, HiFilter, HiX, HiUserAdd, HiMail } from 'react-icons/hi'

export default function ClassDetailPage({ params }) {
  const router = useRouter()
  // Разворачиваем Promise params с помощью React.use()
  const resolvedParams = use(params)
  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [isChecking, setIsChecking] = useState(true)
  const [classData, setClassData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [members, setMembers] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  
  // Состояния для модального окна приглашения
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [searchEmail, setSearchEmail] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')

  // Загрузка данных класса
  const loadClassData = async (classId) => {
    try {
      setIsLoading(true)
      setError('')
      
      const data = await classesService.getClassById(classId)
      console.log('Загруженные данные класса:', data)
      setClassData(data)
    } catch (err) {
      console.error('Ошибка при загрузке класса:', err)
      setError(err?.message || 'Не удалось загрузить данные класса')
    } finally {
      setIsLoading(false)
    }
  }

  // Загрузка участников класса
  const loadClassMembers = async (classId) => {
    try {
      setIsLoadingMembers(true)
      
      const membersData = await classesService.getClassMembers(classId)
      console.log('Загруженные участники класса:', membersData)
      setMembers(membersData || [])
    } catch (err) {
      console.error('Ошибка при загрузке участников класса:', err)
      // Не показываем ошибку пользователю, просто оставляем пустой массив
      setMembers([])
    } finally {
      setIsLoadingMembers(false)
    }
  }

  // Проверка роли пользователя и загрузка данных класса при загрузке страницы
  useEffect(() => {
    const checkUserRoleAndLoadData = async () => {
      // Проверяем авторизацию
      if (!authService.isAuthenticated()) {
        router.push('/auth/login')
        return
      }

      // Получаем данные пользователя
      const user = authService.getCurrentUser()
      
      // Обрабатываем разные структуры данных пользователя
      const userData = user?.data || user
      const userRole = userData?.role

      // Если пользователь - студент, перенаправляем на главную страницу
      if (userRole === 'student') {
        router.push('/')
        return
      }

      // Если роль не teacher, также перенаправляем
      if (userRole !== 'teacher') {
        router.push('/')
        return
      }

      // Если всё в порядке, показываем страницу и загружаем данные класса
      setIsChecking(false)
      
      // Получаем ID класса из resolvedParams
      const classId = resolvedParams?.id
      if (classId) {
        await loadClassData(classId)
        // Загружаем участников класса параллельно
        await loadClassMembers(classId)
      } else {
        setError('ID класса не указан')
      }
    }

    checkUserRoleAndLoadData()
  }, [router, resolvedParams])
  // Фильтрация участников
  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return members.filter((member) => {
      // Поддерживаем разные форматы данных участника
      const memberName = member.name || 
                        member.username || 
                        member.full_name || 
                        `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
                        member.email ||
                        'Unknown'
      
      const matchesQuery = normalizedQuery
        ? memberName.toLowerCase().includes(normalizedQuery) ||
          (member.email && member.email.toLowerCase().includes(normalizedQuery))
        : true
      
      // Если есть поле status или progress, используем его для фильтрации
      // Иначе показываем всех при выборе "All"
      const memberStatus = member.status || 
                          (member.progress >= 80 ? 'Excellent' : 
                           member.progress >= 60 ? 'On track' : 
                           'Needs help')
      
      const matchesStatus = selectedStatus === 'All' || memberStatus === selectedStatus
      return matchesQuery && matchesStatus
    })
  }, [query, selectedStatus, members])

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  // Вычисление процента заполнения
  const completionRate = classData && classData.max_students > 0
    ? Math.round((classData.students_count / classData.max_students) * 100)
    : 0

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

  // Функция для получения URL аватара участника
  const getMemberAvatarUrl = (member) => {
    const avatarUrl = member.avatar || 
                     member.avatar_url || 
                     member.profile?.avatar_url || 
                     member.profile?.avatar ||
                     null
    return avatarUrl ? getAvatarUrl(avatarUrl) : null
  }

  // Функция для получения инициалов участника
  const getMemberInitials = (memberName) => {
    if (!memberName || memberName === 'Unknown') return 'U'
    const parts = memberName.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return memberName.charAt(0).toUpperCase()
  }

  // Функция поиска пользователя по email
  const handleSearchUser = async () => {
    if (!searchEmail.trim()) {
      setInviteError('Введите email пользователя')
      return
    }

    try {
      setIsSearching(true)
      setInviteError('')
      setFoundUser(null)
      
      const user = await classesService.searchUsersByEmail(searchEmail.trim())
      setFoundUser(user)
    } catch (err) {
      console.error('Ошибка при поиске пользователя:', err)
      setInviteError(err?.message || 'Пользователь не найден')
      setFoundUser(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Функция отправки приглашения
  const handleInviteUser = async () => {
    if (!foundUser || !foundUser.id) {
      setInviteError('Пользователь не выбран')
      return
    }

    try {
      setIsInviting(true)
      setInviteError('')
      setInviteSuccess('')
      
      const classId = resolvedParams?.id
      if (!classId) {
        throw new Error('ID класса не найден')
      }

      console.log('Отправка приглашения:', { classId, userId: foundUser.id })
      const result = await classesService.inviteUserToClass(classId, foundUser.id)
      console.log('Результат приглашения:', result)
      
      setInviteSuccess('Приглашение успешно отправлено!')
      
      // Обновляем список участников
      await loadClassMembers(classId)
      
      // Очищаем форму через 2 секунды
      setTimeout(() => {
        setSearchEmail('')
        setFoundUser(null)
        setInviteSuccess('')
      }, 2000)
    } catch (err) {
      console.error('Ошибка при отправке приглашения:', err)
      console.error('Детали ошибки:', {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status
      })
      
      // Обрабатываем разные форматы ошибок
      let errorMessage = 'Ошибка при отправке приглашения'
      if (err?.response?.data) {
        const errorData = err.response.data
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message
        } else if (errorData?.message) {
          errorMessage = errorData.message
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        }
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setInviteError(errorMessage)
    } finally {
      setIsInviting(false)
    }
  }

  // Закрытие модального окна
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false)
    setSearchEmail('')
    setFoundUser(null)
    setInviteError('')
    setInviteSuccess('')
  }

  // Обработка Escape для закрытия модального окна
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isInviteModalOpen) {
        handleCloseInviteModal()
      }
    }

    if (isInviteModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isInviteModalOpen])

  // Показываем загрузку во время проверки роли или загрузки данных
  if (isChecking || (isLoading && !classData)) {
    return (
      <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            {isChecking ? 'Проверка доступа...' : 'Загрузка данных класса...'}
          </p>
        </div>
      </main>
    )
  }

  // Если ошибка и нет данных
  if (error && !classData) {
    return (
      <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-error-50 border border-error-200 text-error-700 px-6 py-4 rounded-lg">
            <p className="font-semibold mb-2">Ошибка загрузки класса</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => router.push('/classes')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Вернуться к списку классов
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl animate-pulse" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
      </div>
      <div className="container-wrapper relative pt-24 pb-10 sm:pt-28 md:pt-28 md:pb-14">
        <div className="relative mb-10 md:mb-12">
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <ScrollAnimation>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 mb-4 tracking-wide">
                  Cohort Overview
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-3 text-slate-900 font-display break-words">
                  {classData?.name || 'Class Details'}
                </h1>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-accent break-words">
                  {classData?.description || 'Manage your learning space, monitor performance, and keep progress steady with clear insights.'}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {classData?.updated_at && (
                    <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
                      Обновлено: {formatDate(classData.updated_at)}
                    </span>
                  )}
                  {classData?.created_at && (
                    <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1">
                      Создано: {formatDate(classData.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={150}>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                {classData?.code && (
                  <Badge variant="primary" className="flex items-center space-x-2 px-4 py-2">
                    <HiKey className="w-4 h-4" />
                    <span>Invite Code: {classData.code}</span>
                  </Badge>
                )}
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <HiUserAdd className="w-4 h-4" />
                  <span>Пригласить ученика</span>
                </button>
                <div className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm w-full sm:w-auto ${
                  classData?.is_active ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${classData?.is_active ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                  {classData?.is_active ? 'Активный' : 'Неактивный'}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>

        <ScrollAnimation delay={220}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-200/40 blur-2xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-slate-500">Active Learners</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">
                {classData?.students_count || 0}
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                из {classData?.max_students || 0} максимум
              </p>
              <div className="mt-4 flex items-center gap-2">
                {[32, 60, 40, 72, 55, 90, 68].map((value, index) => (
                  <span
                    key={`learners-${index}`}
                    className="h-6 w-1.5 rounded-full bg-gradient-to-t from-emerald-200 via-emerald-400 to-emerald-500"
                    style={{ height: `${Math.max(12, value / 2)}px` }}
                  />
                ))}
              </div>
            </Card>
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden group">
              <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-slate-500">Completion Rate</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">{completionRate}%</p>
              <p className="text-sm text-blue-600 mt-2">
                {classData?.students_count || 0} / {classData?.max_students || 0} студентов
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-300 transition-all duration-500"
                  style={{ width: `${Math.min(completionRate, 100)}%` }}
                />
              </div>
            </Card>
            <Card variant="glass" className="p-5 md:p-6 relative overflow-hidden group">
              <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-amber-200/40 blur-2xl animate-float" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-sm text-slate-500">Assignments Due</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2">3</p>
              <p className="text-sm text-amber-600 mt-2">Next deadline in 48h</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Due window opening soon
              </div>
            </Card>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation delay={320}>
            <Card variant="glass" className="p-6 md:p-8 relative overflow-hidden">
              <div className="flex items-center space-x-2 mb-6">
                <HiUsers className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl md:text-2xl font-semibold font-display">Students</h3>
                {isLoadingMembers && (
                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-5">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 w-full sm:w-auto">
                  <HiSearch className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="bg-transparent outline-none placeholder:text-slate-400 w-full min-w-0"
                    placeholder="Search students"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 w-full sm:w-auto">
                  <HiFilter className="h-4 w-4" />
                  {['All', 'On track', 'Excellent', 'Needs help'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`rounded-full px-2 py-1 transition-all ${
                        selectedStatus === status
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'text-slate-600 hover:text-emerald-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {isLoadingMembers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                    <p className="text-sm text-slate-500">Загрузка участников...</p>
                  </div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map((member, index) => {
                    // Поддерживаем разные форматы данных участника
                    const memberName = member.name || 
                                      member.username || 
                                      member.full_name || 
                                      `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
                                      member.email ||
                                      'Unknown'
                    
                    const memberEmail = member.email || ''
                    const memberProgress = member.progress || member.completion_rate || 0
                    const memberStatus = member.status || 
                                       (memberProgress >= 80 ? 'Excellent' : 
                                        memberProgress >= 60 ? 'On track' : 
                                        'Needs help')
                    
                    const memberAvatarUrl = getMemberAvatarUrl(member)
                    const memberInitials = getMemberInitials(memberName)
                    
                    return (
                      <div
                        key={member.id || member.user_id || index}
                        className="relative overflow-hidden group/item flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-3 p-4 bg-white/70 rounded-xl border border-white/70 hover:bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.7),transparent)] opacity-0 group-hover/item:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 flex items-center gap-3">
                          {/* Аватар участника */}
                          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {memberAvatarUrl ? (
                              <img
                                src={memberAvatarUrl}
                                alt={memberName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Если изображение не загрузилось, показываем инициалы
                                  e.target.style.display = 'none'
                                  e.target.nextElementSibling.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <span 
                              className={`absolute inset-0 flex items-center justify-center text-white font-semibold text-sm ${
                                memberAvatarUrl ? 'hidden' : 'flex'
                              }`}
                            >
                              {memberInitials}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{memberName}</p>
                            {memberEmail && (
                              <p className="text-xs text-slate-500">{memberEmail}</p>
                            )}
                            {!memberEmail && (
                              <p className="text-xs text-slate-500">Member #{index + 1}</p>
                            )}
                          </div>
                        </div>
                        <div className="relative z-10 flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
                          {memberProgress > 0 && (
                            <>
                              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
                                  style={{ width: `${Math.min(memberProgress, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-600 font-medium">{memberProgress}%</span>
                            </>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            memberStatus === 'Excellent'
                              ? 'bg-emerald-100 text-emerald-700'
                              : memberStatus === 'Needs help'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {memberStatus}
                          </span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                    {members.length === 0 
                      ? 'В классе пока нет участников' 
                      : 'Участники не найдены. Попробуйте другой поиск или фильтр.'}
                  </div>
                )}
              </div>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation delay={380}>
            <Card variant="glass" className="p-6 md:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.7),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center space-x-2 mb-6">
                <HiClipboardList className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl md:text-2xl font-semibold font-display">Activities</h3>
              </div>
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Weekly energy</span>
                  <span className="text-emerald-600 font-semibold">+8%</span>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  {[18, 28, 20, 32, 24, 36, 30].map((value, index) => (
                    <span
                      key={`activity-${index}`}
                      className="w-3 rounded-full bg-gradient-to-t from-amber-200 via-amber-400 to-orange-400"
                      style={{ height: `${value}px` }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  'Grammar lab: Passive voice mastery session',
                  'Live review: Error patterns & feedback',
                  'Writing sprint: 20-minute essay drill',
                ].map((activity, index) => (
                  <div
                    key={activity}
                    className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-sm text-slate-500">Today • Session {index + 1}</p>
                    <p className="text-slate-900 font-medium mt-1">{activity}</p>
                  </div>
                ))}
                <div className="rounded-xl bg-slate-900 text-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Next highlight</p>
                  <p className="text-white mt-1">Peer review meetup — Thu, 4:00 PM</p>
                </div>
              </div>
            </Card>
          </ScrollAnimation>
        </div>
      </div>

      {/* Модальное окно приглашения */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleCloseInviteModal}
          />

          {/* Modal */}
          <Card variant="glass" className="relative z-10 w-full max-w-lg p-5 sm:p-6 md:p-8 max-h-[85vh] overflow-y-auto">
            <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl" />
            <button
              onClick={handleCloseInviteModal}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Закрыть модальное окно"
            >
              <HiX className="w-6 h-6" />
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6 pr-10">
              <div>
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 tracking-wide">
                  Приглашение
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mt-3 font-display">
                  Пригласить ученика
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-accent">
                  Найдите ученика по email и отправьте приглашение в класс
                </p>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]" />
              </div>
            </div>

            <div className="space-y-5">
              {/* Поиск по email */}
              <div>
                <label htmlFor="email-search" className="block text-sm font-medium text-slate-700 mb-2">
                  Email ученика
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-600 flex-1">
                    <HiMail className="h-4 w-4 text-slate-400" />
                    <input
                      id="email-search"
                      type="email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchUser()
                        }
                      }}
                      className="bg-transparent outline-none placeholder:text-slate-400 w-full min-w-0"
                      placeholder="example@email.com"
                      disabled={isSearching || isInviting}
                    />
                  </div>
                  <button
                    onClick={handleSearchUser}
                    disabled={isSearching || !searchEmail.trim()}
                    className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Поиск...</span>
                      </>
                    ) : (
                      <>
                        <HiSearch className="w-4 h-4" />
                        <span>Найти</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ошибки и успех */}
              {inviteError && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg text-sm">
                  {inviteError}
                </div>
              )}
              {inviteSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                  {inviteSuccess}
                </div>
              )}

              {/* Найденный пользователь */}
              {foundUser && (
                <div className="rounded-xl border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Аватар */}
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {foundUser.avatar || foundUser.avatar_url ? (
                          <img
                            src={getAvatarUrl(foundUser.avatar || foundUser.avatar_url)}
                            alt={foundUser.name || foundUser.email}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextElementSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-white font-semibold text-sm ${
                            foundUser.avatar || foundUser.avatar_url ? 'hidden' : 'flex'
                          }`}
                        >
                          {getMemberInitials(
                            `${foundUser.first_name || ''} ${foundUser.last_name || ''}`.trim() || 
                            foundUser.username || 
                            foundUser.name || 
                            foundUser.email || 
                            'U'
                          )}
                        </span>
                      </div>
                      {/* Информация о пользователе */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {(() => {
                            const fullName = `${foundUser.first_name || ''} ${foundUser.last_name || ''}`.trim()
                            return fullName || foundUser.username || foundUser.name || foundUser.email || 'Пользователь'
                          })()}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {foundUser.email}
                        </p>
                        {foundUser.username && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            @{foundUser.username}
                          </p>
                        )}
                        {foundUser.role && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {foundUser.role === 'student' ? 'Студент' : foundUser.role}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Кнопка приглашения */}
                    <button
                      onClick={handleInviteUser}
                      disabled={isInviting}
                      className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isInviting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Отправка...</span>
                        </>
                      ) : (
                        <>
                          <HiUserAdd className="w-4 h-4" />
                          <span>Пригласить</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Подсказка */}
              {!foundUser && !isSearching && (
                <div className="text-center py-4 text-sm text-slate-500">
                  Введите email ученика и нажмите "Найти"
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </main>
  )
}
