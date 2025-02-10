import React from 'react';
import { Sparkles } from 'lucide-react';

const ToggleMode = ({ isProMode, onToggle }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isProMode
            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
      >
        <Sparkles className={`h-4 w-4 ${isProMode ? 'text-yellow-200' : 'text-gray-400'}`} />
        {isProMode ? 'Pro Mode' : 'Free Mode'}
      </button>
      {isProMode && (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/30 dark:text-green-300">
          Verified Sources
        </span>
      )}
    </div>
  );
};

export default ToggleMode;