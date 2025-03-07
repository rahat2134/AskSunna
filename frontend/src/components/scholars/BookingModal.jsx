/**
 * @fileoverview Modal component for scheduling scholar consultations.
 * Provides a form interface for users to select consultation topics,
 * input questions, and confirm bookings with selected scholars and
 * time slots. Includes validation and confirmation handling.
 */
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const BookingModal = ({ scholar, selectedSlot, onClose, onConfirm }) => {
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Book Consultation with {scholar.name}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Selected Time
                        </label>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{selectedSlot}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Topic
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                            placeholder="e.g., Marriage, Prayer, Fasting"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Questions
                        </label>
                        <textarea
                            value={questions}
                            onChange={(e) => setQuestions(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 h-32"
                            placeholder="List your specific questions..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(topic, questions)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        disabled={!topic || !questions}
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;