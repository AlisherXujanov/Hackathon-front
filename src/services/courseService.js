import apiClient from './api'

/**
 * Course Service
 * Handles all course-related API calls
 */
export const courseService = {
  /**
   * Get all courses
   * @param {Object} filters - Filter options (category, level, price, etc.)
   * @returns {Promise} List of courses
   */
  getCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.level) params.append('level', filters.level)
      if (filters.price_min) params.append('price_min', filters.price_min)
      if (filters.price_max) params.append('price_max', filters.price_max)
      if (filters.search) params.append('search', filters.search)
      if (filters.rating) params.append('rating', filters.rating)
      
      const response = await apiClient.get(`/api/v1/courses/?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    }
  },

  /**
   * Get course by ID
   * @param {string|number} courseId - Course ID
   * @returns {Promise} Course details
   */
  getCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/v1/courses/${courseId}/`)
      return response.data
    } catch (error) {
      console.error('Error fetching course:', error)
      throw error
    }
  },

  /**
   * Enroll in a course
   * @param {string|number} courseId - Course ID
   * @returns {Promise} Enrollment data
   */
  enrollCourse: async (courseId) => {
    try {
      const response = await apiClient.post(`/api/v1/courses/${courseId}/enroll/`)
      return response.data
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw error
    }
  },

  /**
   * Get user's enrolled courses
   * @returns {Promise} List of enrolled courses
   */
  getEnrolledCourses: async () => {
    try {
      const response = await apiClient.get('/api/v1/courses/my-courses/')
      return response.data
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
      throw error
    }
  },

  /**
   * Get course progress
   * @param {string|number} courseId - Course ID
   * @returns {Promise} Course progress data
   */
  getCourseProgress: async (courseId) => {
    try {
      const response = await apiClient.get(`/api/v1/courses/${courseId}/progress/`)
      return response.data
    } catch (error) {
      console.error('Error fetching course progress:', error)
      throw error
    }
  },

  /**
   * Update lesson completion
   * @param {string|number} courseId - Course ID
   * @param {string|number} lessonId - Lesson ID
   * @param {Object} data - Completion data
   * @returns {Promise} Updated progress
   */
  completeLesson: async (courseId, lessonId, data = {}) => {
    try {
      const response = await apiClient.post(
        `/api/v1/courses/${courseId}/lessons/${lessonId}/complete/`,
        data
      )
      return response.data
    } catch (error) {
      console.error('Error completing lesson:', error)
      throw error
    }
  },

  /**
   * Purchase a course
   * @param {string|number} courseId - Course ID
   * @returns {Promise} Purchase data
   */
  purchaseCourse: async (courseId) => {
    try {
      const response = await apiClient.post(`/api/v1/courses/${courseId}/purchase/`)
      return response.data
    } catch (error) {
      console.error('Error purchasing course:', error)
      throw error
    }
  },

  /**
   * Get learning paths
   * @returns {Promise} List of learning paths
   */
  getLearningPaths: async () => {
    try {
      const response = await apiClient.get('/api/v1/learning-paths/')
      return response.data
    } catch (error) {
      console.error('Error fetching learning paths:', error)
      throw error
    }
  },

  /**
   * Get learning path by ID
   * @param {string|number} pathId - Learning path ID
   * @returns {Promise} Learning path details
   */
  getLearningPath: async (pathId) => {
    try {
      const response = await apiClient.get(`/api/v1/learning-paths/${pathId}/`)
      return response.data
    } catch (error) {
      console.error('Error fetching learning path:', error)
      throw error
    }
  },

  /**
   * Submit assessment
   * @param {string|number} courseId - Course ID
   * @param {string|number} assessmentId - Assessment ID
   * @param {Object} answers - Assessment answers
   * @returns {Promise} Assessment results
   */
  submitAssessment: async (courseId, assessmentId, answers) => {
    try {
      const response = await apiClient.post(
        `/api/v1/courses/${courseId}/assessments/${assessmentId}/submit/`,
        { answers }
      )
      return response.data
    } catch (error) {
      console.error('Error submitting assessment:', error)
      throw error
    }
  },
}

export default courseService
