// frontend/src/components/ui/LoadingOverlay.jsx
import React from 'react';

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Pro Features...</p>
            </div>
        </div>
    </div>
);

export default LoadingOverlay;