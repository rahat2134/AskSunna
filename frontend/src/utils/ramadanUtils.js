/**
 * @fileoverview Utility functions for Ramadan dates and times
 */

/**
 * Convert Gregorian year to approximate Hijri year
 * @param {number} gregorianYear 
 * @returns {string} Hijri year
 */
export const getHijriYear = (gregorianYear) => {
    if (gregorianYear === 2024) {
        return '1445';
    } else if (gregorianYear === 2025) {
        return '1446';
    } else if (gregorianYear === 2026) {
        return '1447';
    } else {
        // Basic estimation
        return (gregorianYear - 579).toString();
    }
};

/**
 * Get estimated Ramadan start date for a given Gregorian year
 * @param {number} year 
 * @returns {Date} Estimated Ramadan start date
 */
export const getRamadanStartDate = (year) => {
    // Approximate mapping for next few years
    const startDates = {
        2024: new Date(2024, 2, 11), // March 11, 2024
        2025: new Date(2025, 2, 1),  // March 1, 2025
        2026: new Date(2026, 1, 18), // February 18, 2026
        2027: new Date(2027, 1, 7)   // February 7, 2027
    };

    if (startDates[year]) {
        return startDates[year];
    }

    // If not in our mapping, make a rough estimate
    // Ramadan moves ~11 days earlier each solar year
    const referenceYear = 2025;
    const referenceDate = new Date(2025, 2, 1); // March 1, 2025

    const yearDiff = year - referenceYear;
    const dayDiff = yearDiff * -11;

    const estimatedDate = new Date(referenceDate);
    estimatedDate.setDate(referenceDate.getDate() + dayDiff);

    return estimatedDate;
};

/**
 * Format date in a user-friendly way
 * @param {Date} date 
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Check if a date is today
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};