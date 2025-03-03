import React from 'react';
import { Moon, Sun, Calculator } from 'lucide-react';

const RamadanInfoBox = ({ calculationMethod }) => {
    const methodDescriptions = {
        1: "Muslim World League (18° Fajr, 17° Isha)",
        2: "Islamic Society of North America (15° for both Fajr and Isha)",
        3: "Egyptian General Authority of Survey (19.5° Fajr, 17.5° Isha)",
        4: "Umm Al-Qura University, Makkah (18.5° Fajr, 90 min after Maghrib for Isha)",
        5: "University of Islamic Sciences, Karachi (18° for both Fajr and Isha)",
        8: "Gulf Region (19.5° Fajr, 90 min after Maghrib for Isha)",
        12: "Dubai Standard (18.2° for both Fajr and Isha)"
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Ramadan Prayer Schedule
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                During Ramadan, Muslims fast from dawn (before Fajr prayer) until sunset (Maghrib prayer).
                Suhoor is the pre-dawn meal taken before fasting begins, and Iftar is the meal to break
                the fast at sunset.
            </p>

            {/* Add calculation method info */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center mb-2">
                    <Calculator className="h-4 w-4 mr-2 flex-shrink-0" />
                    Calculation Method: {methodDescriptions[calculationMethod] || "Standard Method"}
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                    Different regions use different calculation methods based on local conventions.
                    Select the method that matches your local authority for the most accurate times.
                </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center mb-2">
                        <Moon className="h-4 w-4 mr-2" />
                        Suhoor Guidelines
                    </h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                        <li>• Finish eating and drinking before Fajr time</li>
                        <li>• It's recommended to delay Suhoor as much as possible</li>
                        <li>• Stop eating 10 minutes before the listed time</li>
                    </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <h4 className="font-medium text-orange-700 dark:text-orange-300 flex items-center mb-2">
                        <Sun className="h-4 w-4 mr-2" />
                        Iftar Guidelines
                    </h4>
                    <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                        <li>• Break your fast immediately at Maghrib time</li>
                        <li>• Traditionally broken with dates and water</li>
                        <li>• Recite the dua for breaking fast before eating</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RamadanInfoBox;