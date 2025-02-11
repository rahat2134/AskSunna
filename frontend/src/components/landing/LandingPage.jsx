import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Shield, Search, Database, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NavHeader from './NavHeader';
import { StatsSection, FAQSection, ContactSection } from './Sections';
import ScrollToTop from '../ui/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import NewsletterSection from './NewsletterSection';
import LoadingOverlay from '../ui/LoadingOverlay';

const Feature = ({ icon: Icon, title, description }) => (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const PricingTier = ({ name, price, features, popular, buttonText, buttonLink }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg ${popular ? 'ring-2 ring-green-500' : ''}`}>
        <div className="p-6">
            {popular && (
                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 rounded-full mb-4">
                    Most Popular
                </span>
            )}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h3>
            <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <Check className="h-6 w-6 text-green-500 flex-shrink-0" />
                        <span className="ml-3 text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>
                ))}
            </ul>
            <Link
                to={buttonLink}
                className={`mt-8 block w-full px-6 py-3 text-center text-sm font-semibold rounded-md ${popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                    }`}
            >
                {buttonText}
            </Link>
        </div>
    </div>
);

const LandingPage = () => {
    const { isProUser } = useAuth();
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme === 'dark' ||
                (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
    };


    const features = [
        {
            icon: Shield,
            title: "Verified Sources",
            description: "All answers are backed by authenticated Quran verses and Hadith references"
        },
        {
            icon: Search,
            title: "Smart Search",
            description: "Advanced AI technology to find relevant Islamic knowledge instantly"
        },
        {
            icon: Database,
            title: "Extensive Database",
            description: "Access to a growing collection of Quran verses and authentic Hadiths"
        }
    ];

    const pricingTiers = [
        {
            name: "Free",
            price: "0",
            features: [
                "Basic Islamic Q&A",
                "Limited daily questions",
                "Access to common queries",
                "Basic source verification"
            ],
            buttonText: "Start Free",
            buttonLink: "/demo"
        },
        {
            name: "Pro",
            price: "9.99",
            popular: true,
            features: [
                "Unlimited questions | Custom collections",
                "Priority response time",
                "Advanced source filtering",
                "Detailed explanations",
                "Save favorite answers",
                "Download conversation"
            ],
            buttonText: "Get Pro Access",
            buttonLink: "/chat"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavHeader isDark={isDark} toggleDarkMode={toggleDarkMode} />
            <Toaster position="top-center" />

            <div className="pt-16">
                {/* Hero Section */}
                <section className="relative py-20 bg-[url('/islamic-pattern.svg')] bg-repeat bg-opacity-5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                Islamic Knowledge,{' '}
                                <span className="text-green-600 dark:text-green-500">Verified Sources</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                Get authentic answers from the Quran and Hadith with our AI-powered Islamic knowledge assistant.
                            </p>
                            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                                <Link
                                    to={isProUser ? "/chat" : "/demo"}
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                                >
                                    Try Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Why Choose AskSunnah?
                            </h2>
                            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Our platform combines advanced technology with authentic Islamic sources to provide reliable answers to your questions.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Feature key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <StatsSection />

                {/* Pricing Section */}
                <section id="pricing" className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Choose the plan that best fits your needs. All plans include access to our AI-powered Islamic knowledge assistant.
                            </p>
                        </div>
                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                            {pricingTiers.map((tier, index) => (
                                <PricingTier key={index} {...tier} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <FAQSection />

                <NewsletterSection />

                {/* Contact Section */}
                <ContactSection />

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p>© 2025 AskSunnah. All rights reserved.</p>
                        </div>
                        <div className="mt-4 flex justify-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                Terms of Service
                            </a>
                            <Link to="/demo" className="text-gray-400 hover:text-gray-500">
                                Try Demo
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
            <ScrollToTop />
        </div>
    );
};

export default LandingPage;