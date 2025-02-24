import React, { useState, useEffect } from 'react';
import { Compass, MapPin, AlertCircle } from 'lucide-react';

const QiblaCompass = () => {
  const [direction, setDirection] = useState(null);
  const [error, setError] = useState(null);
  const [compass, setCompass] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mecca coordinates
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;

  const calculateQibla = (latitude, longitude) => {
    // Convert to radians
    const lat1 = latitude * (Math.PI / 180);
    const lat2 = MECCA_LAT * (Math.PI / 180);
    const lng1 = longitude * (Math.PI / 180);
    const lng2 = MECCA_LNG * (Math.PI / 180);

    // Calculate Qibla direction
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

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const qiblaDirection = calculateQibla(
          position.coords.latitude,
          position.coords.longitude
        );
        setDirection(qiblaDirection);
        setLoading(false);

        // Setup device orientation if supported
        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', (event) => {
            if (event.webkitCompassHeading) {
              // iOS devices
              setCompass(event.webkitCompassHeading);
            } else if (event.alpha) {
              // Android devices
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent" />
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
      <div className="relative w-48 h-48 mx-auto mb-4">
        {/* Compass base */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700">
          {/* Cardinal directions */}
          <div className="absolute inset-0">
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-gray-600 dark:text-gray-300">N</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-gray-600 dark:text-gray-300">S</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-gray-600 dark:text-gray-300">W</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-600 dark:text-gray-300">E</span>
          </div>
        </div>
        
        {/* Qibla direction indicator */}
        <div className="absolute inset-0 transition-transform duration-200" style={rotateStyle}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Qibla Direction
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {direction ? `${Math.round(direction)}° from North` : 'Calculating...'}
      </p>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Point your device's top edge toward the arrow to face the Qibla
      </div>
    </div>
  );
};

export default QiblaCompass;