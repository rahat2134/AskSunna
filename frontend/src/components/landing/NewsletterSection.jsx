// frontend/src/components/landing/NewsletterSection.jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Thank you for subscribing!');
            setEmail('');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <section className="py-16 bg-green-50 dark:bg-green-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Stay Updated with Islamic Knowledge
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                        Subscribe to our newsletter for weekly insights, Quranic verses, and authentic Hadiths.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 px-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        <span>Subscribe</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;