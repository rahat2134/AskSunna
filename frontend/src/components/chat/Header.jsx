import React from 'react';
import { Book, Sun, Moon } from 'lucide-react';
import ToggleMode from '../ToggleMode';

const Header = ({ isDark, toggleDarkMode, isProMode, setIsProMode }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4 sm:py-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="flex items-center">
                            <Book className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-500" />
                            <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 ml-2">
                                AskSunnah
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ToggleMode isProMode={isProMode} onToggle={() => setIsProMode(!isProMode)} />
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {isDark ? (
                                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
