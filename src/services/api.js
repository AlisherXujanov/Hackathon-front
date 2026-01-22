import axios from 'axios'

// Базовый URL API из переменных окружения или значение по умолчанию
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crucially-innate-chimp.cloudpub.ru'

export function isDemoMode() {
  // По умолчанию включаем демо-режим (для хакатона без backend)
  // Выключение: NEXT_PUBLIC_DEMO_MODE="false" или localStorage demo_mode="false"
  const envValue = process.env.NEXT_PUBLIC_DEMO_MODE
  const envEnabled = envValue ? envValue !== 'false' : true

  if (typeof window === 'undefined') return envEnabled

  const localValue = window.localStorage?.getItem('demo_mode')
  if (localValue === 'true') return true
  if (localValue === 'false') return false

  return envEnabled
}

// Функции для работы с пользователями в localStorage
function hashPassword(password, email) {
  // Простое хеширование для демо (в продакшене использовать bcrypt)
  if (typeof window === 'undefined') return password
  return btoa(email + ':' + password).replace(/[^a-zA-Z0-9]/g, '')
}

function getUsers() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('users')
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveUsers(users) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('users', JSON.stringify(users))
  } catch (error) {
    console.error('Ошибка при сохранении пользователей:', error)
  }
}

function getCurrentUserId() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('current_user')
    if (!raw) return null
    return parseInt(raw, 10)
  } catch {
    return null
  }
}

function setCurrentUserId(userId) {
  if (typeof window === 'undefined') return
  localStorage.setItem('current_user', String(userId))
}

function getCurrentUser() {
  if (typeof window === 'undefined') return null
  const userId = getCurrentUserId()
  if (!userId) return null
  
  const users = getUsers()
  return users.find(u => u.id === userId) || null
}

function setCurrentUser(userData) {
  if (typeof window === 'undefined') return
  if (!userData || !userData.id) return
  
  setCurrentUserId(userData.id)
  
  // Обновляем пользователя в массиве
  const users = getUsers()
  const index = users.findIndex(u => u.id === userData.id)
  if (index !== -1) {
    users[index] = userData
  } else {
    users.push(userData)
  }
  saveUsers(users)
  
  // Сохраняем в старом формате для совместимости
  const wrapped = { data: userData }
  localStorage.setItem('user', JSON.stringify(wrapped))
  
  const role = userData?.role
  if (role) setUserRoleCookie(role)
}

function ensureTokens() {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem('access_token')) {
    localStorage.setItem('access_token', 'local-access-token')
  }
  if (!localStorage.getItem('refresh_token')) {
    localStorage.setItem('refresh_token', 'local-refresh-token')
  }
}

function buildUserFromCredentials(userData, isRegistration = false) {
  const email = (userData.email || '').trim()
  const username = (userData.username || '').trim()
  const password = userData.password || ''
  const role = (userData.role || 'student').toLowerCase()
  
  if (!email || !username) {
    throw new Error('Email и username обязательны')
  }
  
  const users = getUsers()
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
  
  const passwordHash = hashPassword(password, email)
  
  const newUser = {
    id: nextId,
    email,
    username,
    passwordHash,
    first_name: userData.first_name || username,
    last_name: userData.last_name || '',
    role,
    profile: {
      bio: '',
      birth_date: null,
      language_preference: 'ru',
      theme: 'light',
      total_learning_hours: 0,
      streak_days: 0,
      is_pro: false,
      avatar_url: null,
      created_at: new Date().toISOString(),
    },
  }
  
  return newUser
}

// Создание экземпляра axios с базовыми настройками
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor для добавления JWT токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    // Проверяем, есть ли токен в localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor для обработки ответов и обновления токена при 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Если получили 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refresh_token')

          if (refreshToken) {
            // Пытаемся обновить токен
            const response = await axios.post(`${API_URL}/users/refresh/`, {
              refresh: refreshToken,
            })

            const { access } = response.data
            localStorage.setItem('access_token', access)

            // Повторяем оригинальный запрос с новым токеном
            originalRequest.headers['Authorization'] = `Bearer ${access}`
            return apiClient(originalRequest)
          }
        }
      } catch (refreshError) {
        // Если refresh token также истёк, очищаем localStorage и перенаправляем на страницу входа
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          clearUserRoleCookie()
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

function setUserRoleCookie(role) {
  if (typeof document === 'undefined' || !role) return
  document.cookie = `user_role=${encodeURIComponent(role)}; path=/; max-age=604800; SameSite=Lax`
}

function clearUserRoleCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax'
}

// Сервис для работы с аутентификацией
export const authService = {
  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя (username, email, password)
   * @returns {Promise} Ответ от сервера
   */
  register: async (userData) => {
    if (isDemoMode()) {
      const email = (userData.email || '').trim()
      const username = (userData.username || '').trim()
      
      if (!email || !username) {
        throw new Error('Email и username обязательны')
      }
      
      if (!userData.password || userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов')
      }
      
      const users = getUsers()
      
      // Проверка уникальности email
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Пользователь с таким email уже существует')
      }
      
      // Проверка уникальности username
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Пользователь с таким username уже существует')
      }
      
      const newUser = buildUserFromCredentials(userData, true)
      users.push(newUser)
      saveUsers(users)
      
      ensureTokens()
      setCurrentUser(newUser)
      
      return { 
        data: newUser, 
        access: 'local-access-token', 
        refresh: 'local-refresh-token' 
      }
    }
    try {
      const response = await apiClient.post('/api/v1/users/register/', userData)
      return response.data
    } catch (error) {
      // Обрабатываем ошибки валидации
      if (error.response?.data) {
        const errorData = error.response.data

        // Если это объект с полями ошибок (Django style)
        if (typeof errorData === 'object' && !errorData.message && !errorData.error) {
          // Собираем все сообщения об ошибках в одну строку
          const errorMessages = []

          Object.keys(errorData).forEach((key) => {
            const value = errorData[key]
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`)
            } else if (typeof value === 'string') {
              errorMessages.push(`${key}: ${value}`)
            }
          })

          throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Ошибка валидации данных')
        }

        // Если есть конкретное сообщение об ошибке
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          (typeof errorData === 'string' ? errorData : 'Ошибка при регистрации')

        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при регистрации. Проверьте подключение к серверу.')
    }
  },

  /**
   * Вход пользователя
   * @param {Object} credentials - Учетные данные (email, password)
   * @returns {Promise} Ответ от сервера с токенами и данными пользователя
   */
  login: async (credentials) => {
    if (isDemoMode()) {
      const email = (credentials.email || '').trim()
      const password = credentials.password || ''
      
      if (!email || !password) {
        throw new Error('Email и пароль обязательны')
      }
      
      const users = getUsers()
      const passwordHash = hashPassword(password, email)
      
      // Поиск пользователя по email и паролю
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.passwordHash === passwordHash
      )
      
      if (!user) {
        throw new Error('Неверный email или пароль')
      }
      
      ensureTokens()
      setCurrentUser(user)
      
      // Начисляем очки за ежедневный вход
      if (typeof window !== 'undefined' && user.id) {
        const { awardPoints, incrementUserStat } = require('../store/gamification/gamificationData')
        const lastLogin = localStorage.getItem(`user_${user.id}_last_login`)
        const today = new Date().toISOString().split('T')[0]
        
        if (lastLogin !== today) {
          awardPoints(user.id, 5, 'Ежедневный вход', 'other')
          incrementUserStat(user.id, 'daily_logins', 1)
          localStorage.setItem(`user_${user.id}_last_login`, today)
        }
      }
      
      return { 
        access: 'local-access-token', 
        refresh: 'local-refresh-token', 
        user: user 
      }
    }
    try {
      const response = await apiClient.post('/api/v1/users/login/', credentials)
      const { access, refresh, user } = response.data

      // Сохраняем токены в localStorage
      if (typeof window !== 'undefined') {
        if (access) localStorage.setItem('access_token', access)
        if (refresh) localStorage.setItem('refresh_token', refresh)

        // Если данные пользователя не пришли в ответе, получаем их из /api/v1/users/me/
        
        let userStored = user
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        } else if (access) {
          try {
            const userResponse = await apiClient.get('/api/v1/users/me/')
            const userData = userResponse.data
            userStored = userData
            localStorage.setItem('user', JSON.stringify(userData))
          } catch (meError) {
            console.warn('Не удалось получить данные пользователя из /api/v1/users/me/', meError)
          }
        }
        const role = (userStored?.data || userStored)?.role
        if (role) setUserRoleCookie(role)
      }

      return response.data
    } catch (error) {
      // Обрабатываем ошибки входа
      if (error.response?.data) {
        const errorData = error.response.data

        // Если это объект с полями ошибок (Django style)
        if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
          // Собираем все сообщения об ошибках в одну строку
          const errorMessages = []

          Object.keys(errorData).forEach((key) => {
            const value = errorData[key]
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`)
            } else if (typeof value === 'string') {
              errorMessages.push(`${key}: ${value}`)
            }
          })

          throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Неверный email или пароль')
        }

        // Если есть конкретное сообщение об ошибке
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          (typeof errorData === 'string' ? errorData : 'Неверный email или пароль')

        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при входе. Проверьте подключение к серверу.')
    }
  },

  /**
   * Выход пользователя
   * @returns {Promise}
   */
  logout: async () => {
    if (isDemoMode()) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('current_user')
        clearUserRoleCookie()
      }
      return
    }
    try {
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token')
        : null

      if (refreshToken) {
        try {
          await apiClient.post('/api/v1/users/logout/', {
            refresh: refreshToken,
          })
        } catch (logoutError) {
          // Если endpoint не существует, пробуем альтернативный вариант
          try {
            await apiClient.post('/users/logout/', {
              refresh: refreshToken,
            })
          } catch (altError) {
            console.warn('Не удалось выполнить logout на сервере:', altError)
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('current_user')
        clearUserRoleCookie()
      }
    }
  },

  /**
   * Получить текущего пользователя из localStorage
   * @returns {Object|null} Данные пользователя или null
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null
    const currentUser = getCurrentUser()
    if (currentUser) {
      return { data: currentUser }
    }
    // Fallback на старый формат для совместимости
    const userRaw = localStorage.getItem('user')
    return userRaw ? JSON.parse(userRaw) : null
  },

  /**
   * Проверить, авторизован ли пользователь
   * @returns {boolean}
   */
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('access_token')
  },

  /**
   * Получить профиль пользователя с backend
   * @returns {Promise} Данные профиля пользователя
   */
  getProfile: async () => {
    if (isDemoMode()) {
      ensureTokens()
      const current = getCurrentUser()
      if (current) {
        return { data: current }
      }
      throw new Error('Пользователь не авторизован')
    }
    try {
      const response = await apiClient.get('/api/v1/users/me/')
      // Обрабатываем структуру ответа (может быть data.data или просто data)
      const userData = response.data?.data || response.data
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('user', JSON.stringify(userData))
        const role = (userData?.data || userData)?.role
        if (role) setUserRoleCookie(role)
      }
      return response.data
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          'Ошибка при получении профиля'
        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при получении профиля. Проверьте подключение к серверу.')
    }
  },

  /**
   * Обновить профиль пользователя
   * @param {Object} profileData - Данные профиля для обновления
   * @returns {Promise} Обновленные данные профиля пользователя
   */
  updateProfile: async (profileData) => {
    if (isDemoMode()) {
      ensureTokens()
      const current = getCurrentUser()
      if (!current) {
        throw new Error('Пользователь не авторизован')
      }
      const merged = {
        ...current,
        ...profileData,
        profile: {
          ...(current.profile || {}),
          ...(profileData?.profile || {}),
        },
      }
      setCurrentUser(merged)
      return { data: merged }
    }
    try {
      const response = await apiClient.patch('/api/v1/users/me/', profileData)
      // Обрабатываем структуру ответа (может быть data.data или просто data)
      const userData = response.data?.data || response.data
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('user', JSON.stringify(userData))
        const role = (userData?.data || userData)?.role
        if (role) setUserRoleCookie(role)
      }
      return response.data
    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data

        // Если это объект с полями ошибок (Django style)
        if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
          // Собираем все сообщения об ошибках в одну строку
          const errorMessages = []

          Object.keys(errorData).forEach((key) => {
            const value = errorData[key]
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`)
            } else if (typeof value === 'string') {
              errorMessages.push(`${key}: ${value}`)
            }
          })

          throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Ошибка валидации данных')
        }

        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          'Ошибка при обновлении профиля'
        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при обновлении профиля. Проверьте подключение к серверу.')
    }
  },

  /**
   * Загрузить аватар пользователя
   * @param {File} file - Файл изображения для загрузки
   * @returns {Promise} Ответ от сервера
   */
  uploadAvatar: async (file) => {
    if (isDemoMode()) {
      if (typeof window === 'undefined') return { data: null }
      ensureTokens()
      const current = getCurrentUser()
      if (!current) {
        throw new Error('Пользователь не авторизован')
      }

      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
        reader.readAsDataURL(file)
      })

      const merged = {
        ...current,
        profile: {
          ...(current.profile || {}),
          avatar_url: dataUrl,
        },
      }
      setCurrentUser(merged)
      return { data: merged }
    }
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiClient.put('/api/v1/users/me/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Обновляем данные пользователя в localStorage
      if (typeof window !== 'undefined' && response.data) {
        // Обрабатываем структуру ответа (может быть data.data или просто data)
        const userData = response.data.data || response.data.user || response.data
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData))
        }
      }

      return response.data
    } catch (error) {
      // Обработка ошибок
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          'Ошибка при загрузке аватара'
        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при загрузке аватара. Проверьте подключение к серверу.')
    }
  },
}

// Сервис для работы с лидербордом
export const leaderboardService = {
  /**
   * Получить лидерборд пользователей
   * @param {Object} params - Параметры запроса
   * @param {number} params.page - Номер страницы (по умолчанию 1)
   * @param {number} params.page_size - Количество элементов на странице (максимум 50, по умолчанию 20)
   * @returns {Promise} Ответ от сервера с данными лидерборда
   */
  getLeaderboard: async ({ page = 1, page_size = 20 } = {}) => {
    if (isDemoMode()) {
      const total = 60
      const startIdx = (page - 1) * page_size
      const endIdx = Math.min(startIdx + page_size, total)

      const results = Array.from({ length: endIdx - startIdx }, (_, i) => {
        const rank = startIdx + i + 1
        return {
          rank: String(rank),
          id: rank,
          username: `user_${rank}`,
          first_name: rank % 3 === 0 ? 'Алиса' : rank % 3 === 1 ? 'Боб' : 'Чарли',
          last_name: `#${rank}`,
          total_points: Math.max(0, 10000 - rank * 97 + (rank % 7) * 31),
          avatar_url: null,
        }
      })

      return {
        count: total,
        next: endIdx < total ? `?page=${page + 1}` : null,
        previous: page > 1 ? `?page=${page - 1}` : null,
        results,
      }
    }
    try {
      // Ограничиваем page_size максимумом 50
      const validPageSize = Math.min(page_size, 50)

      const response = await apiClient.get('/api/v1/points/leaderboard/', {
        params: {
          page,
          page_size: validPageSize,
        },
      })

      return response.data
    } catch (error) {
      // Обработка ошибок
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          'Ошибка при получении лидерборда'
        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при получении лидерборда. Проверьте подключение к серверу.')
    }
  },
}

// Сервис для работы с приглашениями (студенты)
export const invitationsService = {
  /**
   * Получить список приглашений текущего пользователя
   * @param {Object} params - Параметры запроса
   * @param {number} params.page - Номер страницы
   * @returns {Promise} { count, next, previous, results }
   */
  getInvitations: async ({ page = 1 } = {}) => {
    try {
      const response = await apiClient.get('/api/v1/users/me/invitations/', {
        params: { page },
      })
      return response.data
    } catch (error) {
      if (error.response?.data) {
        const d = error.response.data
        const msg = d.message || d.error || d.detail || 'Ошибка при загрузке приглашений'
        throw new Error(msg)
      }
      throw new Error('Ошибка при загрузке приглашений. Проверьте подключение к серверу.')
    }
  },

  /**
   * Принять или отклонить приглашение
   * @param {number} id - ID приглашения
   * @param {'accept'|'decline'} action
   * @returns {Promise}
   */
  respond: async (id, action) => {
    try {
      await apiClient.post(`/api/v1/users/me/invitations/${id}/respond/`, { action })
    } catch (error) {
      if (error.response?.data) {
        const d = error.response.data
        const msg = d.message || d.error || d.detail || 'Ошибка при ответе на приглашение'
        throw new Error(msg)
      }
      throw new Error('Ошибка при ответе на приглашение. Проверьте подключение к серверу.')
    }
  },
}

// Сервис для работы со студентами
export const studentService = {
  /**
   * Получить профиль студента
   * @param {number|string} id - ID студента
   * @returns {Promise} Ответ от сервера с данными профиля студента
   */
  getStudentProfile: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/users/students/${id}/profile/`)

      // Обрабатываем структуру ответа (может быть data.data или просто data)
      return response.data
    } catch (error) {
      // Обработка ошибок
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          'Ошибка при получении профиля студента'
        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при получении профиля студента. Проверьте подключение к серверу.')
    }
  }
}

// Сервис для работы с классами
export const classesService = {
        /**
         * Получить список всех классов
         * @returns {Promise} Список классов
         */
        getClasses: async () => {
          try {
            const response = await apiClient.get('/api/v1/classes/')
            const responseData = response.data

            console.log('Ответ от сервера при получении классов:', responseData)

            // Обрабатываем формат пагинации Django REST Framework
            // Формат: { count: number, next: string, previous: string, results: [...] }
            if (responseData && typeof responseData === 'object' && 'results' in responseData) {
              const results = Array.isArray(responseData.results) ? responseData.results : []
              return {
                classes: results,
                count: responseData.count || results.length,
                next: responseData.next || null,
                previous: responseData.previous || null,
              }
            }

            // Обрабатываем формат { success: true, data: [...] }
            if (responseData?.success && responseData?.data) {
              if (Array.isArray(responseData.data)) {
                return {
                  classes: responseData.data,
                  count: responseData.data.length,
                  next: null,
                  previous: null,
                }
              }
              return {
                classes: [responseData.data],
                count: 1,
                next: null,
                previous: null,
              }
            }

            // Если ответ - массив напрямую
            if (Array.isArray(responseData)) {
              return {
                classes: responseData,
                count: responseData.length,
                next: null,
                previous: null,
              }
            }

            // Если ответ - объект с data
            if (responseData?.data) {
              const data = Array.isArray(responseData.data) ? responseData.data : [responseData.data]
              return {
                classes: data,
                count: data.length,
                next: null,
                previous: null,
              }
            }

            // Возвращаем пустой массив по умолчанию
            console.warn('Неожиданный формат ответа от сервера:', responseData)
            return {
              classes: [],
              count: 0,
              next: null,
              previous: null,
            }
          } catch (error) {
            console.error('Ошибка при получении классов:', error)
            console.error('Детали ошибки:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message,
              contentType: error.response?.headers?.['content-type'],
            })

            // Если сервер возвращает 500 при GET запросе, возможно это из-за пустого списка
            // Сервер может возвращать HTML страницу с ошибкой вместо JSON
            if (error.response?.status === 500 && error.config?.method === 'get') {
              const contentType = error.response?.headers?.['content-type'] || ''
              const isHtmlResponse = contentType.includes('text/html') ||
                (typeof error.response?.data === 'string' && error.response.data.includes('<!doctype html>'))

              if (isHtmlResponse) {
                console.warn('Сервер вернул HTML страницу с ошибкой 500 при получении списка классов. Возможно список пуст или сервер недоступен. Возвращаем пустой массив.')
              } else {
                console.warn('Сервер вернул 500 при получении списка классов, возможно список пуст. Возвращаем пустой массив.')
              }

              return {
                classes: [],
                count: 0,
                next: null,
                previous: null,
              }
            }

            if (error.response?.data) {
              const errorData = error.response.data

              // Если это объект с полями ошибок (Django style)
              if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
                const errorMessages = []

                Object.keys(errorData).forEach((key) => {
                  const value = errorData[key]
                  if (Array.isArray(value)) {
                    errorMessages.push(`${key}: ${value.join(', ')}`)
                  } else if (typeof value === 'string') {
                    errorMessages.push(`${key}: ${value}`)
                  }
                })

                const errorMessage = errorMessages.length > 0
                  ? errorMessages.join('. ')
                  : 'Ошибка при получении списка классов'
                throw new Error(errorMessage)
              }

              const errorMessage = errorData.message ||
                errorData.error ||
                errorData.detail ||
                `Ошибка при получении списка классов (${error.response?.status || 'неизвестный статус'})`
              throw new Error(errorMessage)
            }

            // Если нет ответа от сервера (сетевая ошибка)
            if (error.request) {
              throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету.')
            }

            throw new Error(error.message || 'Ошибка при получении списка классов. Проверьте подключение к серверу.')
          }
        },

        /**
         * Получить данные конкретного класса по ID
         * @param {number|string} classId - ID класса
         * @returns {Promise} Данные класса
         */
        getClassById: async (classId) => {
          try {
            const response = await apiClient.get(`/api/v1/classes/${classId}/`)
            const responseData = response.data

            console.log('Ответ от сервера при получении класса:', responseData)

            // Обрабатываем разные форматы ответа
            // Если ответ в формате { success: true, data: {...} }
            if (responseData?.success && responseData?.data) {
              return responseData.data
            }

            // Если ответ - объект класса напрямую
            if (responseData?.id) {
              return responseData
            }

            // Возвращаем как есть
            return responseData
          } catch (error) {
            console.error('Ошибка при получении класса:', error)
            console.error('Детали ошибки:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message,
            })

            if (error.response?.data) {
              const errorData = error.response.data

              // Если это объект с полями ошибок (Django style)
              if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
                const errorMessages = []

                Object.keys(errorData).forEach((key) => {
                  const value = errorData[key]
                  if (Array.isArray(value)) {
                    errorMessages.push(`${key}: ${value.join(', ')}`)
                  } else if (typeof value === 'string') {
                    errorMessages.push(`${key}: ${value}`)
                  }
                })

                throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Ошибка при получении класса')
              }

              const errorMessage = errorData.message ||
                errorData.error ||
                errorData.detail ||
                `Ошибка при получении класса (${error.response?.status || 'неизвестный статус'})`
              throw new Error(errorMessage)
            }

            // Если нет ответа от сервера (сетевая ошибка)
            if (error.request) {
              throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету.')
            }

            throw new Error(error.message || 'Ошибка при получении класса. Проверьте подключение к серверу.')
          }
        },

        /**
         * Получить участников класса
         * @param {number|string} classId - ID класса
         * @returns {Promise} Список участников класса
         */
        getClassMembers: async (classId) => {
          try {
            const response = await apiClient.get(`/api/v1/classes/${classId}/members`)
            const responseData = response.data

            console.log('Ответ от сервера при получении участников класса:', responseData)

            // Обрабатываем разные форматы ответа
            // Если ответ в формате { success: true, data: [...] }
            if (responseData?.success && responseData?.data) {
              return Array.isArray(responseData.data) ? responseData.data : [responseData.data]
            }

            // Если ответ в формате пагинации { count, next, previous, results: [...] }
            if (responseData?.results && Array.isArray(responseData.results)) {
              return responseData.results
            }

            // Если ответ - массив напрямую
            if (Array.isArray(responseData)) {
              return responseData
            }

            // Если ответ - объект с data
            if (responseData?.data && Array.isArray(responseData.data)) {
              return responseData.data
            }

            // Возвращаем пустой массив по умолчанию
            return []
          } catch (error) {
            console.error('Ошибка при получении участников класса:', error)
            console.error('Детали ошибки:', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message,
            })

            if (error.response?.data) {
              const errorData = error.response.data

              // Если это объект с полями ошибок (Django style)
              if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
                const errorMessages = []

                Object.keys(errorData).forEach((key) => {
                  const value = errorData[key]
                  if (Array.isArray(value)) {
                    errorMessages.push(`${key}: ${value.join(', ')}`)
                  } else if (typeof value === 'string') {
                    errorMessages.push(`${key}: ${value}`)
                  }
                })

                throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Ошибка при получении участников класса')
              }

              const errorMessage = errorData.message ||
                errorData.error ||
                errorData.detail ||
                `Ошибка при получении участников класса (${error.response?.status || 'неизвестный статус'})`
              throw new Error(errorMessage)
            }

            // Если нет ответа от сервера (сетевая ошибка)
            if (error.request) {
              throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету.')
            }

            throw new Error(error.message || 'Ошибка при получении участников класса. Проверьте подключение к серверу.')
          }
        },

        /**
         * Создать новый класс
         * @param {Object} classData - Данные класса (name, description, max_students, is_active)
         * @returns {Promise} Созданный класс
         */
        createClass: async (classData) => {
          try {
            const response = await apiClient.post('/api/v1/classes/', classData)
            const responseData = response.data

            // Обрабатываем разные форматы ответа
            // Если ответ в формате { success: true, data: {...} }
            if (responseData?.success && responseData?.data) {
              return responseData.data
            }

            // Если ответ - объект класса напрямую
            if (responseData?.id) {
              return responseData
            }

            // Возвращаем как есть
            return responseData
          } catch (error) {
            if (error.response?.data) {
              const errorData = error.response.data

              // Если это объект с полями ошибок (Django style)
              if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
                const errorMessages = []

                Object.keys(errorData).forEach((key) => {
                  const value = errorData[key]
                  if (Array.isArray(value)) {
                    errorMessages.push(`${key}: ${value.join(', ')}`)
                  } else if (typeof value === 'string') {
                    errorMessages.push(`${key}: ${value}`)
                  }
                })

                throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Ошибка валидации данных')
              }

              const errorMessage = errorData.message ||
                errorData.error ||
                errorData.detail ||
                'Ошибка при создании класса'
              throw new Error(errorMessage)
            }
            throw new Error('Ошибка при создании класса. Проверьте подключение к серверу.')
          }
        },

        /**
         * Поиск пользователей по email
         * @param {string} email - Email пользователя для поиска
         * @returns {Promise} Данные найденного пользователя
         */
        searchUsersByEmail: async (email) => {
          try {
            // Отправляем запрос с q как query parameter (текст для поиска)
            const response = await apiClient.get('/api/v1/users/search/', {
              params: { q: email }
            })

            const responseData = response.data

            // Обрабатываем разные форматы ответа
            // Если это массив результатов
            if (Array.isArray(responseData)) {
              const user = responseData.find(u => u.email === email) || responseData[0]
              if (!user) {
                throw new Error('Пользователь не найден')
              }
              return user
            }

            // Если это объект с results (пагинация)
            if (responseData?.results && Array.isArray(responseData.results)) {
              const user = responseData.results.find(u => u.email === email) || responseData.results[0]
              if (!user) {
                throw new Error('Пользователь не найден')
              }
              return user
            }

            // Если ответ в формате { success: true, data: [...] } - массив пользователей
            if (responseData?.success && responseData?.data) {
              if (Array.isArray(responseData.data)) {
                // Если data - массив, берем первый элемент
                if (responseData.data.length === 0) {
                  throw new Error('Пользователь не найден')
                }
                return responseData.data[0]
              }
              // Если data - объект, возвращаем его
              return responseData.data
            }

            // Если ответ - объект пользователя напрямую
            if (responseData?.id || responseData?.email) {
              return responseData
            }

            throw new Error('Пользователь не найден')
          } catch (error) {
            if (error.response?.data) {
              const errorData = error.response.data
              const errorMessage = errorData.message ||
                errorData.error ||
                errorData.detail ||
                'Пользователь не найден'
              throw new Error(errorMessage)
            }
            throw new Error(error.message || 'Ошибка при поиске пользователя. Проверьте подключение к серверу.')
          }
        },

        /**
         * Отправить приглашение пользователю в класс
         * @param {number|string} classId - ID класса
         * @param {number|string} userId - ID пользователя
         * @returns {Promise} Ответ от сервера
         */
        inviteUserToClass: async (classId, userId) => {
          try {
            console.log('Отправка приглашения:', { classId, userId, body: { user_id: userId } })
            const response = await apiClient.post(`/api/v1/classes/${classId}/invite/`, {
              user_id: userId
            })
            const responseData = response.data

            console.log('Ответ от сервера при приглашении:', responseData)

            // Обрабатываем разные форматы ответа
            if (responseData?.success && responseData?.data) {
              return responseData.data
            }

            return responseData
          } catch (error) {
            console.error('Ошибка при отправке приглашения:', error)
            console.error('Детали ошибки:', {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message
            })

            if (error.response?.data) {
              const errorData = error.response.data

              // Если это объект с полями ошибок (Django style)
              if (typeof errorData === 'object' && !errorData.message && !errorData.error && !errorData.detail) {
                const errorMessages = []

                Object.keys(errorData).forEach((key) => {
                  const value = errorData[key]
                  if (Array.isArray(value)) {
                    errorMessages.push(`${key}: ${value.join(', ')}`)
                  } else if (typeof value === 'string') {
                    errorMessages.push(`${key}: ${value}`)
                  }
                })

                throw new Error(errorMessages.length > 0 ? errorMessages.join('. ') : 'Ошибка при отправке приглашения')
              }

              // Обрабатываем формат { success: false, error: { message: ... } }
              if (errorData?.error?.message) {
                throw new Error(errorData.error.message)
              }

              const errorMessage = errorData.message ||
                errorData.error ||
                errorData.detail ||
                'Ошибка при отправке приглашения'
              throw new Error(errorMessage)
            }
            throw new Error('Ошибка при отправке приглашения. Проверьте подключение к серверу.')
          }
        },
      }

// Сервис для работы с speaking (транскрибация аудио)
export const speakingService = {
  /**
   * Отправить аудио файл на транскрибацию
   * @param {File|Blob} audioFile - Аудио файл для транскрибации
   * @returns {Promise<Object>} Ответ от сервера с транскрибированным текстом
   */
  transcribe: async (audioFile) => {
    try {
      const formData = new FormData()
      formData.append('file', audioFile)

      const response = await apiClient.post('/api/v1/ai/speaking/transcribe/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Обрабатываем структуру ответа
      const responseData = response.data
      
      // Если ответ в формате { success: true, data: { text: "..." } }
      if (responseData?.success && responseData?.data) {
        return responseData.data
      }

      // Если ответ - объект с text напрямую
      if (responseData?.text) {
        return { text: responseData.text }
      }

      // Возвращаем как есть
      return responseData
    } catch (error) {
      // Обработка ошибок
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message ||
          errorData.error ||
          errorData.detail ||
          'Ошибка при транскрибации аудио'
        throw new Error(errorMessage)
      }
      throw new Error('Ошибка при транскрибации аудио. Проверьте подключение к серверу.')
    }
  },
}

export default apiClient