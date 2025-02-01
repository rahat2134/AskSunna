import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Moon, Sun, Book, AlertCircle, Check } from 'lucide-react';

const SimpleChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourceType, setSourceType] = useState('all');
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage and system preference on initial load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const messagesEndRef = useRef(null);

  // Apply theme on mount and when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          source_type: sourceType === 'all' ? null : sourceType
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.answer,
        sources: data.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        sources: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Book className="h-6 w-6 text-green-600 dark:text-green-500" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 ml-2">
                AskSunna
              </h1>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-100">
              Verified Sources
            </span>
          </div>
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
      </header>

      {/* Source Info Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900">
        <div className="max-w-7xl mx-auto py-2 px-6 flex items-center justify-center text-sm">
          <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2" />
          <span className="text-green-800 dark:text-green-100">
            All answers are from verified Quran and Hadith sources
          </span>
        </div>
      </div>

      {/* Chat Area with Islamic Patterns */}
      <div className="flex-1 overflow-y-auto p-6 bg-[url('/islamic-pattern.svg')] bg-repeat bg-opacity-5">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <Book className="h-12 w-12 mx-auto mb-4 text-green-600 dark:text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Welcome to AskSunna
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ask questions about Islam and receive answers from authentic sources including Quran and verified Hadiths
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
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
        ) : (
          <div className="space-y-6">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-lg p-4 ${
                  message.type === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white dark:bg-gray-800 shadow-sm dark:text-gray-200'
                }`}>
                  {/* Message content */}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Enhanced Source Display */}
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
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-green-600 dark:text-green-500" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-sm dark:text-gray-200"
          >
            <option value="all">All Sources</option>
            <option value="quran">Quran Only</option>
            <option value="hadith">Hadith Only</option>
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about Islam..."
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-gray-200 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleChat;