/**
 * API utility functions for making authenticated requests
 */

/**
 * Makes an authenticated fetch request to the API
 * @param {string} endpoint - The API endpoint (e.g., '/api/dashboard')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The response data
 */
export const apiFetch = async (endpoint:string, options = {}) => {
  const token = localStorage.getItem('token')

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  }

  try {
    const response = await $fetch(endpoint, defaultOptions)
    return response
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

/**
 * GET request helper
 * @param {string} endpoint - The API endpoint
 * @returns {Promise} - The response data
 */
export const apiGet = (endpoint:string) => apiFetch(endpoint, { method: 'GET' })

/**
 * POST request helper
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The request body data
 * @returns {Promise} - The response data
 */
export const apiPost = (endpoint:string, data:any) => apiFetch(endpoint, {
  method: 'POST',
  body: JSON.stringify(data)
})

/**
 * PUT request helper
 * @param {string} endpoint - The API endpoint
 * @param {Object} data - The request body data
 * @returns {Promise} - The response data
 */
export const apiPut = (endpoint:string, data:any) => apiFetch(endpoint, {
  method: 'PUT',
  body: JSON.stringify(data)
})

/**
 * DELETE request helper
 * @param {string} endpoint - The API endpoint
 * @returns {Promise} - The response data
 */
export const apiDelete = (endpoint:string) => apiFetch(endpoint, { method: 'DELETE' })
