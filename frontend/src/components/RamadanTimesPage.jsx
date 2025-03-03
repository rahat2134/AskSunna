import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, AlertCircle, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRamadanCalendar } from '../utils/prayerTimes';
import { getHijriYear, getRamadanStartDate } from '../utils/ramadanUtils';
import { useLocation } from '../context/LocationContext';
import LocationDisplay from './ui/LocationDisplay';
import RamadanTable from './ramadan/RamadanTable';
import RamadanInfoBox from './ramadan/RamadanInfoBox';
import RamadanDisclaimer from './ramadan/RamadanDisclaimer';

const RamadanTimesPage = () => {
    const navigate = useNavigate();
    const { location, error } = useLocation();
    const [loading, setLoading] = useState(true);
    const [ramadanDates, setRamadanDates] = useState([]);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [hijriYear, setHijriYear] = useState('1446');

    // Update Hijri year when selected year changes
    useEffect(() => {
        setHijriYear(getHijriYear(selectedYear));
    }, [selectedYear]);

    // Calculate Ramadan dates based on location
    useEffect(() => {
        if (!location) return;

        const fetchRamadanCalendar = async () => {
            try {
                setLoading(true);
                const calendar = await getRamadanCalendar(
                    location.latitude,
                    location.longitude,
                    selectedYear
                );
                setRamadanDates(calendar);
            } catch (err) {
                console.error('Error fetching Ramadan calendar:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRamadanCalendar();
    }, [location, selectedYear]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </button>

                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Ramadan {hijriYear} | {selectedYear}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Ramadan {hijriYear} Calendar
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Suhoor (Sahar) and Iftar times for your location
                    </p>

                    {/* Location Display Component */}
                    <LocationDisplay />
                </div>

                {error && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                        <p className="mt-2 text-yellow-700 dark:text-yellow-300 pl-7">
                            We're showing estimated times. For accurate times, please check with your local mosque.
                        </p>
                    </div>
                )}

                {/* Calendar Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-green-600" />
                            Ramadan Calendar
                        </h2>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setSelectedYear(selectedYear - 1)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                aria-label="Previous year"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {selectedYear}
                            </span>
                            <button
                                onClick={() => setSelectedYear(selectedYear + 1)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                aria-label="Next year"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ramadan Calendar Table */}
                <RamadanTable
                    ramadanDates={ramadanDates}
                    loading={loading}
                />

                {/* Ramadan Information Box */}
                <RamadanInfoBox />

                {/* Disclaimer */}
                <RamadanDisclaimer error={error} />
            </div>
        </div>
    );
};

export default RamadanTimesPage;