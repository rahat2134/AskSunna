import React from 'react';
import { Send, Loader2 } from 'lucide-react';

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
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex gap-2">
                        <select
                            value={sourceType}
                            onChange={(e) => setSourceType(e.target.value)}
                            className="w-28 sm:w-32 px-2 py-2 text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-gray-200 focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Sources</option>
                            <option value="quran">Quran</option>
                            <option value="hadith">Hadith</option>
                        </select>
                    </div>
                    <div className="flex flex-1 gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your question..."
                            className="flex-1 min-w-0 px-3 py-2 text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MessageInput;