/**
 * Validation utilities for ServiceFinder app
 */

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number (supports various formats)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it has at least 10 digits (standard minimum)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }

  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate service name
 * @param {string} name - Service name to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateServiceName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Service name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return { isValid: false, message: 'Service name must be at least 3 characters' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, message: 'Service name is too long (max 100 characters)' };
  }

  return { isValid: true, message: 'Service name is valid' };
};

/**
 * Validate service description
 * @param {string} description - Description to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { isValid: false, message: 'Description is required' };
  }

  const trimmedDesc = description.trim();

  if (trimmedDesc.length < 10) {
    return { isValid: false, message: 'Description must be at least 10 characters' };
  }

  if (trimmedDesc.length > 1000) {
    return { isValid: false, message: 'Description is too long (max 1000 characters)' };
  }

  return { isValid: true, message: 'Description is valid' };
};

/**
 * Validate category
 * @param {string} category - Category to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCategory = (category) => {
  if (!category || typeof category !== 'string') return false;

  const validCategories = [
    'plumbing',
    'electrical',
    'carpentry',
    'painting',
    'cleaning',
    'gardening',
    'landscaping',
    'roofing',
    'hvac',
    'handyman'
  ];

  return validCategories.includes(category.toLowerCase());
};

/**
 * Validate city name
 * @param {string} city - City name to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateCity = (city) => {
  if (!city || typeof city !== 'string') {
    return { isValid: false, message: 'City is required' };
  }

  const trimmedCity = city.trim();

  if (trimmedCity.length < 2) {
    return { isValid: false, message: 'City name must be at least 2 characters' };
  }

  if (trimmedCity.length > 50) {
    return { isValid: false, message: 'City name is too long' };
  }

  // Check if city contains only letters, spaces, hyphens, and apostrophes
  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(trimmedCity)) {
    return { isValid: false, message: 'City name contains invalid characters' };
  }

  return { isValid: true, message: 'City name is valid' };
};

/**
 * Validate rating value
 * @param {number} rating - Rating to validate (1-5)
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateRating = (rating) => {
  return typeof rating === 'number' && rating >= 1 && rating <= 5;
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, message: 'Image size must be less than 5MB' };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { isValid: false, message: 'Invalid file type. Please upload JPG, PNG, WEBP, or GIF' };
  }

  return { isValid: true, message: 'Image is valid' };
};

/**
 * Validate entire service form data
 * @param {object} formData - Form data object
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateServiceForm = (formData) => {
  const errors = {};

  // Validate name
  const nameValidation = validateServiceName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }

  // Validate category
  if (!validateCategory(formData.category)) {
    errors.category = 'Please select a valid category';
  }

  // Validate description
  const descValidation = validateDescription(formData.description);
  if (!descValidation.isValid) {
    errors.description = descValidation.message;
  }

  // Validate phone (optional but if provided must be valid)
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Validate email
  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate city
  const cityValidation = validateCity(formData.city);
  if (!cityValidation.isValid) {
    errors.city = cityValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitize string input (remove potentially harmful characters)
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 1000); // Limit length
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  // South African format: 082 123 4567
  if (digitsOnly.length === 10 && digitsOnly.startsWith('0')) {
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6)}`;
  }
  
  // International format: +27 82 123 4567
  if (digitsOnly.length === 11 && digitsOnly.startsWith('27')) {
    return `+${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
  }
  
  // Default: return as is
  return phone;
};

/**
 * Check if URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};