/**
 * @fileoverview Scholar consultation booking section for AskSunnah.
 * 
 * Provides interface for browsing and booking Islamic scholar consultations with:
 * - Scholar profiles with expertise, ratings, and availability
 * - Consultation booking system with topic selection
 */
import React, { useState, useEffect } from 'react';
import { Shield, Calendar, UserCircle, Clock, Star, Book, Globe, Check, Calendar as CalendarIcon } from 'lucide-react';
import NavigationHeader from './chat/NavigationHeader';
import { useAuth } from '../context/AuthContext';
import ProAccessModal from './ui/ProAccessModal';


// Scholar availability slots (simulated)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

const Scholar = ({ scholar, onSelect, onUpgradeClick }) => {
  const { isProUser } = useAuth();

  const handleAction = (action) => {
    if (!isProUser) {
      onUpgradeClick();
      return;
    }
    if (action === 'book') {
      onSelect(scholar);
    } else {
      alert('This page is under construction!');
    }
  };

  const handleSlotClick = (slot) => {
    if (!isProUser) {
      onUpgradeClick();
      return;
    }
    onSelect(scholar, slot);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-4 sm:p-6">
        {/* Scholar Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar Section */}
          <div className="relative mx-auto sm:mx-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800">
              <img
                src={scholar.image}
                alt={scholar.name}
                className="w-full h-full object-cover"
              />
            </div>
            {scholar.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 ring-2 ring-white dark:ring-gray-800">
                <Shield className="w-3 h-3 text-white" />
              </div>
            )}
            {scholar.isOnline && (
              <div className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800" />
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {scholar.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {scholar.credentials}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{scholar.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {scholar.totalConsultations} consultations
              </span>
            </div>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="mt-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {scholar.expertise.map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {scholar.languages.join(" • ")}
          </span>
        </div>

        {/* Time Slots */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2 justify-center sm:justify-start">
            <Clock className="w-4 h-4 text-green-500" />
            Next Available Slots
          </h4>
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
            {scholar.nextSlots.slice(0, 6).map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotClick(slot)}
                className="px-2 py-1 text-xs rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col xs:flex-row gap-2">
          <button
            onClick={() => handleAction('book')}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            Book Consultation
          </button>
          <button
            onClick={() => handleAction('view')}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ scholar, selectedSlot, onClose, onConfirm }) => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Book Consultation with {scholar.name}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Selected Time
            </label>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{selectedSlot}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="e.g., Marriage, Prayer, Fasting"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Questions
            </label>
            <textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 h-32"
              placeholder="List your specific questions..."
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(topic, questions)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={!topic || !questions}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

const ScholarSection = () => {
  const [scholars, setScholars] = useState([]);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isProUser, verifyProAccess } = useAuth();
  const [showProModal, setShowProModal] = useState(false);

  const handleUpgradeClick = () => {
    setShowProModal(true);
  };

  useEffect(() => {
    // Simulated scholar data - replace with API call
    const loadScholars = async () => {
      const mockScholars = [
        {
          id: 1,
          name: "Dr. Ahmed Al-Qadri",
          credentials: "PhD Islamic Studies, Al-Azhar University",
          expertise: ["Fiqh", "Hadith Studies", "Islamic Finance"],
          rating: 4.9,
          totalConsultations: 1240,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-1.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Urdu"],
          profile: "#",
          institution: "Al-Azhar University"
        },
        {
          id: 2,
          name: "Dr. Sarah Rahman",
          credentials: "PhD in Islamic Law, International Islamic University",
          expertise: ["Women's Fiqh", "Family Law", "Modern Islamic Issues"],
          rating: 4.8,
          totalConsultations: 890,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-2.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Malay"],
          profile: "#",
          institution: "International Islamic University Malaysia"
        },
        {
          id: 3,
          name: "Sheikh Muhammad Ali",
          credentials: "Masters in Hadith Sciences, Islamic University of Madinah",
          expertise: ["Hadith Authentication", "Aqeedah", "Dawah"],
          rating: 4.9,
          totalConsultations: 1560,
          isVerified: true,
          isOnline: false,
          image: "/assets/Testimonials/Islamic-scholar-3.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Turkish"],
          profile: "#",
          institution: "Islamic University of Madinah"
        },
        {
          id: 4,
          name: "Dr. Yasin Abdullah",
          credentials: "PhD in Quranic Sciences, Al-Qarawiyyin University",
          expertise: ["Quran Tafsir", "Tajweed", "Arabic Language"],
          rating: 4.7,
          totalConsultations: 720,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-1.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "French"],
          profile: "#",
          institution: "Al-Qarawiyyin University"
        },
        {
          id: 5,
          name: "Dr. Fatima Al-Hashimi",
          credentials: "PhD in Islamic Finance, INCEIF",
          expertise: ["Islamic Finance", "Business Ethics", "Zakat"],
          rating: 4.8,
          totalConsultations: 950,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-4.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Malay"],
          profile: "#",
          institution: "INCEIF Global University"
        },
        {
          id: 6,
          name: "Sheikh Omar Hassan",
          credentials: "Masters in Comparative Fiqh, Al-Azhar University",
          expertise: ["Comparative Fiqh", "Muslim Minority Issues", "Youth Counseling"],
          rating: 4.6,
          totalConsultations: 680,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-5.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Somali"],
          profile: "#",
          institution: "Al-Azhar University"
        },
        {
          id: 7,
          name: "Dr. Ibrahim Mahmoud",
          credentials: "PhD in Usul al-Fiqh, International Islamic University",
          expertise: ["Usul al-Fiqh", "Islamic Jurisprudence", "Contemporary Fiqh"],
          rating: 4.9,
          totalConsultations: 1100,
          isVerified: true,
          isOnline: false,
          image: "/assets/Testimonials/Islamic-scholar-1.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Urdu"],
          profile: "#",
          institution: "International Islamic University Islamabad"
        },
        {
          id: 8,
          name: "Dr. Aisha Mohammad",
          credentials: "PhD in Islamic Psychology, International Islamic University",
          expertise: ["Islamic Psychology", "Family Counseling", "Youth Mentoring"],
          rating: 4.8,
          totalConsultations: 830,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-3.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Bengali"],
          profile: "#",
          institution: "International Islamic University Malaysia"
        },
        {
          id: 9,
          name: "Sheikh Abdul Rahman",
          credentials: "Masters in Islamic Studies, Umm Al-Qura University",
          expertise: ["Seerah", "Islamic History", "Character Development"],
          rating: 4.7,
          totalConsultations: 920,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-2.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic"],
          profile: "#",
          institution: "Umm Al-Qura University"
        },
        {
          id: 10,
          name: "Dr. Zainab Al-Alawi",
          credentials: "PhD in Quranic Exegesis, Al-Azhar University",
          expertise: ["Quran Interpretation", "Women's Studies", "Islamic Education"],
          rating: 4.9,
          totalConsultations: 1040,
          isVerified: true,
          isOnline: true,
          image: "/assets/Testimonials/Islamic-scholar-1.jpg",
          nextSlots: generateTimeSlots(),
          languages: ["English", "Arabic", "Indonesian"],
          profile: "#",
          institution: "Al-Azhar University"
        }
      ];

      setScholars(mockScholars);
      setLoading(false);
    };

    loadScholars();
  }, []);

  const handleSelect = (scholar, slot) => {
    setSelectedScholar(scholar);
    setSelectedSlot(slot);
  };

  const handleBooking = (topic, questions) => {
    // Implement booking logic
    console.log("Booking:", { scholar: selectedScholar, slot: selectedSlot, topic, questions });
    setSelectedScholar(null);
    setSelectedSlot(null);
  };

  const handleProAccess = (key) => {
    const isVerified = verifyProAccess(key);
    if (isVerified) {
      setShowProModal(false);
    }
    return isVerified;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader
        title="Talk to Scholars"
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="max-w-5xl mx-auto px-4 pt-4 relative z-10">
        {/* Stats Section */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="px-4 py-3 flex justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <UserCircle className="w-4 h-4" />
              {scholars.filter(s => s.isOnline).length} scholars online
            </span>
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              Available for consultation
            </span>
          </div>
        </div>

        {/* Pro Mode Banner*/}
        {!isProUser && (
          <div className="mb-6 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              You're in free mode. Upgrade to Pro to book consultations with scholars.
            </p>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4 px-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {filter === 'all'
            ? `Showing all ${scholars.length} scholars`
            : `Showing ${scholars.length} scholars in ${filter}`}
        </div>

        {/* Scholar Grid */}
        <div className="grid grid-cols-1 gap-4 pb-8">
          {scholars.map((scholar) => (
            <Scholar
              key={scholar.id}
              scholar={scholar}
              onSelect={handleSelect}
              onUpgradeClick={handleUpgradeClick}
            />
          ))}
        </div>

        {/* Booking Modal */}
        {selectedScholar && (
          <BookingModal
            scholar={selectedScholar}
            selectedSlot={selectedSlot}
            onClose={() => {
              setSelectedScholar(null);
              setSelectedSlot(null);
            }}
            onConfirm={handleBooking}
          />
        )}

        {/* Pro Access Modal - Add this */}
        <ProAccessModal
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
          onVerify={handleProAccess}
        />
      </div>
    </div>
  );
};

export default ScholarSection;