import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, AlertCircle, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import LocationDisplay from './ui/LocationDisplay';
import RamadanTable from './ramadan/RamadanTable';
import RamadanInfoBox from './ramadan/RamadanInfoBox';
import RamadanDisclaimer from './ramadan/RamadanDisclaimer';
import AddressInput from './ui/AddressInput';
import { getRamadanCalendarByAddress } from '../services/prayerTimesAPI';
import {
    getRamadanCalendarWithFallback,
    getMethodName
} from '../services/prayerTimesAPI';

const RamadanTimesPage = () => {
    const navigate = useNavigate();
    const { location, manualAddress, error } = useLocation();
    const [loading, setLoading] = useState(true);
    const [ramadanDates, setRamadanDates] = useState([]);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [hijriYear, setHijriYear] = useState('1446');
    const [calculationMethod, setCalculationMethod] = useState(3); // Default to Muslim World League
    const [methodName, setMethodName] = useState('Muslim World League');

    // Update Hijri year when selected year changes
    useEffect(() => {
        // Approximate mapping for next few years
        const hijriYears = {
            2024: '1445',
            2025: '1446',
            2026: '1447',
            2027: '1448',
            2028: '1449',
            2029: '1450',
            2030: '1451'
        };

        setHijriYear(hijriYears[selectedYear] || String(parseInt(selectedYear) - 579));
    }, [selectedYear]);

    // Update method name when calculation method changes
    useEffect(() => {
        setMethodName(getMethodName(calculationMethod));
    }, [calculationMethod]);

    // Calculate Ramadan dates based on location
    const fetchRamadanCalendar = async () => {
        if (!location && !manualAddress) return;

        try {
            setLoading(true);
            let calendar;

            if (manualAddress) {
                calendar = await getRamadanCalendarByAddress(
                    manualAddress,
                    selectedYear,
                    calculationMethod
                );
            } else {
                calendar = await getRamadanCalendarWithFallback(
                    location.latitude,
                    location.longitude,
                    selectedYear,
                    calculationMethod
                );
            }

            setRamadanDates(calendar);
        } catch (err) {
            console.error('Error fetching Ramadan calendar:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update the useEffect:
    useEffect(() => {
        if (!location && !manualAddress) return;
        fetchRamadanCalendar();
    }, [location, manualAddress, selectedYear, calculationMethod]);

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
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Ramadan {hijriYear} Calendar
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                        Suhoor (Sahar) and Iftar times for your location
                    </p>

                    {/* Location Display Component */}
                    <LocationDisplay />
                    {/* Address Input */}
                    <div className="mt-4">
                        <AddressInput className="max-w-md mx-auto" placeholder="Enter city, country or full address..." />
                    </div>
                </div>

                {error && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 sm:p-4 mb-6">
                        <div className="flex items-start sm:items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <div>
                                <p>{error}</p>
                                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                                    We're showing estimated times. For accurate times, please check with your local mosque.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-green-600" />
                            Ramadan Calendar
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            {/* Year selector */}
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                                <button
                                    onClick={() => setSelectedYear(selectedYear - 1)}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                    aria-label="Previous year"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                                    {selectedYear}
                                </span>
                                <button
                                    onClick={() => setSelectedYear(selectedYear + 1)}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                    aria-label="Next year"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Method selector - Made more prominent */}
                            <div className="w-full sm:w-auto">
                                <select
                                    value={calculationMethod}
                                    onChange={(e) => setCalculationMethod(Number(e.target.value))}
                                    className="w-full sm:w-auto text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2"
                                    aria-label="Calculation method"
                                >
                                    <option value="1">University of Islamic Sciences, Karachi</option>
                                    <option value="2">Islamic Society of North America (ISNA)</option>
                                    <option value="3">Muslim World League</option>
                                    <option value="4">Umm Al-Qura, Makkah</option>
                                    <option value="5">Egyptian General Authority</option>
                                    <option value="8">Gulf Region</option>
                                    <option value="12">Union Organization islamic de France</option>
                                    <option value="13">Diyanet İşleri Başkanlığı, Turkey</option>
                                    <option value="16">Dubai Standard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ramadan Calendar Table */}
                <RamadanTable
                    ramadanDates={ramadanDates}
                    loading={loading}
                />

                {/* Ramadan Information Box */}
                <RamadanInfoBox calculationMethod={methodName} />

                {/* Disclaimer */}
                <RamadanDisclaimer error={error} />
            </div>
        </div>
    );
};

export default RamadanTimesPage;