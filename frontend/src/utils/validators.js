/**
 * Validation utilities for form fields
 * Contains regex patterns and validation functions used across the application
 */

/**
 * Email validation using RFC 5322 regex pattern
 * @type {RegExp}
 */
export const emailRFC5322 = /^(?:[a-zA-Z0-9_'^&+\-`{}~!#$%*?\/|=]+(?:\.[a-zA-Z0-9_'^&+\-`{}~!#$%*?\/|=]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

/**
 * Strong password validation for signup
 * Requires ≥8 chars, uppercase, lowercase, number, special char
 * @type {RegExp}
 */
export const passwordSignup = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

/**
 * Password validation for reset - same as signup per HU requirements
 * Requires ≥8 chars, uppercase, lowercase, number, special char
 * @type {RegExp}
 */
export const passwordReset = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

/**
 * Validates age field - must contain only digits and be ≥ 13
 * @param {string|number} value - The age value to validate
 * @returns {boolean} True if valid age
 */
export function isValidAge(value) {
  if (!/^\d+$/.test(String(value))) return false
  const num = Number(value)
  return Number.isInteger(num) && num >= 13
}

/**
 * Checks if string is non-empty after trimming
 * @param {string} value - The string to validate
 * @returns {boolean} True if non-empty
 */
export function isNonEmpty(value) { return String(value ?? '').trim().length > 0 }

/**
 * Validates string length against maximum
 * @param {string} value - The string to validate
 * @param {number} max - Maximum allowed length
 * @returns {boolean} True if within length limit
 */
export function maxLength(value, max) { return String(value ?? '').trim().length <= max }


