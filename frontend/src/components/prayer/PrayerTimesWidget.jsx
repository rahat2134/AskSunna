import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { getMethodName, getPrayerTimesWithFallback, convertTo12HourFormat } from "../../services/prayerTimesAPI";
import { getPrayerTimesByAddress } from '../../services/prayerTimesAPI';

const PrayerTimesWidget = ({ methodId = 3 }) => {
    const { location, manualAddress, error: locationError } = useLocation();
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState('');

    // Prayer names and their display order
    const prayers = [
        { id: 'Fajr', name: 'Fajr', icon: '🌅' },
        { id: 'Dhuhr', name: 'Dhuhr', icon: '☀️' },
        { id: 'Asr', name: 'Asr', icon: '🌤️' },
        { id: 'Maghrib', name: 'Maghrib', icon: '🌇' },
        { id: 'Isha', name: 'Isha', icon: '🌙' }
    ];

    // Fetch prayer times
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            if (!location && !manualAddress) return;

            try {
                setLoading(true);
                const today = new Date();
                let times;

                if (manualAddress) {
                    times = await getPrayerTimesByAddress(
                        today,
                        manualAddress,
                        methodId
                    );
                } else {
                    times = await getPrayerTimesWithFallback(
                        today,
                        location.latitude,
                        location.longitude,
                        methodId
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
    }, [location, manualAddress, methodId]);

    // Determine next prayer and calculate time remaining
    useEffect(() => {
        if (!prayerTimes) return;

        const findNextPrayer = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            // Convert prayer times to minutes since midnight for comparison
            const timesInMinutes = {};
            for (const prayer of prayers) {
                if (prayerTimes[prayer.id]) {
                    const [hours, minutes] = prayerTimes[prayer.id].split(':').map(Number);
                    timesInMinutes[prayer.id] = hours * 60 + minutes;
                }
            }

            // Find the next prayer
            let nextPrayerId = null;
            let minDiff = Infinity;

            for (const prayer of prayers) {
                const prayerTime = timesInMinutes[prayer.id];
                if (prayerTime && prayerTime > currentTime && prayerTime - currentTime < minDiff) {
                    minDiff = prayerTime - currentTime;
                    nextPrayerId = prayer.id;
                }
            }

            // If no next prayer found today, the next prayer is tomorrow's Fajr
            if (!nextPrayerId) {
                nextPrayerId = 'Fajr';
                minDiff = (24 * 60) - currentTime + timesInMinutes['Fajr'];
            }

            // Calculate hours and minutes remaining
            const hoursRemaining = Math.floor(minDiff / 60);
            const minutesRemaining = minDiff % 60;

            // Format time remaining
            let timeStr = '';
            if (hoursRemaining > 0) {
                timeStr += `${hoursRemaining}h `;
            }
            timeStr += `${minutesRemaining}m`;

            setNextPrayer(nextPrayerId);
            setTimeRemaining(timeStr);
        };

        findNextPrayer();
        const intervalId = setInterval(findNextPrayer, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, [prayerTimes]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 w-full max-w-md">
                <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Prayer Times</h3>
                </div>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || locationError) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 w-full max-w-md">
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 mb-3">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-medium">Unable to load prayer times</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {error || locationError}. Please check your location settings and try again.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Prayer Times</h3>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
            </div>

            {/* Next Prayer Indicator */}
            {nextPrayer && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm text-green-700 dark:text-green-300">Next Prayer</span>
                            <h4 className="text-xl font-semibold text-green-800 dark:text-green-200">
                                {prayers.find(p => p.id === nextPrayer)?.name || nextPrayer}
                            </h4>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-green-700 dark:text-green-300">Time Remaining</span>
                            <p className="text-xl font-semibold text-green-800 dark:text-green-200">{timeRemaining}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Prayer Times List */}
            <div className="space-y-2">
                {prayers.map(prayer => (
                    <div
                        key={prayer.id}
                        className={`flex justify-between items-center p-2 rounded-lg ${nextPrayer === prayer.id
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <div className="flex items-center">
                            <span className="mr-2">{prayer.icon}</span>
                            <span className="font-medium">{prayer.name}</span>
                        </div>
                        <div className="font-mono">
                            {prayerTimes && prayerTimes[prayer.id]
                                ? convertTo12HourFormat(prayerTimes[prayer.id])
                                : '--:--'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                Times are calculated based on your current location.
            </div>
        </div>
    );
};

export default PrayerTimesWidget;