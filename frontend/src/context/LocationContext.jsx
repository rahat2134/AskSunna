import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-hot-toast';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState(null);

    const detectLocation = useCallback(async () => {
        setIsLocating(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLocating(false);
            // Set default coordinates for Mecca
            setLocation({
                latitude: 21.4225,
                longitude: 39.8262,
                isDefault: true
            });
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 60000
                });
            });

            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                isDefault: false
            });

            //This saves the user's location in the browser's localStorage
            localStorage.setItem('asksunnah_location', JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                isDefault: false,
                timestamp: Date.now()
            }));

            toast.success('Location detected successfully');
        } catch (err) {
            console.error('Error getting location:', err);

            let errorMessage = 'Unable to access your location.';
            if (err.code === 1) {
                errorMessage = 'Location access denied. Using default location.';
            } else if (err.code === 2) {
                errorMessage = 'Location unavailable. Using default location.';
            } else if (err.code === 3) {
                errorMessage = 'Location request timed out. Using default location.';
            }

            setError(errorMessage);

            // Fallback to default coordinates (Mecca)
            setLocation({
                latitude: 21.4225,
                longitude: 39.8262,
                isDefault: true
            });
        } finally {
            setIsLocating(false);
        }
    }, []);

    // Initialize location on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('asksunnah_location');

        if (savedLocation) {
            try {
                const parsedLocation = JSON.parse(savedLocation);
                // Check if location is older than 24 hours
                if (Date.now() - parsedLocation.timestamp < 24 * 60 * 60 * 1000) {
                    setLocation(parsedLocation);
                } else {
                    // If older than 24 hours, get new location
                    detectLocation();
                }
            } catch (e) {
                console.error('Error parsing saved location:', e);
                detectLocation();
            }
        } else {
            detectLocation();
        }
    }, [detectLocation]);

    return (
        <LocationContext.Provider
            value={{
                location,
                isLocating,
                error,
                detectLocation
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};