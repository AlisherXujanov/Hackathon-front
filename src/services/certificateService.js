import apiClient from './api'

/**
 * Certificate Service
 * Handles all certificate-related API calls
 */
export const certificateService = {
  /**
   * Get user's certificates
   * @returns {Promise} List of certificates
   */
  getCertificates: async () => {
    try {
      const response = await apiClient.get('/api/v1/certificates/')
      return response.data
    } catch (error) {
      console.error('Error fetching certificates:', error)
      throw error
    }
  },

  /**
   * Get certificate by ID
   * @param {string|number} certificateId - Certificate ID
   * @returns {Promise} Certificate details
   */
  getCertificate: async (certificateId) => {
    try {
      const response = await apiClient.get(`/api/v1/certificates/${certificateId}/`)
      return response.data
    } catch (error) {
      console.error('Error fetching certificate:', error)
      throw error
    }
  },

  /**
   * Download certificate as PDF
   * @param {string|number} certificateId - Certificate ID
   * @returns {Promise} PDF blob
   */
  downloadCertificate: async (certificateId) => {
    try {
      const response = await apiClient.get(
        `/api/v1/certificates/${certificateId}/download/`,
        { responseType: 'blob' }
      )
      return response.data
    } catch (error) {
      console.error('Error downloading certificate:', error)
      throw error
    }
  },

  /**
   * Request verified certificate
   * @param {string|number} courseId - Course ID
   * @returns {Promise} Certificate request data
   */
  requestVerifiedCertificate: async (courseId) => {
    try {
      const response = await apiClient.post(`/api/v1/certificates/request-verified/`, {
        course_id: courseId,
      })
      return response.data
    } catch (error) {
      console.error('Error requesting verified certificate:', error)
      throw error
    }
  },

  /**
   * Request professional certificate
   * @param {string|number} pathId - Learning path ID
   * @returns {Promise} Certificate request data
   */
  requestProfessionalCertificate: async (pathId) => {
    try {
      const response = await apiClient.post(`/api/v1/certificates/request-professional/`, {
        path_id: pathId,
      })
      return response.data
    } catch (error) {
      console.error('Error requesting professional certificate:', error)
      throw error
    }
  },

  /**
   * Verify certificate by ID
   * @param {string} certificateId - Certificate ID or verification code
   * @returns {Promise} Certificate verification data
   */
  verifyCertificate: async (certificateId) => {
    try {
      const response = await apiClient.get(`/api/v1/certificates/verify/${certificateId}/`)
      return response.data
    } catch (error) {
      console.error('Error verifying certificate:', error)
      throw error
    }
  },

  /**
   * Share certificate to LinkedIn
   * @param {string|number} certificateId - Certificate ID
   * @returns {Promise} Share URL
   */
  shareToLinkedIn: async (certificateId) => {
    try {
      const response = await apiClient.post(`/api/v1/certificates/${certificateId}/share/linkedin/`)
      return response.data
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error)
      throw error
    }
  },
}

export default certificateService
