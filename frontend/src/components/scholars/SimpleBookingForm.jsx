// frontend/src/components/scholars/SimpleBookingForm.jsx

import React, { useState, useRef } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import emailjs from '@emailjs/browser';

const SimpleBookingForm = ({ scholar, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState('');

    const formRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // EmailJS configuration
        // You'll need to replace these with your actual EmailJS service, template, and user IDs
        const serviceId = 'service_aqehyxk';
        const templateId = 'template_wsk0bpt';
        const userId = 'xrdAIpnj3KTLslCnY';

        // Prepare template parameters
        const templateParams = {
            scholar_name: scholar.name,
            scholar_expertise: scholar.expertise.join(', '),
            user_name: name,
            user_email: email,
            user_phone: phone || 'Not provided',
            preferred_date: date,
            preferred_time: time,
            topic: topic,
            message: message || 'Not provided',
            to_email: 'asksunnah786@gmail.com'
        };

        // Send email
        emailjs.send(serviceId, templateId, templateParams, userId)
            .then(() => {
                // Store booking in localStorage
                const bookings = JSON.parse(localStorage.getItem('asksunnah_bookings') || '[]');
                const newBooking = {
                    id: `booking_${Date.now()}`,
                    scholarId: scholar.id,
                    name,
                    email,
                    phone,
                    date,
                    time,
                    topic,
                    message,
                    status: 'requested',
                    createdAt: new Date().toISOString()
                };

                bookings.push(newBooking);
                localStorage.setItem('asksunnah_bookings', JSON.stringify(bookings));

                setIsSubmitting(false);
                setShowConfirmation(true);
            })
            .catch((err) => {
                console.error('Email sending failed:', err);
                setError('Failed to send booking request. Please try again or contact us directly at asksunnah786@gmail.com');
                setIsSubmitting(false);
            });
    };

    if (showConfirmation) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 text-center">
                    <div className="mb-4 h-16 w-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Booking Request Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We'll contact you shortly to confirm your consultation with {scholar.name}.
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="h-6 w-6" />
                </button>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Request Consultation with {scholar.name}
                </h3>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                        {error}
                    </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone Number (optional)
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Preferred Time
                            </label>
                            <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            >
                                <option value="">Select time</option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="3:00 PM">3:00 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                                <option value="5:00 PM">5:00 PM</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Consultation Topic
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Marriage counseling, Zakat questions"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                            placeholder="Please describe your questions or concerns"
                        />
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-xs text-green-700 dark:text-green-300">
                            By submitting this form, you'll receive an email confirmation. Our team will review your request and connect you with {scholar.name} or another qualified scholar if they're unavailable.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                Request Consultation
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SimpleBookingForm;