import React, { useState } from 'react';
import { Book, Sun, Moon, Crown, ChevronDown, Download, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ProAccessModal from '../ui/ProAccessModal';
import { Link } from 'react-router-dom';

const Header = ({ isDark, toggleDarkMode, isProMode, setIsProMode, onExport }) => {
    const { isProUser, verifyProAccess, logout } = useAuth();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const isDemoMode = location.pathname === '/demo';

    const handleUpgradeClick = () => {
        setIsModalOpen(true);
    };

    const handleModeToggle = () => {
        if (isProUser) {
            logout();
        } else {
            handleUpgradeClick();
        }
    };

    return (
        <>
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-2 sm:py-3 px-3 sm:px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Book className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-500" />
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            AskSunnah
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mode Indicator & Toggle */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {isProUser && (
                                <div className="hidden xs:block px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-600/30">
                                    Verified Sources
                                </div>
                            )}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isProUser
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                        }`}
                                >
                                    {isProUser ? (
                                        <>
                                            <Crown className="h-4 w-4 text-green-600" />
                                            Pro Mode
                                        </>
                                    ) : (
                                        'Free Mode'
                                    )}
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                                        {isProUser && (
                                            <>
                                                <Link
                                                    to="/scholars"
                                                    onClick={() => setShowDropdown(false)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                >
                                                    <UserCircle className="h-4 w-4" />
                                                    Talk to Scholars
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        onExport('pdf');
                                                        setShowDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Export as Text
                                                </button>
                                                <div className="border-t border-gray-200 dark:border-gray-700" />
                                            </>
                                        )}
                                        <button
                                            onClick={() => {
                                                handleModeToggle();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {isProUser ? 'Switch to Free Mode' : 'Upgrade to Pro'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <ProAccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVerify={verifyProAccess}
            />
        </>
    );
};

export default Header;
