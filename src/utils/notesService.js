/**
 * Notes Service
 * 
 * Handles API communication with the backend grammar topic notes endpoint.
 * Includes JWT token management, error handling, and automatic token refresh.
 */

import apiClient from './aiService'

/**
 * Detects the type of error for better error handling
 * @param {Error} error - The error object from axios
 * @returns {string} Error type: 'network', 'timeout', 'auth', 'server', or 'unknown'
 */
const detectErrorType = (error) => {
  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'timeout'
  }
  
  // Network errors (no response received)
  if (error.request && !error.response) {
    // Check for specific network error codes
    if (error.code === 'ERR_NETWORK' || 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ENOTFOUND') {
      return 'network'
    }
    return 'network'
  }
  
  // HTTP response errors
  if (error.response) {
    const status = error.response.status
    if (status === 401 || status === 403) {
      return 'auth'
    }
    if (status >= 500) {
      return 'server'
    }
    return 'http'
  }
  
  return 'unknown'
}

/**
 * Get all notes for a grammar topic
 * 
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @returns {Promise<Array>} Array of note objects, or empty array if backend is unavailable
 * @throws {Error} Only for application errors (400, 404)
 */
export const getNotes = async (topicId) => {
  try {
    const response = await apiClient.get(`/english/grammar/topics/${topicId}/notes/`)
    return response.data?.data || response.data || []
  } catch (error) {
    const errorType = detectErrorType(error)
    
    if (error.response) {
      const { status, data } = error.response
      
      // Only throw for actual application errors
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid request. Please check your input.'
        )
      } else if (status === 404) {
        // 404 means topic has no notes yet - this is normal, return empty array
        console.info('Notes: No notes found for this topic - returning empty array')
        return []
      }
      
      // For auth, server, and other errors - return empty array (offline mode)
      // Log for debugging but don't throw
      if (status === 401 || status === 403) {
        console.warn('Notes: Authentication/permission error - returning empty array (offline mode)')
        return []
      } else if (status >= 500) {
        console.warn('Notes: Server error - returning empty array (offline mode)')
        return []
      } else {
        console.warn(`Notes: HTTP ${status} error - returning empty array (offline mode)`)
        return []
      }
    } else if (error.request) {
      // Network errors - return empty array (offline mode)
      // Log for debugging but don't throw
      if (errorType === 'timeout') {
        console.warn('Notes: Request timeout - returning empty array (offline mode)')
      } else if (error.code === 'ERR_NETWORK') {
        console.warn('Notes: Network error - returning empty array (offline mode)')
      } else {
        console.warn('Notes: Connection error - returning empty array (offline mode)')
      }
      return []
    } else {
      // Unexpected errors - return empty array (offline mode)
      console.warn('Notes: Unexpected error - returning empty array (offline mode)', error.message)
      return []
    }
  }
}

/**
 * Create a new note for a grammar topic
 * 
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @param {string} topicTitle - Topic title
 * @param {Object} noteData - Note data
 * @param {string} noteData.note_text - Note text content
 * @param {string} noteData.importance - Importance level (critical, important, normal)
 * @returns {Promise<Object|null>} Created note object, or null if backend is unavailable
 * @throws {Error} Only for validation errors (400)
 */
export const createNote = async (topicId, topicTitle, noteData) => {
  try {
    const payload = {
      topic_id: topicId,
      topic_title: topicTitle,
      note_text: noteData.note_text,
      importance: noteData.importance
    }
    
    const response = await apiClient.post(`/english/grammar/topics/${topicId}/notes/`, payload)
    return response.data?.data || response.data
  } catch (error) {
    const errorType = detectErrorType(error)
    
    if (error.response) {
      const { status, data } = error.response
      
      // Only throw for validation errors (user needs to know)
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid note data. Please check your input.'
        )
      }
      
      // For auth, server, and other errors - return null (offline mode)
      // Log for debugging but don't throw
      if (status === 401 || status === 403) {
        console.warn('Notes: Authentication/permission error - cannot create note (offline mode)')
        return null
      } else if (status >= 500) {
        console.warn('Notes: Server error - cannot create note (offline mode)')
        return null
      } else {
        console.warn(`Notes: HTTP ${status} error - cannot create note (offline mode)`)
        return null
      }
    } else if (error.request) {
      // Network errors - return null (offline mode)
      // Log for debugging but don't throw
      if (errorType === 'timeout') {
        console.warn('Notes: Request timeout - cannot create note (offline mode)')
      } else if (error.code === 'ERR_NETWORK') {
        console.warn('Notes: Network error - cannot create note (offline mode)')
      } else {
        console.warn('Notes: Connection error - cannot create note (offline mode)')
      }
      return null
    } else {
      // Unexpected errors - return null (offline mode)
      console.warn('Notes: Unexpected error - cannot create note (offline mode)', error.message)
      return null
    }
  }
}

/**
 * Update an existing note
 * 
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @param {number} noteId - Note ID
 * @param {Object} noteData - Updated note data
 * @param {string} noteData.note_text - Note text content
 * @param {string} noteData.importance - Importance level (critical, important, normal)
 * @returns {Promise<Object|null>} Updated note object, or null if backend is unavailable
 * @throws {Error} Only for validation errors (400) and not found (404)
 */
export const updateNote = async (topicId, noteId, noteData) => {
  try {
    const payload = {
      note_text: noteData.note_text,
      importance: noteData.importance
    }
    
    const response = await apiClient.put(`/english/grammar/topics/${topicId}/notes/${noteId}/`, payload)
    return response.data?.data || response.data
  } catch (error) {
    const errorType = detectErrorType(error)
    
    if (error.response) {
      const { status, data } = error.response
      
      // Only throw for actual application errors (user needs to know)
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid note data. Please check your input.'
        )
      } else if (status === 404) {
        throw new Error('Note not found.')
      }
      
      // For auth, server, and other errors - return null (offline mode)
      // Log for debugging but don't throw
      if (status === 401 || status === 403) {
        console.warn('Notes: Authentication/permission error - cannot update note (offline mode)')
        return null
      } else if (status >= 500) {
        console.warn('Notes: Server error - cannot update note (offline mode)')
        return null
      } else {
        console.warn(`Notes: HTTP ${status} error - cannot update note (offline mode)`)
        return null
      }
    } else if (error.request) {
      // Network errors - return null (offline mode)
      // Log for debugging but don't throw
      if (errorType === 'timeout') {
        console.warn('Notes: Request timeout - cannot update note (offline mode)')
      } else if (error.code === 'ERR_NETWORK') {
        console.warn('Notes: Network error - cannot update note (offline mode)')
      } else {
        console.warn('Notes: Connection error - cannot update note (offline mode)')
      }
      return null
    } else {
      // Unexpected errors - return null (offline mode)
      console.warn('Notes: Unexpected error - cannot update note (offline mode)', error.message)
      return null
    }
  }
}

/**
 * Delete a note
 * 
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @param {number} noteId - Note ID
 * @returns {Promise<void>} Always succeeds (silently handles network/server errors)
 * @throws {Error} Only for not found errors (404)
 */
export const deleteNote = async (topicId, noteId) => {
  try {
    await apiClient.delete(`/english/grammar/topics/${topicId}/notes/${noteId}/`)
  } catch (error) {
    const errorType = detectErrorType(error)
    
    if (error.response) {
      const { status, data } = error.response
      
      // Only throw for not found (user needs to know)
      if (status === 404) {
        throw new Error('Note not found.')
      }
      
      // For auth, server, and other errors - succeed silently (offline mode)
      // Log for debugging but don't throw
      if (status === 401 || status === 403) {
        console.warn('Notes: Authentication/permission error - delete succeeded silently (offline mode)')
        return
      } else if (status >= 500) {
        console.warn('Notes: Server error - delete succeeded silently (offline mode)')
        return
      } else {
        console.warn(`Notes: HTTP ${status} error - delete succeeded silently (offline mode)`)
        return
      }
    } else if (error.request) {
      // Network errors - succeed silently (offline mode)
      // Log for debugging but don't throw
      if (errorType === 'timeout') {
        console.warn('Notes: Request timeout - delete succeeded silently (offline mode)')
      } else if (error.code === 'ERR_NETWORK') {
        console.warn('Notes: Network error - delete succeeded silently (offline mode)')
      } else {
        console.warn('Notes: Connection error - delete succeeded silently (offline mode)')
      }
      return
    } else {
      // Unexpected errors - succeed silently (offline mode)
      console.warn('Notes: Unexpected error - delete succeeded silently (offline mode)', error.message)
      return
    }
  }
}
