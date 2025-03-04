// In frontend/src/utils/apiTest.js

/**
 * Test connection to the AlAdhan API
 * This helps verify that CORS isn't blocking the requests
 */
export const testAlAdhanApi = async () => {
    try {
        const response = await fetch('https://api.aladhan.com/v1/methods');
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('AlAdhan API test successful:', data);
        return {
            success: true,
            message: 'Successfully connected to AlAdhan API'
        };
    } catch (error) {
        console.error('Error connecting to AlAdhan API:', error);
        return {
            success: false,
            message: error.message || 'Failed to connect to AlAdhan API'
        };
    }
};