/**
 * @fileoverview Main component for the Islamic Scholar consultation feature.
 * Provides a complete interface for browsing and booking Islamic scholar
 * consultations with state management for scholar selection, filtering options,
 * and pro user access control. Integrates with the auth context for user
 * verification and modal displays for the booking workflow.
 */
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProAccessModal from '../ui/ProAccessModal';
import ScholarHeader from './ScholarHeader';
import ScholarList from './ScholarList';
import BookingDashboard from './BookingDashboard';
import ConsultationChat from './ConsultationChat';
import { getMockScholars, filterScholars } from './scholarData';
import BookingManager from '../../services/BookingManager';
import { toast } from 'react-hot-toast';
import SimpleBookingForm from './SimpleBookingForm';

const ScholarSection = () => {
    const [scholars, setScholars] = useState([]);
    const [filteredScholars, setFilteredScholars] = useState([]);
    const [selectedScholar, setSelectedScholar] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { isProUser, verifyProAccess } = useAuth();
    const [showProModal, setShowProModal] = useState(false);
    const [view, setView] = useState('scholars'); // scholars, dashboard, consultation
    const [activeBooking, setActiveBooking] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);


    const handleUpgradeClick = () => {
        setShowProModal(true);
    };

    useEffect(() => {
        // Load data
        const loadScholars = async () => {
            try {
                // In a real app, this would be an API call
                // For now, we use our mock data
                const mockScholars = getMockScholars();
                setScholars(mockScholars);
                setFilteredScholars(mockScholars);
            } catch (error) {
                console.error('Error loading scholars:', error);
            } finally {
                setLoading(false);
            }
        };

        loadScholars();

        // Check if user has any bookings to show dashboard by default
        const bookings = BookingManager.getBookings();
        if (bookings.length > 0 && isProUser) {
            setView('dashboard');
        }
    }, [isProUser]);

    // Apply filter when it changes
    useEffect(() => {
        setFilteredScholars(filterScholars(scholars, filter));
    }, [filter, scholars]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleSelect = (scholar, slot) => {
        setSelectedScholar(scholar);
        setSelectedSlot(slot);
    };

    const handleBooking = (topic, questions) => {
        // Save the booking to localStorage
        const booking = BookingManager.saveBooking(
            selectedScholar.id,
            selectedSlot,
            topic,
            questions
        );

        setSelectedScholar(null);
        setSelectedSlot(null);
        setShowConfirmation(true);

        // Reset after a delay
        setTimeout(() => {
            setShowConfirmation(false);
            setView('dashboard');
        }, 3000);
    };

    const handleProAccess = (key) => {
        const isVerified = verifyProAccess(key);
        if (isVerified) {
            setShowProModal(false);
        }
        return isVerified;
    };

    const handleStartConsultation = (booking) => {
        setActiveBooking(booking);
        setView('consultation');
    };

    const handleCompleteConsultation = () => {
        toast.success('Consultation completed!');
        setView('dashboard');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                </div>
            );
        }

        if (view === 'consultation' && activeBooking) {
            return (
                <ConsultationChat
                    booking={activeBooking}
                    onBack={() => setView('dashboard')}
                    onComplete={handleCompleteConsultation}
                />
            );
        }

        if (view === 'dashboard') {
            return (
                <>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Your Scholar Consultations
                        </h2>
                        <button
                            onClick={() => setView('scholars')}
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Browse Scholars
                        </button>
                    </div>
                    <BookingDashboard onStartConsultation={handleStartConsultation} />
                </>
            );
        }

        return (
            <>
                {/* Pro Mode Banner only if not Pro */}
                {!isProUser && (
                    <div className="mb-6 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            You're in free mode. Upgrade to Pro to book consultations with scholars.
                        </p>
                    </div>
                )}

                {/* Booking Success Message */}
                {showConfirmation && (
                    <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-900/50">
                        <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Booking confirmed! Your consultation has been scheduled.
                        </p>
                    </div>
                )}

                {/* My Bookings Link - show only if user has Pro access */}
                {isProUser && (
                    <div className="mb-6">
                        <button
                            onClick={() => setView('dashboard')}
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            View My Consultations
                        </button>
                    </div>
                )}

                {/* Results Summary */}
                <div className="mb-4 px-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {filter === 'all'
                        ? `Showing all ${filteredScholars.length} scholars`
                        : `Showing ${filteredScholars.length} scholars in ${filter}`}
                </div>

                {/* Scholar List Component */}
                <ScholarList
                    scholars={filteredScholars}
                    onSelect={handleSelect}
                    onUpgradeClick={handleUpgradeClick}
                />
            </>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <ScholarHeader
                title="Talk to Scholars"
                currentFilter={filter}
                onFilterChange={handleFilterChange}
            />

            <div className="max-w-5xl mx-auto px-4 pt-4 pb-16 relative z-10">
                {renderContent()}

                {/* Booking Modal */}
                {selectedScholar && (
                    <SimpleBookingForm
                        scholar={selectedScholar}
                        onClose={() => {
                            setSelectedScholar(null);
                        }}
                    />
                )}

                {/* Pro Access Modal */}
                <ProAccessModal
                    isOpen={showProModal}
                    onClose={() => setShowProModal(false)}
                    onVerify={handleProAccess}
                />
            </div>
        </div>
    );
};

export default ScholarSection;