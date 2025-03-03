import React from 'react';
import { Moon, Sun, Clock } from 'lucide-react';
import { formatDate, isToday } from '../../utils/ramadanUtils';
import { convertTo12HourFormat } from '../../utils/prayerTimes';

const RamadanTable = ({ ramadanDates, loading }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Day
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <Moon className="h-3 w-3 mr-1" />
                                    Suhoor Ends
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <Sun className="h-3 w-3 mr-1" />
                                    Iftar Time
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            Array.from({ length: 30 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            ramadanDates.map((day) => (
                                <tr
                                    key={day.day}
                                    className={`${isToday(day.date) ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday(day.date)
                                                ? 'bg-green-600 text-white'
                                                : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {day.day}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(day.date)}
                                        {isToday(day.date) && (
                                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                                Today
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {day.times ? (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1 text-indigo-500" />
                                                {convertTo12HourFormat(day.times.suhoor)}
                                            </div>
                                        ) : (
                                            <div className="animate-pulse h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {day.times ? (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1 text-orange-500" />
                                                {convertTo12HourFormat(day.times.iftar)}
                                            </div>
                                        ) : (
                                            <div className="animate-pulse h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RamadanTable;