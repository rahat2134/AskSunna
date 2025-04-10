// frontend/src/components/ui/LocationDisplay.jsx
import React from 'react';
import { MapPin, LocateOff, LocateFixed, Loader2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const LocationDisplay = () => {
  const { location, manualAddress, isLocating, detectLocation } = useLocation();

  // If using manual address
  if (manualAddress) {
    return (
      <div className="inline-flex flex-wrap justify-center items-center w-full sm:w-auto px-3 py-2 sm:px-4 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
        <MapPin className="h-4 w-4 text-green-600 mr-2" />
        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mr-2">
          {manualAddress}
        </span>
        <button
          onClick={detectLocation}
          disabled={isLocating}
          className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
          title="Update location"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }

  // Original location display logic
  return (
    <div className="inline-flex flex-wrap justify-center items-center w-full sm:w-auto px-3 py-2 sm:px-4 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
      {location ? (
        <>
          <MapPin className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mr-2">
            {location.isDefault ? (
              <span className="flex items-center">
                <span className="font-medium">Makkah</span>
                <span className="ml-1 text-[10px] sm:text-xs text-yellow-600">(Default)</span>
              </span>
            ) : (
              `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
            )}
          </span>
        </>
      ) : (
        <>
          <LocateOff className="h-4 w-4 text-yellow-600 mr-2" />
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mr-2">
            Location unavailable
          </span>
        </>
      )}
      <button
        onClick={detectLocation}
        disabled={isLocating}
        className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500"
        title="Update location"
      >
        {isLocating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LocateFixed className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default LocationDisplay;