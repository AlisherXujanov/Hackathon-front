/**
 * AI Service
 * 
 * Handles API communication with the backend AI chat endpoint.
 * Includes JWT token management, error handling, and automatic token refresh.
 */

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If we get a 401 and haven't retried yet, try to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${access}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh token also expired or invalid
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        // Optionally redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Sends an AI chat request to the backend
 * 
 * @param {Object} payload - The request payload
 * @param {string} payload.subject_name - Name of the subject (e.g., "English Grammar")
 * @param {string} payload.topic_name - Name of the topic (e.g., "Present Perfect")
 * @param {string} payload.category - Category type (e.g., "grammar", "reading", "writing")
 * @param {string} [payload.description] - Optional description for backend context
 * @param {string} payload.user_prompt - The user's question or prompt
 * 
 * @returns {Promise<Object>} The AI response
 * @throws {Error} If the request fails
 * 
 * @example
 * ```javascript
 * const response = await sendAIChatRequest({
 *   subject_name: "English Grammar",
 *   topic_name: "Present Perfect",
 *   category: "grammar",
 *   description: "Grammar practice interface",
 *   user_prompt: "Can you explain when to use present perfect?"
 * })
 * ```
 */
export const sendAIChatRequest = async (payload) => {
  try {
    const response = await apiClient.post('/ai/chat', payload)
    return response.data
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid request. Please check your input.'
        )
      } else if (status === 401) {
        throw new Error('Authentication required. Please log in.')
      } else if (status === 403) {
        throw new Error('You do not have permission to use this feature.')
      } else if (status === 429) {
        throw new Error('Too many requests. Please try again later.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(
          data?.error?.message || `Request failed with status ${status}`
        )
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        'Network error. Please check your connection and try again.'
      )
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

export default apiClient
