/**
 * @fileoverview Navigation header component for AskSunnah landing page.
 * Provides responsive navigation with mobile menu toggle, section links,
 * tools dropdown, theme switching, and conditional pro feature access.
 * Includes smooth scroll functionality and visual indicators for premium features.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Moon, Sun, Menu, X, ChevronDown, Compass, Sparkles, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NavHeader = ({ isDark, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  const { isProUser } = useAuth();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
    setShowAdvancedMenu(false);
  };

  const PremiumLink = ({ children }) => (
    <div className="relative group">
      {children}
      <span className="absolute -top-3 -right-3 px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full">
        PRO
      </span>
    </div>
  );

  const NotificationDot = () => (
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500">
        <span className="absolute whitespace-nowrap text-[10px] font-medium text-white bg-green-600 px-2 py-0.5 rounded-full -right-1 top-4 transform translate-x-full">
          Talk to Scholars
        </span>
      </span>
    </span>
  );

  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">AskSunnah</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 dark:text-gray-300 hover:text-green-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 dark:text-gray-300 hover:text-green-600"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 dark:text-gray-300 hover:text-green-600"
            >
              FAQ
            </button>

            {/* Advanced Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Tools
                <ChevronDown className="h-4 w-4" />
              </button>

              {showAdvancedMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <Link
                    to="/qibla"
                    onClick={() => setShowAdvancedMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Compass className="h-4 w-4" />
                    Find Qibla Direction
                  </Link>
                  <Link
                    to="/ramadan"
                    onClick={() => setShowAdvancedMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Calendar className="h-4 w-4" />
                    Ramadan Calendar
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 dark:text-gray-300 hover:text-green-600"
            >
              Contact
            </button>

            <PremiumLink>
              <Link
                to="/scholars"
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 font-medium"
              >
                Talk to Scholars
              </Link>
            </PremiumLink>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            >
              {!isMenuOpen && <NotificationDot />}
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-2 space-y-2">
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                FAQ
              </button>

              {/* Tools Section in Mobile Menu */}
              <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tools</div>
                <Link
                  to="/qibla"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
                >
                  <Compass className="h-4 w-4" />
                  Find Qibla Direction
                </Link>
                <Link
                  to="/ramadan"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
                >
                  <Calendar className="h-4 w-4" />
                  Ramadan Calendar
                </Link>
              </div>

              <Link
                to="/scholars"
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 font-medium"
              >
                Talk to Scholars
                <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full">
                  PRO
                </span>
              </Link>

              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600"
              >
                Contact
              </button>

              <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link
                  to={isProUser ? "/chat" : "/demo"}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavHeader;