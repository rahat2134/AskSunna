import React from 'react';
import { Book, Check } from 'lucide-react';

const WelcomeScreen = () => {
    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-8 text-center">
            <Book className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-green-600 dark:text-green-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Welcome to AskSunnah
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                Ask questions about Islam and receive answers from authentic sources including Quran and verified Hadiths
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Verified Sources</span>
                </div>
                <div className="flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Arabic & English</span>
                </div>
                <div className="flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Source Citations</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;