/**
 * @fileoverview Modal component for scheduling scholar consultations.
 * Provides a form interface for users to select consultation topics,
 * input questions, and confirm bookings with selected scholars and
 * time slots. Includes validation and confirmation handling.
 */
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';

const BookingModal = ({ scholar, selectedSlot, onClose, onConfirm }) => {
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate a slight delay for better UX
        setTimeout(() => {
            onConfirm(topic, questions);
            setIsSubmitting(false);
        }, 500);
    };

    // Convert 24-hour format to 12-hour
    const formatTime = (time24) => {
        if (!time24) return '';

        const [hour, minute] = time24.split(':');
        const hour12 = hour % 12 || 12;
        const amPm = hour < 12 ? 'AM' : 'PM';

        return `${hour12}:${minute} ${amPm}`;
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Book Consultation with {scholar.name}
                </h3>

                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
                    <div className="flex justify-between items-center text-blue-700 dark:text-blue-300 font-medium mb-2">
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {formattedDate}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {formatTime(selectedSlot)}
                        </div>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400">
                        <AlertCircle className="w-4 h-4 inline-block mr-1" />
                        This is a simulated booking for demonstration purposes
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Topic
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Marriage, Prayer, Fasting"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Questions
                        </label>
                        <textarea
                            value={questions}
                            onChange={(e) => setQuestions(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32"
                            placeholder="List your specific questions..."
                            required
                        />
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-300">
                        <h4 className="font-medium mb-1">Consultation Guidelines:</h4>
                        <ul className="space-y-1 list-disc pl-5">
                            <li>Be specific with your questions</li>
                            <li>Mention any relevant context</li>
                            <li>Respect the scholar's time and expertise</li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            disabled={isSubmitting || !topic || !questions}
                        >
                            {isSubmitting ?
                                <span className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </span> :
                                'Confirm Booking'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;