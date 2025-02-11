import React from 'react';
import { Sparkles } from 'lucide-react';

const ToggleMode = ({ isProMode, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isProMode
            ? 'bg-green-600 text-white shadow-sm hover:bg-green-700'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
      >
        <Sparkles className={`h-4 w-4 ${isProMode ? 'text-yellow-200' : 'text-gray-500 dark:text-gray-400'}`} />
        {isProMode ? 'Pro Mode' : 'Free Mode'}
      </button>
      {isProMode && (
        <div className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-600/30">
          Verified Sources
        </div>
      )}
    </div>
  );
};

export default ToggleMode;