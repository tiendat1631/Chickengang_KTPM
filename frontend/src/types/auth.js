// @ts-check

/**
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} email
 * @property {string} password
 * @property {string} phoneNumber
 * @property {string} username
 * @property {string} address
 * @property {string} [dateOfBirth]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string} phoneNumber
 * @property {string} address
 * @property {string} role
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * @typedef {Object} UserResponse
 * @property {number} id
 * @property {string} email
 * @property {string} phoneNumber
 * @property {UserRole} role
 * @property {boolean} isActive
 * @property {string} address
 * @property {string} username
 * @property {string} [dateOfBirth]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {'ADMIN' | 'CUSTOMER'} UserRole
 */

/**
 * @typedef {Object} ApiResponse
 * @property {string} status
 * @property {T} data
 * @property {string} message
 * @property {any} errors
 * @template T
 */

// Export constants for UserRole
export const UserRole = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER'
};
