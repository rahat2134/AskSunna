/**
 * @fileoverview Shows a typing effect in responses of AskSunnah chat.
 */

import React from 'react';
import { Book } from 'lucide-react';

const TypingIndicator = () => {
    return (
        <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <Book className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center max-w-2xl rounded-lg p-2 bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;