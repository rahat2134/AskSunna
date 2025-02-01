import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Moon, Sun } from 'lucide-react';

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
    setIsDark(!isDark);
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
      const response = await fetch('http://localhost:8000/api/v1/ask', {
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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">AskSunna</h1>
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
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Ask any question about Islam using authentic sources
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl rounded-lg p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 shadow-sm dark:text-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.sources && (
                    <div className="mt-4 space-y-2">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{source.source}</p>
                          {source.translation ? (
                            <>
                              <p className="mt-1 font-arabic text-right dark:text-gray-300">{source.text}</p>
                              <p className="mt-1 text-gray-600 dark:text-gray-400">{source.translation}</p>
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
            <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleChat;