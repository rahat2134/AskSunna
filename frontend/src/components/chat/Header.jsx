import React from 'react';
import { Book, Sun, Moon } from 'lucide-react';
import ToggleMode from '../ToggleMode';

const Header = ({ isDark, toggleDarkMode, isProMode, setIsProMode }) => {
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Book className="h-6 w-6 text-green-600 dark:text-green-500" />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            AskSunnah
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ToggleMode isProMode={isProMode} onToggle={() => setIsProMode(!isProMode)} />
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                    >
                        {isDark ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
