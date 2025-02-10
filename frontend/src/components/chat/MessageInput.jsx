import React from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({
    sourceType,
    setSourceType,
    input,
    setInput,
    isLoading,
    handleSubmit
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
                <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-24 sm:w-auto px-2 sm:px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-xs sm:text-sm dark:text-gray-200"
                >
                    <option value="all">All Sources</option>
                    <option value="quran">Quran</option>
                    <option value="hadith">Hadith</option>
                </select>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-sm dark:text-gray-200 dark:placeholder-gray-400 min-w-0"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;