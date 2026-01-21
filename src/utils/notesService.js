/**
 * Notes Service
 * 
 * Handles API communication with the backend grammar topic notes endpoint.
 * Includes JWT token management, error handling, and automatic token refresh.
 */

import apiClient from './aiService'

/**
 * Get all notes for a grammar topic
 * 
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @returns {Promise<Array>} Array of note objects
 * @throws {Error} If the request fails
 */
export const getNotes = async (topicId) => {
  try {
    const response = await apiClient.get(`/english/grammar/topics/${topicId}/notes/`)
    return response.data?.data || response.data || []
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid request. Please check your input.'
        )
      } else if (status === 401) {
        throw new Error('Authentication required. Please log in.')
      } else if (status === 403) {
        throw new Error('You do not have permission to view notes.')
      } else if (status === 404) {
        throw new Error('Topic not found.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(
          data?.error?.message || `Request failed with status ${status}`
        )
      }
    } else if (error.request) {
      throw new Error(
        'Network error. Please check your connection and try again.'
      )
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
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
 * @returns {Promise<Object>} Created note object
 * @throws {Error} If the request fails
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
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid note data. Please check your input.'
        )
      } else if (status === 401) {
        throw new Error('Authentication required. Please log in.')
      } else if (status === 403) {
        throw new Error('You do not have permission to create notes.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(
          data?.error?.message || `Request failed with status ${status}`
        )
      }
    } else if (error.request) {
      throw new Error(
        'Network error. Please check your connection and try again.'
      )
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
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
 * @returns {Promise<Object>} Updated note object
 * @throws {Error} If the request fails
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
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 400) {
        throw new Error(
          data?.error?.message || 'Invalid note data. Please check your input.'
        )
      } else if (status === 401) {
        throw new Error('Authentication required. Please log in.')
      } else if (status === 403) {
        throw new Error('You do not have permission to update this note.')
      } else if (status === 404) {
        throw new Error('Note not found.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(
          data?.error?.message || `Request failed with status ${status}`
        )
      }
    } else if (error.request) {
      throw new Error(
        'Network error. Please check your connection and try again.'
      )
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

/**
 * Delete a note
 * 
 * @param {string} topicId - Topic ID (e.g., "A1_001")
 * @param {number} noteId - Note ID
 * @returns {Promise<void>}
 * @throws {Error} If the request fails
 */
export const deleteNote = async (topicId, noteId) => {
  try {
    await apiClient.delete(`/english/grammar/topics/${topicId}/notes/${noteId}/`)
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        throw new Error('Authentication required. Please log in.')
      } else if (status === 403) {
        throw new Error('You do not have permission to delete this note.')
      } else if (status === 404) {
        throw new Error('Note not found.')
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(
          data?.error?.message || `Request failed with status ${status}`
        )
      }
    } else if (error.request) {
      throw new Error(
        'Network error. Please check your connection and try again.'
      )
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}
