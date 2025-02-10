import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import { generateGeminiResponse } from '../utils/gemini';
import Header from './chat/Header';
import MessageInput from './chat/MessageInput';
import Message from './chat/Message';
import WelcomeScreen from './chat/WelcomeScreen';

const SimpleChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourceType, setSourceType] = useState('all');
  const [isProMode, setIsProMode] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' ||
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let answer, sources = [];

      if (isProMode) {
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
        answer = data.answer;
        sources = data.sources;
      } else {
        answer = await generateGeminiResponse(input);
      }

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: answer,
        sources: sources
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
      <Header
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        isProMode={isProMode}
        setIsProMode={setIsProMode}
      />

      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900">
        <div className="max-w-7xl mx-auto py-2 px-6 flex items-center justify-center text-sm">
          <Check className="h-4 w-4 text-green-600 dark:text-green-500 mr-2" />
          <span className="text-green-800 dark:text-green-100">
            {isProMode
              ? "Using verified local database of Quran and Hadith sources"
              : "Answers from Quran and authentic Hadith knowledge - Free Version"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[url('/islamic-pattern.svg')] bg-repeat bg-opacity-5">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-6">
            {messages.map((message, idx) => (
              <Message key={idx} message={message} />
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

      <MessageInput
        sourceType={sourceType}
        setSourceType={setSourceType}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default SimpleChat;