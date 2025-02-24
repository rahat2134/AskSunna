import React, { useState, useEffect } from 'react';
import { Compass, MapPin, AlertCircle, Navigation } from 'lucide-react';

const QiblaCompass = () => {
    const [direction, setDirection] = useState(null);
    const [error, setError] = useState(null);
    const [compass, setCompass] = useState(0);
    const [loading, setLoading] = useState(true);

    // Mecca coordinates
    const MECCA_LAT = 21.4225;
    const MECCA_LNG = 39.8262;

    const calculateQibla = (latitude, longitude) => {
        const lat1 = latitude * (Math.PI / 180);
        const lat2 = MECCA_LAT * (Math.PI / 180);
        const lng1 = longitude * (Math.PI / 180);
        const lng2 = MECCA_LNG * (Math.PI / 180);

        const y = Math.sin(lng2 - lng1);
        const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lng2 - lng1);
        let qibla = Math.atan2(y, x);
        qibla = qibla * (180 / Math.PI);
        return (qibla + 360) % 360;
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const qiblaDirection = calculateQibla(
                    position.coords.latitude,
                    position.coords.longitude
                );
                setDirection(qiblaDirection);
                setLoading(false);

                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', (event) => {
                        if (event.webkitCompassHeading) {
                            setCompass(event.webkitCompassHeading);
                        } else if (event.alpha) {
                            setCompass(360 - event.alpha);
                        }
                    });
                }
            },
            (error) => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const rotateStyle = {
        transform: `rotate(${(direction || 0) - (compass || 0)}deg)`
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {/* Compass Container */}
            <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Qibla Sector Indicator */}
                <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <radialGradient id="qiblaGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="rgb(34 197 94 / 0.2)" />
                                <stop offset="100%" stopColor="rgb(34 197 94 / 0)" />
                            </radialGradient>
                        </defs>
                        <path
                            d="M50,50 L50,0 A50,50 0 0,1 85,15 Z"
                            fill="url(#qiblaGradient)"
                            className="dark:opacity-30"
                        />
                    </svg>
                </div>

                {/* Outer Circle with Degree Markers */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700">
                    {/* Degree markers */}
                    {[...Array(72)].map((_, i) => (
                        <div
                            key={i}
                            className={`absolute w-0.5 h-2 bg-gray-300 dark:bg-gray-600 origin-bottom`}
                            style={{
                                transform: `rotate(${i * 5}deg) translateY(-2px)`,
                                left: '50%',
                                top: '0',
                            }}
                        />
                    ))}

                    {/* Cardinal Directions */}
                    <div className="absolute inset-0">
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-xl text-green-600 dark:text-green-500">N</span>
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-xl text-gray-600 dark:text-gray-400">S</span>
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-xl text-gray-600 dark:text-gray-400">W</span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-xl text-gray-600 dark:text-gray-400">E</span>
                    </div>
                </div>

                {/* Center Point */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-green-600" />

                {/* Qibla Direction Indicator */}
                <div className="absolute inset-0 transition-transform duration-200" style={rotateStyle}>
                    {/* Direction Line */}
                    <div className="absolute top-1/2 left-1/2 w-1 h-32 -ml-0.5 -mt-32 bg-green-600 origin-bottom" />

                    {/* Arrow Head */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                            <Navigation className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Direction Info */}
            <div className="text-center space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Qibla Direction
                    </h3>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                        {direction ? `${Math.round(direction)}° from North` : 'Calculating...'}
                    </p>
                </div>

                {/* Instructions */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">How to Use:</h4>
                    <ol className="space-y-2 text-sm text-green-700 dark:text-green-300">
                        <li>1. Hold your device flat</li>
                        <li>2. Point the green arrow towards Qibla</li>
                        <li>3. Look for the green highlighted sector (generally between North and East)</li>
                        <li>4. The arrow points to the Qaba in Makkah</li>
                    </ol>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        This is an approximate direction. For most accurate results, please calibrate your device's compass and verify with local mosque guidance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QiblaCompass;