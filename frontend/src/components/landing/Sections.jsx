/**
 * @fileoverview Collection of landing page section components including:
 * StatsSection with key metrics, FAQSection with common questions,
 * and ContactSection with support information.
 */
import React from 'react';

export const StatsSection = () => (
  <section className="py-16 bg-green-50 dark:bg-green-900/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">500+</div>
          <div className="mt-2 text-gray-600 dark:text-gray-400">Hadith Sources</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">1000+</div>
          <div className="mt-2 text-gray-600 dark:text-gray-400">Daily Users</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">99%</div>
          <div className="mt-2 text-gray-600 dark:text-gray-400">Accuracy Rate</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">24/7</div>
          <div className="mt-2 text-gray-600 dark:text-gray-400">Availability</div>
        </div>
      </div>
    </div>
  </section>
);

export const FAQSection = () => {
  const faqs = [
    {
      question: "How accurate are the answers?",
      answer: "All answers are sourced directly from the Quran and authenticated Hadith collections. Our AI system ensures responses are backed by verified references."
    },
    {
      question: "What sources do you use?",
      answer: "We use the Quran and authentic Hadith collections (Sahih al-Bukhari, Sahih Muslim, etc.). Each answer includes specific references to these sources."
    },
    {
      question: "Can I trust the AI's interpretation?",
      answer: "Our AI provides references but doesn't interpret Islamic law. For detailed religious rulings, we recommend consulting qualified scholars."
    },
    {
      question: "What's the difference between Free and Pro?",
      answer: "Pro users get unlimited questions, priority support, and advanced features like source filtering and saving answers. Free users have access to basic Q&A functionality."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection = () => (
  <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Need Help?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Our team is here to help you with any questions about AskSunnah.
        </p>
        <a
          href="mailto:asksunnah786@gmail.com"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Contact Support
        </a>
      </div>
    </div>
  </section>
);