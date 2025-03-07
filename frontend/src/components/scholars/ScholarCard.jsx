/**
 * @fileoverview Scholar profile card component that displays a scholar's
 * details, credentials, and availability. Features profile photo, expertise
 * tags, languages, verification badge, rating, and consultation booking
 * controls. Handles conditional actions based on user's pro status.
 */
import React from 'react';
import { Shield, Calendar, Clock, Star, Book, Globe, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ScholarCard = ({ scholar, onSelect, onUpgradeClick }) => {
    const { isProUser } = useAuth();

    const handleAction = (action) => {
        if (!isProUser) {
            onUpgradeClick();
            return;
        }
        if (action === 'book') {
            onSelect(scholar);
        } else {
            alert('This page is under construction!');
        }
    };

    const handleSlotClick = (slot) => {
        if (!isProUser) {
            onUpgradeClick();
            return;
        }
        onSelect(scholar, slot);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-4 sm:p-6">
                {/* Scholar Header */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Avatar Section */}
                    <div className="relative mx-auto sm:mx-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800">
                            <img
                                src={scholar.image}
                                alt={scholar.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {scholar.isVerified && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 ring-2 ring-white dark:ring-gray-800">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        )}
                        {scholar.isOnline && (
                            <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800" />
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {scholar.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {scholar.credentials}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 font-medium">{scholar.rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {scholar.totalConsultations} consultations
                            </span>
                        </div>
                    </div>
                </div>

                {/* Expertise Tags */}
                <div className="mt-4">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {scholar.expertise.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 text-xs rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Languages */}
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {scholar.languages.join(" • ")}
                    </span>
                </div>

                {/* Time Slots */}
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 justify-center sm:justify-start">
                        <Clock className="w-4 h-4 text-green-500" />
                        Next Available Slots
                    </h4>
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
                        {scholar.nextSlots.slice(0, 6).map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                                className="px-2 py-1 text-xs rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300"
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col xs:flex-row gap-2">
                    <button
                        onClick={() => handleAction('book')}
                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Live Consultation
                    </button>
                    <button
                        onClick={() => handleAction('view')}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScholarCard;