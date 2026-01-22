import apiClient from './api'
import { isDemoMode } from './api'
import { sampleCourses, learningPaths, getCourseById } from '../store/courses/courseData'

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
    if (isDemoMode()) {
      // Для демо-режима возвращаем локальные курсы, фильтрацию оставляем на уровне UI
      return { data: sampleCourses }
    }
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
    if (isDemoMode()) {
      const course = getCourseById(courseId)
      if (!course) throw new Error('Course not found')
      return { data: course }
    }
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
    if (isDemoMode()) {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('demo_enrolled_courses')
        const list = raw ? JSON.parse(raw) : []
        const id = String(courseId)
        if (!list.includes(id)) list.push(id)
        localStorage.setItem('demo_enrolled_courses', JSON.stringify(list))
      }
      return { data: { success: true, courseId } }
    }
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
    if (isDemoMode()) {
      if (typeof window === 'undefined') return { data: [] }
      const raw = localStorage.getItem('demo_enrolled_courses')
      const list = raw ? JSON.parse(raw) : []
      const enrolled = list.map((id) => getCourseById(id)).filter(Boolean)
      return { data: enrolled }
    }
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
    if (isDemoMode()) {
      if (typeof window === 'undefined') throw new Error('Not enrolled')
      const raw = localStorage.getItem('demo_enrolled_courses')
      const list = raw ? JSON.parse(raw) : []
      const id = String(courseId)
      const progressRaw = localStorage.getItem(`demo_course_progress_${id}`)
      if (!list.includes(id) && !progressRaw) {
        const err = new Error('Not enrolled')
        err.status = 404
        throw err
      }
      const progress = progressRaw
        ? JSON.parse(progressRaw)
        : { progress: 12, completedLessons: [] }
      // Нормализуем формат
      if (!Array.isArray(progress.completedLessons)) progress.completedLessons = []
      if (typeof progress.progress !== 'number') progress.progress = 0
      return { data: progress }
    }
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
    if (isDemoMode()) {
      if (typeof window !== 'undefined') {
        const id = String(courseId)
        // Авто-запись на курс в демо при первом завершении урока
        try {
          const enrolledRaw = localStorage.getItem('demo_enrolled_courses')
          const enrolled = enrolledRaw ? JSON.parse(enrolledRaw) : []
          const nextEnrolled = Array.isArray(enrolled) ? enrolled : []
          if (!nextEnrolled.includes(id)) {
            nextEnrolled.push(id)
            localStorage.setItem('demo_enrolled_courses', JSON.stringify(nextEnrolled))
          }
        } catch {
          // ignore
        }

        const currentRaw = localStorage.getItem(`demo_course_progress_${id}`)
        const current = currentRaw ? JSON.parse(currentRaw) : { progress: 0, completedLessons: [] }
        const completedLessons = Array.isArray(current.completedLessons) ? [...current.completedLessons] : []
        if (!completedLessons.includes(lessonId)) completedLessons.push(lessonId)

        const progress = Math.min(100, (current.progress || 0) + 7)
        const next = { ...current, ...data, progress, completedLessons, lastCompletedLessonId: lessonId }
        localStorage.setItem(`demo_course_progress_${id}`, JSON.stringify(next))
        return { data: next }
      }
      return { data: { progress: 0, completedLessons: [] } }
    }
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
    if (isDemoMode()) {
      // В демо-режиме покупка == запись на курс
      return await courseService.enrollCourse(courseId)
    }
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
    if (isDemoMode()) {
      return { data: learningPaths }
    }
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
    if (isDemoMode()) {
      const path = learningPaths.find((p) => p.id === parseInt(pathId))
      if (!path) throw new Error('Learning path not found')
      return { data: path }
    }
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
    if (isDemoMode()) {
      return {
        data: {
          courseId,
          assessmentId,
          score: 86,
          passed: true,
          feedback: 'Демо-результат: отличный прогресс. Продолжайте в том же духе!',
          answers,
        },
      }
    }
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
