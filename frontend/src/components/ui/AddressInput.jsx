// frontend/src/components/ui/AddressInput.jsx
import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const AddressInput = ({ className = '', placeholder = 'Enter address...' }) => {
    const { manualAddress, setAddress } = useLocation();
    const [inputAddress, setInputAddress] = useState(manualAddress || '');
    const [showInput, setShowInput] = useState(!!manualAddress);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputAddress.trim()) {
            setAddress(inputAddress);
        }
    };

    const clearAddress = () => {
        setInputAddress('');
        setAddress('');
        setShowInput(false);
    };

    if (!showInput) {
        return (
            <button
                onClick={() => setShowInput(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                <MapPin className="w-4 h-4 mr-2" />
                Enter Address Manually
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`flex w-full ${className}`}>
            <div className="relative flex-1">
                <input
                    type="text"
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-10 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                {inputAddress && (
                    <button
                        type="button"
                        onClick={() => setInputAddress('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <button
                type="submit"
                className="px-3 py-2 rounded-r-md bg-green-600 text-white hover:bg-green-700 flex items-center"
            >
                <Search className="w-4 h-4" />
            </button>
        </form>
    );
};

export default AddressInput;