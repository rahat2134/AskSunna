import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NavHeader = ({ isDark, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  };

  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">AskSunnah</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 dark:text-gray-300 hover:text-green-600">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 dark:text-gray-300 hover:text-green-600">Pricing</button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-600 dark:text-gray-300 hover:text-green-600">FAQ</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 dark:text-gray-300 hover:text-green-600">Contact</button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Link
              to={isProUser ? "/chat" : "/demo"}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Try Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-2 space-y-2">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600">Contact</button>
              <div className="flex items-center justify-between py-2">
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