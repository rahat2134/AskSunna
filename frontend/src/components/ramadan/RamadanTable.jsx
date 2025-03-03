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
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10 sm:w-auto">
                                Day
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <Moon className="h-3 w-3 mr-1" />
                                    <span className="hidden xs:inline">Suhoor Ends</span>
                                    <span className="xs:hidden">Suhoor</span>
                                </div>
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <Sun className="h-3 w-3 mr-1" />
                                    <span className="hidden xs:inline">Iftar Time</span>
                                    <span className="xs:hidden">Iftar</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            // Loading placeholders
                            Array.from({ length: 30 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="h-5 w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Actual data rows
                            ramadanDates.map((day) => (
                                <tr
                                    key={day.day}
                                    className={`${isToday(day.date) ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <div className={`text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${isToday(day.date)
                                            ? 'bg-green-600 text-white'
                                            : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {day.day}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(day.date)}
                                        {isToday(day.date) && (
                                            <span className="ml-1 inline-block px-1.5 py-0.5 text-[10px] font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                                Today
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                                        {day.times ? (
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1 text-indigo-500" />
                                                {convertTo12HourFormat(day.times.suhoor)}
                                            </div>
                                        ) : (
                                            <div className="animate-pulse h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                                        {day.times ? (
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1 text-orange-500" />
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
}

export default RamadanTable;