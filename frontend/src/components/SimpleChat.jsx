import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import { generateGeminiResponse } from '../utils/gemini';
import Header from './chat/Header';
import MessageInput from './chat/MessageInput';
import { exportToPDF } from '../utils/export';
import WelcomeScreen from './chat/WelcomeScreen';
import AskSunnahMessage from './chat/AskSunnahMessage';
import TypingIndicator from './chat/TypingIndicator';
import { useAuth } from '../context/AuthContext';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analytics';


const SimpleChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourceType, setSourceType] = useState('all');
  const { isProUser } = useAuth();
  const [isProMode, setIsProMode] = useState(isProUser);
  const [hasInitialized, setHasInitialized] = useState(false);
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

  useEffect(() => {
    if (!hasInitialized && messages.length === 0) {
      setMessages([
        {
          type: 'assistant',
          content: `Assalamualaikum! I'm your Islamic knowledge companion AskSunnah.
I can help you understand: Teachings from the Quran and authentic Hadith, Islamic rulings and guidelines, Prayer times and worship matters, And many other aspects of Islam. How may I assist you today?`,
          sources: []
        }
      ]);
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    trackEvent(ANALYTICS_EVENTS.QUESTION_ASKED, {
      source_type: sourceType,
      is_pro: isProUser
    });

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let answer, sources = [];

      if (isProUser) {
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

  const handleSourceTypeChange = (type) => {
    setSourceType(type);
    trackEvent(ANALYTICS_EVENTS.SOURCE_FILTERED, { type });
  };


  const handleFeedback = (messageId, isPositive) => {
    trackEvent(ANALYTICS_EVENTS.FEEDBACK_GIVEN, {
      is_positive: isPositive,
      message_id: messageId
    });
  };

  const handleSave = (messageId) => {
    // Will implement later
    console.log(`Saving message ${messageId}`);
  };

  const handleShare = (messageId) => {
    // Will implement later
    console.log(`Sharing message ${messageId}`);
  };

  const handleExport = async (format) => {
    if (!messages.length) return;

    try {
      if (format === 'pdf') {
        await exportToPDF(messages);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // You could add a toast notification here
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        onExport={handleExport}
      />

      <div className="bg-gray-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-green-100/10">
        <div className="max-w-7xl mx-auto py-2 px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
            <span className="text-gray-700 dark:text-green-100">
              {isProUser
                ? "Using verified local database of Quran and Hadith sources"
                : "Free Version - Basic Islamic Knowledge"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[url('/islamic-pattern.svg')] bg-repeat bg-opacity-5 dark:bg-opacity-5">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-6">
            {messages.map((message, idx) => (
              <AskSunnahMessage
                key={idx}
                message={message}
                onFeedback={(isPositive) => handleFeedback(idx, isPositive)}
                onSave={() => handleSave(idx)}
                onShare={() => handleShare(idx)}
              />
            ))}
          </div>
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        sourceType={sourceType}
        setSourceType={handleSourceTypeChange}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default SimpleChat;