/**
 * @fileoverview Prayer Times API Service for AskSunna
 * 
 * This service provides functions to fetch prayer times and Ramadan calendar
 * from the AlAdhan API with fallback to local calculations, caching, and
 * offline support via localStorage.
 */

const API_BASE_URL = 'https://api.aladhan.com/v1';

// Simple in-memory cache
const cache = {
    prayerTimes: {},
    ramadanCalendar: {}
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRY = {
    PRAYER_TIMES: 12 * 60 * 60 * 1000, // 12 hours
    RAMADAN_CALENDAR: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Format date as DD-MM-YYYY for API requests
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

/**
 * Save data to local storage with timestamp
 * @param {string} key - Storage key
 * @param {object} data - Data to store
 */
const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(`asksunnah_${key}`, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
};

/**
 * Get data from local storage if not expired
 * @param {string} key - Storage key
 * @param {number} maxAge - Maximum age in milliseconds
 * @returns {object|null} Stored data or null if expired/not found
 */
const getFromLocalStorage = (key, maxAge = 24 * 60 * 60 * 1000) => {
    try {
        const stored = localStorage.getItem(`asksunnah_${key}`);
        if (!stored) return null;

        const { data, timestamp } = JSON.parse(stored);

        // Check if data is still fresh
        if (Date.now() - timestamp > maxAge) {
            localStorage.removeItem(`asksunnah_${key}`);
            return null;
        }

        return data;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
};

/**
 * Fetch prayer times for a specific date using coordinates
 * @param {Date} date - Date to get prayer times for
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} method - Calculation method ID (default: 3 - Muslim World League)
 * @returns {Promise} Prayer times data
 */
export const fetchPrayerTimesByCoordinates = async (date, latitude, longitude, method = 3) => {
    try {
        // Format date as DD-MM-YYYY
        const formattedDate = formatDate(date);

        // Create cache key
        const cacheKey = `prayer_${formattedDate}_${latitude.toFixed(4)}_${longitude.toFixed(4)}_${method}`;

        // Check in-memory cache first
        if (cache.prayerTimes[cacheKey]) {
            return cache.prayerTimes[cacheKey];
        }

        // Then check localStorage
        const storedData = getFromLocalStorage(cacheKey, CACHE_EXPIRY.PRAYER_TIMES);
        if (storedData) {
            // Refresh in-memory cache
            cache.prayerTimes[cacheKey] = storedData;
            return storedData;
        }

        // If not in cache, fetch from API
        const url = `${API_BASE_URL}/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch prayer times: ${response.status}`);
        }

        const data = await response.json();

        // Cache the response
        cache.prayerTimes[cacheKey] = data;
        saveToLocalStorage(cacheKey, data);

        return data;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
    }
};

/**
 * Fetch calendar data for a month using coordinates
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} year - Gregorian year
 * @param {number} month - Gregorian month (1-12)
 * @param {number} method - Calculation method ID
 * @returns {Promise} Calendar data for the month
 */
export const fetchCalendarByMonth = async (latitude, longitude, year, month, method = 3) => {
    try {
        // Create cache key
        const cacheKey = `calendar_${year}_${month}_${latitude.toFixed(4)}_${longitude.toFixed(4)}_${method}`;

        // Check in-memory cache first
        if (cache.ramadanCalendar[cacheKey]) {
            return cache.ramadanCalendar[cacheKey];
        }

        // Then check localStorage
        const storedData = getFromLocalStorage(cacheKey, CACHE_EXPIRY.RAMADAN_CALENDAR);
        if (storedData) {
            // Refresh in-memory cache
            cache.ramadanCalendar[cacheKey] = storedData;
            return storedData;
        }

        // If not in cache, fetch from API
        const url = `${API_BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.status}`);
        }

        const data = await response.json();

        // Cache the response
        cache.ramadanCalendar[cacheKey] = data;
        saveToLocalStorage(cacheKey, data);

        return data;
    } catch (error) {
        console.error('Error fetching calendar:', error);
        throw error;
    }
};

/**
 * Get Ramadan month(s) for a given Gregorian year
 * @param {number} year - Gregorian year
 * @returns {Object} Primary and secondary Ramadan months (if it spans two months)
 */
export const getRamadanMonthsForYear = (year) => {
    // Approximate mapping of Ramadan start month for upcoming years
    const ramadanStartMonths = {
        2024: 3, // March 2024
        2025: 3, // March 2025
        2026: 2, // February 2026
        2027: 2, // February 2027
        2028: 1, // January 2028
        2029: 1, // January 2029
        2030: 12  // December 2029 (for 2030 Ramadan)
    };

    // Primary month (where Ramadan starts)
    const primaryMonth = ramadanStartMonths[year];

    // Secondary month (if Ramadan spans two months)
    // In many years, Ramadan spans across two Gregorian months
    let secondaryMonth = primaryMonth + 1;
    if (secondaryMonth > 12) {
        secondaryMonth = 1; // Handle December to January transition
    }

    return {
        primary: primaryMonth || 3, // Default to March if year is not found
        secondary: secondaryMonth
    };
};

/**
 * Process calendar API data to extract Ramadan days
 * @param {Object} apiData - Calendar data from the API
 * @param {number} month - Month number (1-12)
 * @returns {Array} Ramadan days in the specified month
 */
const extractRamadanDaysFromCalendar = (apiData, month) => {
    if (!apiData || !apiData.data) return [];

    // Filter for days in Ramadan (9th Hijri month)
    return apiData.data.filter(day =>
        day.date.hijri.month.number === 9 &&
        parseInt(day.date.gregorian.month.number) === month
    );
};

/**
 * Process API data to match our existing Ramadan calendar format
 * @param {Array} ramadanDays - Ramadan days from the API
 * @returns {Array} Ramadan calendar days in our format
 */
const processRamadanDays = (ramadanDays) => {
    if (!ramadanDays || !ramadanDays.length) return [];

    return ramadanDays.map(day => {
        // Parse the date
        const gregorianDate = day.date.gregorian.date;
        const dateParts = gregorianDate.split('-');
        const date = new Date(
            parseInt(dateParts[2]),  // Year
            parseInt(dateParts[1]) - 1, // Month (0-indexed)
            parseInt(dateParts[0])  // Day
        );

        // Clean the prayer times (remove any trailing annotations)
        const fajrTime = day.timings.Fajr.split(' ')[0];
        const maghribTime = day.timings.Maghrib.split(' ')[0];

        return {
            day: parseInt(day.date.hijri.day), // Ramadan day number
            date: date,
            gregorianDate: parseInt(day.date.gregorian.day),
            gregorianMonth: parseInt(day.date.gregorian.month.number) - 1, // JavaScript months are 0-indexed
            gregorianYear: parseInt(day.date.gregorian.year),
            times: {
                suhoor: fajrTime,
                iftar: maghribTime
            }
        };
    });
};

/**
 * Fetch complete Ramadan calendar for a year
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} year - Gregorian year
 * @param {number} method - Calculation method ID
 * @returns {Promise<Array>} Ramadan calendar days
 */
export const fetchRamadanCalendar = async (latitude, longitude, year, method = 3) => {
    try {
        // Get Ramadan months for this year
        const { primary, secondary } = getRamadanMonthsForYear(year);

        // Fetch calendar for primary month
        const primaryData = await fetchCalendarByMonth(latitude, longitude, year, primary, method);
        const primaryDays = extractRamadanDaysFromCalendar(primaryData, primary);

        let secondaryDays = [];

        // If secondary month is in next year (December -> January case)
        const secondaryYear = (primary === 12) ? year + 1 : year;

        // Fetch calendar for secondary month if needed
        if (primaryDays.length < 30) {
            const secondaryData = await fetchCalendarByMonth(latitude, longitude, secondaryYear, secondary, method);
            secondaryDays = extractRamadanDaysFromCalendar(secondaryData, secondary);
        }

        // Combine and process days
        const allDays = [...processRamadanDays(primaryDays), ...processRamadanDays(secondaryDays)];

        // Sort by Ramadan day number
        allDays.sort((a, b) => a.day - b.day);

        return allDays;
    } catch (error) {
        console.error('Error fetching Ramadan calendar:', error);
        throw error;
    }
};

/**
 * Get prayer times from API with fallback to local calculation
 * @param {Date} date - Date to get prayer times for
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} method - Calculation method ID
 * @returns {Promise<Object>} Prayer times data
 */
export const getPrayerTimesWithFallback = async (date, latitude, longitude, method = 3) => {
    try {
        // First try the API
        const apiData = await fetchPrayerTimesByCoordinates(date, latitude, longitude, method);
        return apiData.data.timings;
    } catch (error) {
        console.warn('Falling back to local calculation for prayer times');
        // Import the local calculation function
        const { getPrayerTimes } = await import('../utils/prayerTimes');
        // Use the existing local calculation as fallback
        return getPrayerTimes(latitude, longitude, date, method);
    }
};

/**
 * Get Ramadan calendar with fallback to local calculation
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} year - Gregorian year
 * @param {number} method - Calculation method ID
 * @returns {Promise<Array>} Ramadan calendar days
 */
export const getRamadanCalendarWithFallback = async (latitude, longitude, year, method = 3) => {
    try {
        // Try to get from API first
        const ramadanDays = await fetchRamadanCalendar(latitude, longitude, year, method);

        // The API may return less than 30 days if we're missing data
        // Ensure we have a full 30 days of Ramadan
        if (ramadanDays.length === 30) {
            return ramadanDays;
        } else {
            throw new Error('Incomplete Ramadan calendar from API');
        }
    } catch (error) {
        console.warn('Falling back to local calculation for Ramadan calendar:', error.message);
        // Import the local calculation function
        const { getRamadanCalendar } = await import('../utils/prayerTimes');
        // Use the existing local calculation as fallback
        return getRamadanCalendar(latitude, longitude, year, method);
    }
};

/**
 * Convert API method ID to a readable name
 * @param {number} methodId - Calculation method ID
 * @returns {string} Method name
 */
export const getMethodName = (methodId) => {
    const methods = {
        0: "Shia Ithna-Ashari",
        1: "University of Islamic Sciences, Karachi",
        2: "Islamic Society of North America",
        3: "Muslim World League",
        4: "Umm Al-Qura University, Makkah",
        5: "Egyptian General Authority of Survey",
        7: "Institute of Geophysics, University of Tehran",
        8: "Gulf Region",
        9: "Kuwait",
        10: "Qatar",
        11: "Majlis Ugama Islam Singapura",
        12: "Union Organization Islamic de France",
        13: "Diyanet İşleri Başkanlığı, Turkey",
        14: "Spiritual Administration of Muslims of Russia",
        15: "Moonsighting Committee Worldwide",
        16: "Dubai",
        17: "Jabatan Kemajuan Islam Malaysia",
        18: "Tunisia",
        19: "Algeria",
        20: "Kementerian Agama Republik Indonesia",
        21: "Morocco",
        22: "Comunidade Islamica de Lisboa",
        23: "Ministry of Awqaf, Jordan"
    };

    return methods[methodId] || "Standard Method";
};

/**
 * Get prayer time for a specific type (Fajr, Dhuhr, etc.)
 * @param {Date} date - Date to get prayer time for
 * @param {string} prayerType - Prayer type (Fajr, Dhuhr, Asr, Maghrib, Isha)
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {number} method - Calculation method ID
 * @returns {Promise<string>} Prayer time
 */
export const getPrayerTime = async (date, prayerType, latitude, longitude, method = 3) => {
    const times = await getPrayerTimesWithFallback(date, latitude, longitude, method);
    return times[prayerType];
};

/**
 * Convert 24-hour time format to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format with AM/PM
 */
export const convertTo12HourFormat = (time24) => {
    if (!time24 || !time24.includes(':')) return time24;

    const [hours24, minutes] = time24.split(':');
    let hours12 = parseInt(hours24, 10) % 12;
    if (hours12 === 0) hours12 = 12;

    const period = parseInt(hours24, 10) >= 12 ? 'PM' : 'AM';
    return `${hours12}:${minutes} ${period}`;
};

export const getPrayerTimesByAddress = async (date, address, methodId = 3) => {
    if (!address) {
        throw new Error('Address is required');
    }

    // Format date as DD-MM-YYYY
    const formattedDate = formatDateForAPI(date);

    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(address)}&method=${methodId}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
        }

        const data = await response.json();
        return data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times by address:', error);
        throw error;
    }
};

export const getRamadanCalendarByAddress = async (address, year = 2025, methodId = 3) => {
    if (!address) {
        throw new Error('Address is required');
    }

    try {
        // For Ramadan calendar, we need to fetch 30 days of data
        const startDate = getRamadanStartDate(year);
        const promises = [];

        for (let i = 0; i < 30; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const formattedDate = formatDateForAPI(currentDate);

            promises.push(
                fetch(`https://api.aladhan.com/v1/timingsByAddress/${formattedDate}?address=${encodeURIComponent(address)}&method=${methodId}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to fetch prayer times');
                        return response.json();
                    })
                    .then(data => ({
                        date: new Date(currentDate),
                        day: i + 1,
                        gregorianDate: currentDate.getDate(),
                        gregorianMonth: currentDate.getMonth(),
                        gregorianYear: currentDate.getFullYear(),
                        times: {
                            suhoor: data.data.timings.Fajr,
                            iftar: data.data.timings.Maghrib
                        }
                    }))
            );
        }

        return await Promise.all(promises);
    } catch (error) {
        console.error('Error creating Ramadan calendar:', error);
        throw error;
    }
};

// Helper function to format date for API
function formatDateForAPI(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Add a function to get prayer times with address support
export const getPrayerTimesWithAddressSupport = async (date, coordinates, address, methodId = 3) => {
    // If address is provided, use address-based API
    if (address) {
        return getPrayerTimesByAddress(date, address, methodId);
    }

    // Otherwise use coordinates-based API
    if (coordinates && coordinates.latitude && coordinates.longitude) {
        return getPrayerTimesWithFallback(date, coordinates.latitude, coordinates.longitude, methodId);
    }

    throw new Error('Either coordinates or address must be provided');
};

// Add a function to get Ramadan calendar with address support
export const getRamadanCalendarWithAddressSupport = async (coordinates, address, year = 2025, methodId = 3) => {
    // If address is provided, use address-based API
    if (address) {
        return getRamadanCalendarByAddress(address, year, methodId);
    }

    // Otherwise use coordinates-based API
    if (coordinates && coordinates.latitude && coordinates.longitude) {
        return getRamadanCalendarWithFallback(coordinates.latitude, coordinates.longitude, year, methodId);
    }

    throw new Error('Either coordinates or address must be provided');
};