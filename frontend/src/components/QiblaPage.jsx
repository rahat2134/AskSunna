import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QiblaCompass from './QiblaCompass';

const QiblaPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Find Qibla Direction
          </h1>
          
          <QiblaCompass />

          {/* Additional Information */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Important Notes
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• This is an approximate direction based on your device's sensors</li>
              <li>• For most accurate results, calibrate your device's compass</li>
              <li>• Avoid using near large metal objects or electromagnetic fields</li>
              <li>• Always verify the direction with local mosque or reliable sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QiblaPage;