/**
 * @fileoverview Chat message component for AskSunnah application that displays
 * both user and AI assistant messages with appropriate styling.
 * 
 * Renders different UI elements based on message type:
 * - User messages: Right-aligned with green background
 * - Assistant messages: Left-aligned with light/dark mode compatible styling
 * 
 * Features include:
 * - Message metadata (sender info and timestamp)
 * - "Talk to a Scholar" suggestion link
 * - Hover-activated action buttons (feedback, save, share)
 * - Support for displaying referenced sources (currently unused)
 * - Responsive design optimized for mobile and desktop
 */

import React, { useState } from 'react';
import { Book, MessageCircle, Clock, ThumbsUp, ThumbsDown, Share2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScholarSuggestion = () => (
    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
        <Link
            to="/scholars"
            className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
            Talk to a Scholar
            <svg
                className="ml-1 w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </Link>
        {" "}
        for personalized guidance and in-depth discussion.
    </div>
);

// Main component
const AskSunnahMessage = ({ message, onFeedback, onSave, onShare }) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group px-2 sm:px-0`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {message.type === 'assistant' && (
                <div className="flex-shrink-0 mr-2 sm:mr-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 flex items-center justify-center">
                        <Book className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                </div>
            )}

            <div className={`max-w-[85%] sm:max-w-2xl rounded-lg p-3 sm:p-4 ${message.type === 'user'
                ? 'bg-green-600 text-white ml-8 sm:ml-12'
                : 'bg-white dark:bg-gray-800 shadow-lg dark:text-gray-200'
                }`}>
                {message.type === 'assistant' && (
                    <div className="flex items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="font-medium">AskSunnah</span>
                        <Clock className="h-4 w-4 ml-2 mr-1" />
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                )}

                <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* ToDo- This part is not used anywhere in current version. */}
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                        <div className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 flex items-center">
                            <Book className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Verified Sources:
                        </div>
                        {message.sources.map((source, idx) => (
                            <div key={idx} className="text-xs sm:text-sm bg-green-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded border-l-4 border-green-500">
                                <p className="font-medium text-gray-700 dark:text-gray-300">{source.source}</p>
                                {source.translation ? (
                                    <>
                                        <p className="mt-1 sm:mt-2 font-arabic text-right text-base sm:text-lg dark:text-gray-300">{source.text}</p>
                                        <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-400">{source.translation}</p>
                                    </>
                                ) : (
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">{source.text}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {/* -- Till here-- */}

                {/* Refer to ask from scholar section */}
                {message.type === 'assistant' && (
                    <div className="mt-4">
                        <ScholarSuggestion />
                    </div>
                )}

                {message.type === 'assistant' && showActions && (
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => onFeedback(true)} className="hover:text-green-600 flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful
                            </button>
                            <button onClick={() => onFeedback(false)} className="hover:text-red-600 flex items-center">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Not Helpful
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={onSave} className="hover:text-green-600 flex items-center">
                                <Save className="h-4 w-4 mr-1" />
                                Save
                            </button>
                            <button onClick={onShare} className="hover:text-green-600 flex items-center">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {message.type === 'user' && (
                <div className="flex-shrink-0 ml-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">You</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AskSunnahMessage;