import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Sun, Calendar, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import LocationDisplay from '../ui/LocationDisplay';
import PrayerTimesWidget from './PrayerTimesWidget';
import { getMethodName, getPrayerTimesWithFallback, convertTo12HourFormat } from '../../services/prayerTimesAPI';
import AddressInput from '../ui/AddressInput';
import { getPrayerTimesByAddress } from '../../services/prayerTimesAPI';

const PrayerTimesPage = () => {
    const navigate = useNavigate();
    const { location, manualAddress, error: locationError } = useLocation();
    const [date, setDate] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calculationMethod, setCalculationMethod] = useState(3); // Default to Muslim World League
    const [methodName, setMethodName] = useState("Muslim World League");

    // Additional prayer times to display
    const additionalTimes = [
        { id: 'Sunrise', name: 'Sunrise', icon: '🌅' },
        { id: 'Sunset', name: 'Sunset', icon: '🌇' },
        { id: 'Midnight', name: 'Midnight', icon: '🌃' },
        { id: 'Imsak', name: 'Imsak', icon: '🥣' }
    ];

    // Update method name when calculation method changes
    useEffect(() => {
        setMethodName(getMethodName(calculationMethod));
    }, [calculationMethod]);

    // Fetch prayer times for the selected date
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            if (!location && !manualAddress) return;

            try {
                setLoading(true);
                let times;

                if (manualAddress) {
                    times = await getPrayerTimesByAddress(
                        date,
                        manualAddress,
                        calculationMethod
                    );
                } else {
                    times = await getPrayerTimesWithFallback(
                        date,
                        location.latitude,
                        location.longitude,
                        calculationMethod
                    );
                }

                setPrayerTimes(times);
                setError(null);
            } catch (err) {
                console.error('Error fetching prayer times:', err);
                setError('Unable to fetch prayer times. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrayerTimes();
    }, [location, manualAddress, date, calculationMethod]);

    // Handle date navigation
    const changeDate = (days) => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        setDate(newDate);
    };

    // Format date for display
    const formatDate = (d) => {
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Check if date is today
    const isToday = (d) => {
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

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
                        <Clock className="h-4 w-4 mr-1" />
                        Prayer Times
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Islamic Prayer Times
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                        Accurate prayer times based on your location
                    </p>

                    {/* Location Display Component */}
                    <LocationDisplay />
                    {/* Address Input */}
                    <div className="mt-4">
                        <AddressInput className="max-w-md mx-auto" placeholder="Enter city, country or full address..." />
                    </div>
                </div>

                {locationError && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 sm:p-4 mb-6">
                        <div className="flex items-start sm:items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <div>
                                <p>{locationError}</p>
                                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                                    We're showing estimated times. For accurate times, please check with your local mosque.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Today's Prayer Times Widget */}
                {isToday(date) && (
                    <div className="mb-8">
                        <PrayerTimesWidget methodId={calculationMethod} />
                    </div>
                )}

                {/* Date Selector */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Date navigation */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => changeDate(-1)}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                aria-label="Previous day"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>

                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatDate(date)}
                                </h2>
                                {isToday(date) && (
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Today</span>
                                )}
                            </div>

                            <button
                                onClick={() => changeDate(1)}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                aria-label="Next day"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>

                            <button
                                onClick={() => setDate(new Date())}
                                className={`px-3 py-1 text-xs rounded-full ${isToday(date)
                                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                    }`}
                                disabled={isToday(date)}
                            >
                                Today
                            </button>
                        </div>

                        {/* Method selector */}
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

                {/* Prayer Times Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-medium text-gray-900 dark:text-white">Prayer Times for {formatDate(date)}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Calculation Method: {methodName}
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-4 space-y-4">
                            {[...Array(9)].map((_, idx) => (
                                <div key={idx} className="flex justify-between animate-pulse">
                                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-600 dark:text-red-400">
                            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                            <p>{error}</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Prayer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {/* Main prayers */}
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        Fajr
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-mono">
                                        {prayerTimes?.Fajr ? convertTo12HourFormat(prayerTimes.Fajr) : '--:--'}
                                    </td>
                                </tr>
                                {additionalTimes.find(t => t.id === 'Sunrise') && (
                                    <tr className="bg-gray-50 dark:bg-gray-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            Sunrise
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right font-mono">
                                            {prayerTimes?.Sunrise ? convertTo12HourFormat(prayerTimes.Sunrise) : '--:--'}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        Dhuhr
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-mono">
                                        {prayerTimes?.Dhuhr ? convertTo12HourFormat(prayerTimes.Dhuhr) : '--:--'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        Asr
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-mono">
                                        {prayerTimes?.Asr ? convertTo12HourFormat(prayerTimes.Asr) : '--:--'}
                                    </td>
                                </tr>
                                {additionalTimes.find(t => t.id === 'Sunset') && (
                                    <tr className="bg-gray-50 dark:bg-gray-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            Sunset
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right font-mono">
                                            {prayerTimes?.Sunset ? convertTo12HourFormat(prayerTimes.Sunset) : '--:--'}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        Maghrib
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-mono">
                                        {prayerTimes?.Maghrib ? convertTo12HourFormat(prayerTimes.Maghrib) : '--:--'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        Isha
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right font-mono">
                                        {prayerTimes?.Isha ? convertTo12HourFormat(prayerTimes.Isha) : '--:--'}
                                    </td>
                                </tr>
                                {/* Additional times */}
                                {additionalTimes.filter(t => t.id !== 'Sunrise' && t.id !== 'Sunset').map(time => (
                                    <tr key={time.id} className="bg-gray-50 dark:bg-gray-700/30">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {time.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right font-mono">
                                            {prayerTimes?.[time.id] ? convertTo12HourFormat(prayerTimes[time.id]) : '--:--'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Prayer Method Info */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        About Prayer Times Calculation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Prayer times are calculated based on astronomical formulas and vary by geographical location.
                        Each calculation method uses different angles for determining Fajr and Isha times.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                            Current Method: {methodName}
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            For the most accurate prayer times, select the calculation method used by your local mosques and Islamic authorities.
                        </p>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
                    <h3 className="font-medium mb-2">Important Notes:</h3>
                    <ul className="space-y-1 list-disc pl-5">
                        <li>Times are approximate based on calculations for your location</li>
                        <li>Follow your local mosque for precise times</li>
                        <li>Times may vary slightly based on local conventions</li>
                        <li>Calculation methods differ in how they determine the beginning of Fajr and Isha</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PrayerTimesPage;