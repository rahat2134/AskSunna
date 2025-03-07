/**
 * @fileoverview Data management for the Islamic scholar consultation feature.
 * Contains mock scholar profiles, time slot generation utilities, and
 * filtering functions. Separates data concerns from UI components and
 * provides structured access to scholar information and availability.
 */
export const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour}:00`);
        slots.push(`${hour}:30`);
    }
    return slots;
};

// Mock scholar data
export const getMockScholars = () => [
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

// Function to filter scholars by category
export const filterScholars = (scholars, filter) => {
    if (filter === 'all') return scholars;

    if (filter === 'online') {
        return scholars.filter(scholar => scholar.isOnline);
    }

    // Filter by expertise
    return scholars.filter(scholar =>
        scholar.expertise.some(exp =>
            exp.toLowerCase().includes(filter.toLowerCase())
        )
    );
};