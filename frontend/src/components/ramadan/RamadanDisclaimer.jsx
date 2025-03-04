// In frontend/src/components/ramadan/RamadanDisclaimer.jsx
import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';

const RamadanDisclaimer = ({ error, usingAPI = false }) => {
    return (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
            <div className="flex items-center gap-2 mb-2">
                {usingAPI ? (
                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" /> // change it to cloudcheck later on
                ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                )}
                <h3 className="font-medium">
                    {usingAPI 
                        ? "Prayer times powered by AlAdhan API"
                        : "Using estimated prayer times"
                    }
                </h3>
            </div>
            <ul className="space-y-1 list-disc pl-5">
                <li>Times are {usingAPI ? "calculated" : "estimated"} based on your location</li>
                <li>It's recommended to stop eating a few minutes before Suhoor end time</li>
                <li>Follow your local mosque or Islamic authority for precise times</li>
                <li>Ramadan dates may vary based on moon sighting</li>
                {error && <li className="text-yellow-600 dark:text-yellow-400">Using estimated times due to location issues</li>}
            </ul>
        </div>
    );
};

export default RamadanDisclaimer;