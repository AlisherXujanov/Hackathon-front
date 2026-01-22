import axios from 'axios'

// Базовый URL API из переменных окружения или значение по умолчанию
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crucially-innate-chimp.cloudpub.ru'

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
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Сервис для работы с аутентификацией
export const authService = {
  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя (username, email, password)
   * @returns {Promise} Ответ от сервера
   */
  register: async (userData) => {
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
    try {
      const response = await apiClient.post('/api/v1/users/login/', credentials)
      const { access, refresh, user } = response.data

      // Сохраняем токены в localStorage
      if (typeof window !== 'undefined') {
        if (access) localStorage.setItem('access_token', access)
        if (refresh) localStorage.setItem('refresh_token', refresh)
        
        // Если данные пользователя не пришли в ответе, получаем их из /api/v1/users/me/
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        } else if (access) {
          try {
            const userResponse = await apiClient.get('/api/v1/users/me/')
            const userData = userResponse.data
            localStorage.setItem('user', JSON.stringify(userData))
          } catch (meError) {
            console.warn('Не удалось получить данные пользователя из /api/v1/users/me/', meError)
          }
        }
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
      // Очищаем localStorage независимо от результата запроса
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
  },

  /**
   * Получить текущего пользователя из localStorage
   * @returns {Object|null} Данные пользователя или null
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null
    
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
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
    try {
      const response = await apiClient.get('/api/v1/users/me/')
      // Обрабатываем структуру ответа (может быть data.data или просто data)
      const userData = response.data?.data || response.data
      // Обновляем данные пользователя в localStorage
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      }
      return response.data
    } catch (error) {
      // Обработка ошибок
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
    try {
      const response = await apiClient.patch('/api/v1/users/me/', profileData)
      // Обрабатываем структуру ответа (может быть data.data или просто data)
      const userData = response.data?.data || response.data
      // Обновляем данные пользователя в localStorage
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      }
      return response.data
    } catch (error) {
      // Обработка ошибок
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
  },
}

export default apiClient