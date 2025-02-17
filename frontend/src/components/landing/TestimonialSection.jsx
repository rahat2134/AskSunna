import React, { useRef, useEffect, useState } from 'react';
import { Star, ArrowLeft, ArrowRight, Quote, Check } from 'lucide-react';

const testimonials = [
    {
      id: 1,
      name: "Sarah Ahmad",
      role: "Islamic Studies Student",
      avatar: "/assets/Testimonials/student-1.jpg",
      rating: 5,
      text: "AskSunnah has transformed my research methods. The verified sources help me cross-reference hadith for my studies.",
      location: "United Kingdom",
      highlightText: "Research Aid"
    },
    {
      id: 2,
      name: "Amina Hassan",
      role: "Religious Studies Student",
      avatar: "/assets/Testimonials/student-2.jpg",
      rating: 5,
      text: "Perfect for quick reference during my thesis writing. The source verification feature is invaluable.",
      location: "Canada",
      highlightText: "Quick Reference"
    },
    {
      id: 3,
      name: "Dr. Omar Hassan",
      role: "Medical Doctor",
      avatar: "/assets/Testimonials/Doctor-1.jpg",
      rating: 5,
      text: "As a busy physician, having instant access to verified Islamic knowledge helps me make time for learning between patients.",
      location: "UAE",
      highlightText: "Time-Efficient"
    },
    {
      id: 4,
      name: "Dr. Ahmed Malik",
      role: "Pediatrician",
      avatar: "/assets/Testimonials/doctor-2.jpg",
      rating: 5,
      text: "The app's clear sources help me explain Islamic medical ethics to my colleagues with confidence.",
      location: "USA",
      highlightText: "Medical Ethics"
    },
    {
      id: 5,
      name: "Dr. Yasir Ali",
      role: "Surgeon",
      avatar: "/assets/Testimonials/doctor-3.jpg",
      rating: 5,
      text: "Between surgeries, I can quickly find authentic hadith about healing and medicine. It's become my go-to resource.",
      location: "Pakistan",
      highlightText: "Medical Hadith"
    },

    {
      id: 7,
      name: "Zainab Ahmed",
      role: "Civil Engineer",
      avatar: "/assets/Testimonials/Engineer-2.jpg",
      rating: 5,
      text: "I appreciate how AskSunnah structures complex Islamic topics in an accessible way. Great for busy professionals.",
      location: "Malaysia",
      highlightText: "Structured Knowledge"
    },
    {
      id: 8,
      name: "Prof. Abdullah Rahman",
      role: "Islamic Studies Professor",
      avatar: "/assets/Testimonials/Professor-1.jpg",
      rating: 5,
      text: "I recommend AskSunnah to all my students. The source verification helps them learn proper research methodology.",
      location: "Australia",
      highlightText: "Academic Tool"
    },
    {
      id: 9,
      name: "Dr. Muhammad Usman",
      role: "University Professor",
      avatar: "/assets/Testimonials/professor-2.jpg",
      rating: 5,
      text: "An excellent resource for academic research in Islamic studies. The authenticated sources save valuable research time.",
      location: "UK",
      highlightText: "Research Aid"
    },
    {
      id: 10,
      name: "Aisha Mohammed",
      role: "Islamic Studies Teacher",
      avatar: "/assets/Testimonials/Teacher-1.jpg",
      rating: 5,
      text: "Makes lesson planning much easier. I can quickly find relevant verses and hadith for my classes.",
      location: "Canada",
      highlightText: "Teaching Aid"
    },
    {
      id: 12,
      name: "Maryam Abdullah",
      role: "Weekend Islamic School Teacher",
      avatar: "/assets/Testimonials/Teacher-4.jpg",
      rating: 5,
      text: "Perfect for preparing weekend Islamic school lessons. The verified sources give me confidence in what I teach.",
      location: "New Zealand",
      highlightText: "Verified Content"
    }
  ];

const TestimonialCard = ({ testimonial }) => (
    <div className="flex-shrink-0 w-[320px] md:w-[450px] relative group">
      <div className="h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
        {/* Card Header with Image */}
        <div className="aspect-[4/3] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Verified Badge */}
          <div className="absolute top-4 right-4 z-20 bg-green-500 rounded-full p-1.5">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
  
        {/* Card Content */}
        <div className="p-5">
          {/* User Info */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.role}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
          </div>
  
          {/* Testimonial Text */}
          <div className="relative">
            <Quote className="absolute -left-1 -top-2 h-6 w-6 text-green-500/20" />
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed pl-5">
              {testimonial.text}
            </p>
          </div>
  
          {/* Location */}
          <div className="mt-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">
              {testimonial.highlightText}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {testimonial.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  
  const TestimonialSection = () => {
    const scrollContainerRef = useRef(null);
    const [showControls, setShowControls] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
  
    // Check screen size on mount and resize
    useEffect(() => {
      const checkScreenSize = () => {
        setShowControls(window.innerWidth >= 768); // Show controls only on tablets and up
      };
  
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
  
    const scroll = (direction) => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
        
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    };
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollLeft;
        const cardWidth = container.offsetWidth;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setActiveIndex(newIndex);
      }
    };
  
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }, []);
  
    return (
      <section className="py-12 md:py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Muslims Worldwide
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of believers who rely on AskSunnah for authentic Islamic knowledge
            </p>
          </div>
  
          {/* Navigation Arrows and Testimonials Container */}
          <div className="relative">
            {/* Desktop Navigation Arrows */}
            {showControls && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all hidden md:block"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all hidden md:block"
                >
                  <ArrowRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}
  
            {/* Testimonials Container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 px-4 md:px-8 py-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="snap-center">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
  
            {/* Mobile Scroll Indicators */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-green-500 w-6' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const container = scrollContainerRef.current;
                      const scrollWidth = container.offsetWidth;
                      container.scrollTo({
                        left: scrollWidth * index,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default TestimonialSection;