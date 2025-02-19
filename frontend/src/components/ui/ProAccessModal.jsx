import React, { useState } from 'react';
import { X, Instagram, Key } from 'lucide-react';

const ProAccessModal = ({ isOpen, onClose, onVerify }) => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const isVerified = onVerify(key);
        
        if (isVerified) {
            setKey('');
            onClose();
        } else {
            setError('Invalid key. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Enter Pro Access Key
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Social Media Info */}
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Instagram className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h3 className="font-medium text-green-800 dark:text-green-200">
                            Get Your Access Key
                        </h3>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        Follow us <a 
                            href="https://instagram.com/asksunnah" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium underline"
                        >
                            @asksunnah
                        </a> on Instagram and DM us for your exclusive Pro access key!
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="Enter your access key"
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProAccessModal;