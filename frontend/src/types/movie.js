// JavaScript file - no TypeScript checking

/**
 * @typedef {Object} Movie
 * @property {number} id
 * @property {string} title
 * @property {string} director
 * @property {string} actors
 * @property {string} genres
 * @property {string} releaseDate
 * @property {string} duration
 * @property {string} language
 * @property {string} rated
 * @property {string} description
 * @property {string} [posterUrl]
 */

/**
 * @typedef {Object} MovieRequest
 * @property {string} title
 * @property {string} director
 * @property {string} actors
 * @property {string} genres
 * @property {string} releaseDate
 * @property {string} duration
 * @property {string} language
 * @property {string} rated
 * @property {string} description
 */

/**
 * @typedef {Object} MovieResponse
 * @property {number} id
 * @property {string} title
 * @property {string} director
 * @property {string} actors
 * @property {string} genres
 * @property {string} releaseDate
 * @property {string} duration
 * @property {string} language
 * @property {string} rated
 * @property {string} description
 * @property {string} [posterUrl]
 */

/**
 * @typedef {Object} PatchMovie
 * @property {string} [title]
 * @property {string} [director]
 * @property {string} [actors]
 * @property {string} [genres]
 * @property {string} [releaseDate]
 * @property {string} [duration]
 * @property {string} [language]
 * @property {string} [rated]
 * @property {string} [description]
 */

/**
 * @typedef {Object} Booking
 * @property {number} id
 * @property {number} userId
 * @property {number} movieId
 * @property {number} showtimeId
 * @property {number[]} seatIds
 * @property {number} totalAmount
 * @property {BookingStatus} status
 * @property {string} bookingTime
 * @property {PaymentStatus} paymentStatus
 */

/**
 * @typedef {'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'} BookingStatus
 */

/**
 * @typedef {'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'} PaymentStatus
 */

// Export constants for enums
export const BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};
