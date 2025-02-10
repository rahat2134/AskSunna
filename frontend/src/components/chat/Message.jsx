import React from 'react';
import { Book } from 'lucide-react';

const Message = ({ message }) => {
    return (
        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl rounded-lg p-4 ${message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 shadow-sm dark:text-gray-200'
                }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.sources && (
                    <div className="mt-4 space-y-3">
                        <div className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center">
                            <Book className="h-4 w-4 mr-2" />
                            Verified Sources:
                        </div>
                        {message.sources.map((source, idx) => (
                            <div key={idx} className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded border-l-4 border-green-500">
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
            </div>
        </div>
    );
};

export default Message;