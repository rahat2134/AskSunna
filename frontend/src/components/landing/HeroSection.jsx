/**
 * @fileoverview Hero section component for AskSunnah landing page.
 */
import React, { useState, useEffect } from 'react';
import { Shield, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = ({ isProUser }) => {
    const [activeImage, setActiveImage] = useState(0);
    const images = [
        '/assets/Banner-1.jpg',
        '/assets/Banner-2.jpg',
        '/assets/Banner-3.jpg',
        '/assets/Banner-4.jpg',
        '/assets/Banner-5.jpg',
        '/assets/Banner-6.jpg',
        '/assets/Banner-7.jpg'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="relative py-10 sm:py-20 bg-[url('/islamic-pattern.svg')] bg-repeat bg-opacity-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:flex lg:items-center lg:justify-between lg:space-x-8">
                    {/* Text Content */}
                    <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl xl:text-6xl">
                            Islamic Knowledge,{' '}
                            <span className="text-green-600 dark:text-green-500">Verified Sources</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl max-w-2xl mx-auto lg:mx-0">
                            Get authentic answers from the Quran, Hadith, and connect directly with qualified Islamic scholars.
                        </p>
                        <div className="mt-5 sm:flex sm:justify-center lg:justify-start md:mt-8">
                            <Link
                                to={isProUser ? "/chat" : "/demo"}
                                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                            >
                                Try Now
                            </Link>
                        </div>
                    </div>

                    {/* Image Section with Fade Transition */}
                    <div className="lg:w-1/2">
                        <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-lg overflow-hidden">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`${activeImage === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                        } absolute inset-0 transition-opacity duration-1000`}
                                >
                                    <img
                                        src={img}
                                        alt={`Islamic Scholar Consultation ${index + 1}`}
                                        className="w-full h-full object-cover object-center rounded-lg shadow-xl"
                                    />
                                </div>
                            ))}

                            {/* Navigation Dots */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${activeImage === index
                                                ? 'bg-green-600'
                                                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Feature Highlights */}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4 w-[90%] sm:w-full max-w-md z-20">
                                <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                                    <div className="flex items-center">
                                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">Verified Scholars</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Book className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1 sm:mr-2" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">Direct Consultation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;