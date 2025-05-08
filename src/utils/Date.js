

/**
 * Formats a date object or string into a time string (HH:MM format)
 * @param {Date|string|number} date - Date object or string or timestamp
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}) => {
    const defaultOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Check if date is a Date object, if not convert it
    if (!(date instanceof Date)) {
      // Try to convert to Date if it's a string or timestamp
      try {
        date = new Date(date);
      } catch (e) {
        console.warn('Invalid date format:', date);
        return '12:00';
      }
    }
    
    // Check if date is valid after conversion
    if (isNaN(date.getTime())) {
      console.warn('Invalid date after conversion:', date);
      return '12:00';
    }
    
    try {
      return date.toLocaleTimeString([], mergedOptions);
    } catch (e) {
      console.error('Error formatting time:', e);
      return '12:00';
    }
  };
  
  /**
   * Ensures a value is a valid Date object
   * @param {any} value - Value to convert to Date
   * @returns {Date} Valid Date object
   */
  export const ensureDate = (value) => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    }
    
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch (e) {
      console.warn('Failed to convert to date:', value);
      return new Date();
    }
  };
  
  /**
   * Formats a date for display in chat messages
   * @param {Date|string|number} date - Date to format
   * @returns {string} Formatted date string
   */
  export const formatMessageDate = (date) => {
    const dateObj = ensureDate(date);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h ago`;
    } else {
      return formatTime(dateObj);
    }
  };