// frontend/src/components/scholars/ConsultationChat.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Clock, User, Shield } from 'lucide-react';
import BookingManager from '../../services/BookingManager';
import { getMockScholars } from './scholarData';

const ConsultationChat = ({ booking, onBack, onComplete }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [scholar, setScholar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Load scholar data
        const scholars = getMockScholars();
        const foundScholar = scholars.find(s => s.id === booking.scholarId);
        setScholar(foundScholar);

        // Load existing messages
        const loadedMessages = BookingManager.getMessages(booking.id);
        setMessages(loadedMessages);

        // If this is first time, create initial message from scholar
        if (loadedMessages.length === 0 && booking.status !== 'cancelled') {
            setTimeout(() => {
                const initialMessage = `Assalamu alaikum! Thank you for booking a consultation on "${booking.topic}". I've reviewed your questions and I'm ready to provide guidance based on Islamic teachings.`;

                const scholarMessage = BookingManager.addMessage(
                    booking.id,
                    'scholar',
                    initialMessage
                );

                setMessages([scholarMessage]);

                // Update booking status to ongoing
                if (booking.status === 'scheduled') {
                    BookingManager.updateBookingStatus(booking.id, 'ongoing');
                }
            }, 1000);
        }
    }, [booking]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        // Add user message
        const userMessage = BookingManager.addMessage(
            booking.id,
            'user',
            inputMessage
        );

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        // Simulate scholar response after delay
        setTimeout(() => {
            const scholarResponse = BookingManager.generateScholarResponse(
                booking.topic,
                inputMessage
            );

            const scholarMessage = BookingManager.addMessage(
                booking.id,
                'scholar',
                scholarResponse
            );

            setMessages(prev => [...prev, scholarMessage]);
            setIsLoading(false);
        }, 2000 + Math.random() * 1000);
    };

    const handleComplete = () => {
        BookingManager.updateBookingStatus(booking.id, 'completed');
        onComplete();
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!scholar) return <div>Loading...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center">
                    <img
                        src={scholar.image}
                        alt={scholar.name}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                    />
                    <div className="ml-2">
                        <div className="flex items-center">
                            <span className="font-medium text-gray-900 dark:text-white">{scholar.name}</span>
                            <Shield className="w-3 h-3 text-green-500 ml-1" />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {scholar.expertise[0]}
                        </div>
                    </div>
                </div>

                {booking.status !== 'completed' && (
                    <button
                        onClick={handleComplete}
                        className="text-sm bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full"
                    >
                        Complete
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.sender === 'scholar' && (
                            <img
                                src={scholar.image}
                                alt={scholar.name}
                                className="w-8 h-8 rounded-full flex-shrink-0 mr-2 self-end"
                            />
                        )}

                        <div
                            className={`max-w-[75%] rounded-lg p-3 ${message.sender === 'user'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div
                                className={`text-xs mt-1 text-right ${message.sender === 'user'
                                        ? 'text-green-100'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {formatTime(message.timestamp)}
                            </div>
                        </div>

                        {message.sender === 'user' && (
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 ml-2 self-end">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <img
                            src={scholar.image}
                            alt={scholar.name}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <form
                    onSubmit={handleSendMessage}
                    className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex"
                >
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="px-4 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            )}
        </div>
    );
};

export default ConsultationChat;