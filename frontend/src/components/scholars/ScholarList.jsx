/**
 * @fileoverview Component that renders a list of scholar cards with stats 
 * about online availability. Displays the total number of online scholars
 * and renders individual scholar cards with unified handling for selection
 * and upgrade prompts.
 */
import React from 'react';
import ScholarCard from './ScholarCard';
import { UserCircle, Clock } from 'lucide-react';

const ScholarList = ({ scholars, onSelect, onUpgradeClick }) => {
    const onlineScholarsCount = scholars.filter(s => s.isOnline).length;

    return (
        <>
            {/* Stats Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="px-4 py-3 flex justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <UserCircle className="w-4 h-4" />
                        {onlineScholarsCount} scholars online
                    </span>
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        Available for consultation
                    </span>
                </div>
            </div>

            {/* Scholar Grid */}
            <div className="grid grid-cols-1 gap-4 pb-8">
                {scholars.map((scholar) => (
                    <ScholarCard
                        key={scholar.id}
                        scholar={scholar}
                        onSelect={onSelect}
                        onUpgradeClick={onUpgradeClick}
                    />
                ))}
            </div>
        </>
    );
};

export default ScholarList;