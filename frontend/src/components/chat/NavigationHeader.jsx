import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavigationHeader = ({ title, currentFilter, onFilterChange }) => {
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(0);

    const images = [
        '/assets/Banner-1.jpg',
        '/assets/Banner-2.jpg',
        '/assets/Banner-3.jpg',
        '/assets/Banner-4.jpg',
        '/assets/Banner-5.jpg',
        '/assets/Banner-6.jpg',
        '/assets/Banner-7.jpg',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            {/* Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
                <div className="max-w-5xl mx-auto px-1 py-1 flex items-center">
                    <button
                        onClick={() => navigate('/chat')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-2 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Back</span>
                    </button>
                </div>
            </div>

            {/* Banner Section */}
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full overflow-hidden">
                {/* Image Slider */}
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${activeImage === index ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div className="absolute inset-0 bg-black/40" /> {/* Darker overlay */}
                        <img
                            src={img}
                            alt={`Islamic Scholar ${index + 1}`}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '50% 30%' }}
                        />
                    </div>
                ))}

                {/* Banner Content - Adjusted positioning */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pt-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 px-4">
                        Consult Islamic Scholars
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-center max-w-2xl px-4 text-gray-100">
                        Connect with verified scholars for guidance on Islamic matters
                    </p>
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`transition-all duration-300 rounded-full ${activeImage === index
                                ? 'w-4 h-2 bg-white'
                                : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Filter Section Container */}
            <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                    <div className="flex flex-wrap gap-2">
                        {["all", "online", "hadith", "fiqh", "finance"].map((filterType) => (
                            <button
                                key={filterType}
                                onClick={() => onFilterChange(filterType)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currentFilter === filterType
                                    ? "bg-green-600 text-white shadow-sm"
                                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    }`}
                            >
                                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationHeader;
