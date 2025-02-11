import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Book, MessageCircle, Clock, ThumbsUp, ThumbsDown, Share2, Save } from 'lucide-react';

const AskSunnahMessage = ({ message, onFeedback, onSave, onShare }) => {
    const [showActions, setShowActions] = useState(false);

    return (
        <div
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {message.type === 'assistant' && (
                <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                        <Book className="h-5 w-5 text-white" />
                    </div>
                </div>
            )}

            <div className={`max-w-2xl rounded-lg p-4 ${message.type === 'user'
                ? 'bg-green-600 text-white ml-12'
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

                {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <div className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center">
                            <Book className="h-4 w-4 mr-2" />
                            Verified Sources:
                        </div>
                        {message.sources.map((source, idx) => (
                            <div key={idx} className="text-sm bg-green-50 dark:bg-gray-700/50 p-3 rounded border-l-4 border-green-500">
                                <p className="font-medium text-gray-700 dark:text-gray-300">{source.source}</p>
                                {source.translation ? (
                                    <>
                                        <p className="mt-2 font-arabic text-right text-lg dark:text-gray-300">{source.text}</p>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">{source.translation}</p>
                                    </>
                                ) : (
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">{source.text}</p>
                                )}
                            </div>
                        ))}
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