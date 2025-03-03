import React from 'react';

const RamadanDisclaimer = ({ error }) => {
    return (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
            <h3 className="font-medium mb-2">Important Notes:</h3>
            <ul className="space-y-1 list-disc pl-5">
                <li>Times are approximate based on calculations for your location</li>
                <li>It's recommended to stop eating a few minutes before Suhoor end time</li>
                <li>Follow your local mosque or Islamic authority for precise times</li>
                <li>Ramadan dates may vary based on moon sighting</li>
                {error && <li className="text-yellow-600 dark:text-yellow-400">Using estimated times due to location issues</li>}
            </ul>
        </div>
    );
};

export default RamadanDisclaimer;