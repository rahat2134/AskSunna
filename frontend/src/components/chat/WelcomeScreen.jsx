import React from 'react';
import { Book, Check, MessageCircle } from 'lucide-react';

const WelcomeScreen = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8 text-center">
                <Book className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Welcome to AskSunnah
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your trusted companion for Islamic knowledge, providing verified answers from authentic sources.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                        <Check className="h-5 w-5 text-green-600 mx-auto mb-2" />
                        <span className="font-medium">Verified Sources</span>
                    </div>
                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                        <Book className="h-5 w-5 text-green-600 mx-auto mb-2" />
                        <span className="font-medium">Quran & Hadith</span>
                    </div>
                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
                        <span className="font-medium">Scholar Guidance</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;