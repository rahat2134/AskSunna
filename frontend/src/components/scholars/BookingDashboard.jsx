// frontend/src/components/scholars/BookingDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, MessageSquare, XCircle, Clock, Check } from 'lucide-react';
import BookingManager from '../../services/BookingManager';
import { getMockScholars } from './scholarData';

const BookingDashboard = ({ onStartConsultation }) => {
    const [bookings, setBookings] = useState([]);
    const [scholars, setScholars] = useState([]);

    useEffect(() => {
        // Load bookings from localStorage
        const loadedBookings = BookingManager.getBookings();
        setBookings(loadedBookings);

        // Get scholars data
        setScholars(getMockScholars());
    }, []);

    const getScholarById = (id) => {
        return scholars.find(scholar => scholar.id === id) || {};
    };

    const formatDate = (dateString) => {
        const options = {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleCancelBooking = (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            BookingManager.updateBookingStatus(bookingId, 'cancelled');
            setBookings(BookingManager.getBookings());
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'scheduled':
                return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">Scheduled</span>;
            case 'ongoing':
                return <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">In Progress</span>;
            case 'completed':
                return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Completed</span>;
            case 'cancelled':
                return <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Cancelled</span>;
            default:
                return null;
        }
    };

    if (bookings.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Bookings</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    You haven't booked any consultations yet. Browse our scholars and book a session.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Bookings</h3>

            {bookings.map(booking => {
                const scholar = getScholarById(booking.scholarId);

                return (
                    <div
                        key={booking.id}
                        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 ${booking.status === 'cancelled' ? 'border-red-500' :
                                booking.status === 'ongoing' ? 'border-green-500' :
                                    booking.status === 'completed' ? 'border-gray-500' :
                                        'border-blue-500'
                            }`}
                    >
                        <div className="flex flex-col sm:flex-row justify-between">
                            <div className="mb-3 sm:mb-0">
                                <div className="flex items-center">
                                    <img
                                        src={scholar.image}
                                        alt={scholar.name}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">{scholar.name}</h4>
                                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {booking.slot}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic:</span>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400">{booking.topic}</span>
                                </div>

                                <div className="mt-2 flex items-center">
                                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Booked on {formatDate(booking.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-end">
                                {getStatusBadge(booking.status)}

                                <div className="flex mt-3 space-x-2">
                                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                        <>
                                            <button
                                                onClick={() => onStartConsultation(booking)}
                                                className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg flex items-center"
                                            >
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                {booking.status === 'ongoing' ? 'Continue' : 'Start'}
                                            </button>

                                            {booking.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg flex items-center"
                                                >
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Cancel
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {booking.status === 'completed' && (
                                        <button
                                            onClick={() => onStartConsultation(booking)}
                                            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg flex items-center"
                                        >
                                            <MessageSquare className="w-3 h-3 mr-1" />
                                            View
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingDashboard;