
/**
 * Service to manage scholar bookings using localStorage
 */
export class BookingManager {
    constructor() {
        this.BOOKINGS_KEY = 'asksunnah_bookings';
        this.MESSAGES_KEY = 'asksunnah_scholar_messages';
    }

    // Get all bookings for current user
    getBookings() {
        const bookings = localStorage.getItem(this.BOOKINGS_KEY);
        return bookings ? JSON.parse(bookings) : [];
    }

    // Save a new booking
    saveBooking(scholarId, slot, topic, questions) {
        const bookings = this.getBookings();
        const booking = {
            id: `booking_${Date.now()}`,
            scholarId,
            slot,
            topic,
            questions,
            status: 'scheduled', // scheduled, ongoing, completed, cancelled
            createdAt: new Date().toISOString(),
            messages: [],
        };

        bookings.push(booking);
        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
        return booking;
    }

    // Get a specific booking by ID
    getBooking(bookingId) {
        const bookings = this.getBookings();
        return bookings.find(booking => booking.id === bookingId);
    }

    // Update booking status
    updateBookingStatus(bookingId, status) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(booking => booking.id === bookingId);

        if (index !== -1) {
            bookings[index].status = status;
            localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
            return true;
        }
        return false;
    }

    // Get messages for a booking
    getMessages(bookingId) {
        const allMessages = localStorage.getItem(this.MESSAGES_KEY);
        const messagesMap = allMessages ? JSON.parse(allMessages) : {};
        return messagesMap[bookingId] || [];
    }

    // Add a message to a booking
    addMessage(bookingId, sender, content) {
        const allMessages = localStorage.getItem(this.MESSAGES_KEY);
        const messagesMap = allMessages ? JSON.parse(allMessages) : {};

        if (!messagesMap[bookingId]) {
            messagesMap[bookingId] = [];
        }

        const message = {
            id: `msg_${Date.now()}`,
            sender,
            content,
            timestamp: new Date().toISOString()
        };

        messagesMap[bookingId].push(message);
        localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messagesMap));
        return message;
    }

    // Delete a booking
    deleteBooking(bookingId) {
        const bookings = this.getBookings();
        const filteredBookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(filteredBookings));

        // Also clean up messages
        const allMessages = localStorage.getItem(this.MESSAGES_KEY);
        if (allMessages) {
            const messagesMap = JSON.parse(allMessages);
            delete messagesMap[bookingId];
            localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messagesMap));
        }

        return true;
    }

    // Generate automatic scholar response (for demo purposes)
    generateScholarResponse(topic, question) {
        const responses = {
            "Prayer": "Prayer (Salah) is one of the five pillars of Islam. The Prophet (ﷺ) said: 'Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, performing the prayers, paying Zakat, making the pilgrimage to the House, and fasting in Ramadan.' (Sahih al-Bukhari 8)",
            "Fasting": "Fasting in Ramadan is obligatory for every adult Muslim who is physically and mentally capable. The Prophet (ﷺ) said: 'Whoever fasts during Ramadan out of sincere faith and hoping to attain Allah's rewards, then all his past sins will be forgiven.' (Sahih al-Bukhari 38)",
            "Marriage": "Marriage is strongly recommended in Islam. The Prophet (ﷺ) said: 'O young men, whoever among you can afford to get married, let him do so, for it is more effective in lowering the gaze and guarding chastity.' (Sahih al-Bukhari 5066)",
            "Finance": "In Islamic finance, interest (Riba) is prohibited. Allah says in the Quran: 'Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan into insanity.' (Quran 2:275)",
            "Zakat": "Zakat is obligatory charity and one of the five pillars of Islam. It is due on wealth that has been in one's possession for one lunar year and is above a certain threshold (nisab).",
            "Hajj": "Hajj is obligatory once in a lifetime for those who are physically and financially able. The Prophet (ﷺ) said: 'Whoever performs Hajj for Allah's pleasure and does not have sexual relations with his wife, and does not do evil or sins then he will return (after Hajj free from all sins) as if he were born anew.' (Sahih al-Bukhari 1521)"
        };

        // Generate a relevant response based on topic
        let response = "Thank you for your question. ";

        // Find a relevant topic
        const relevantTopic = Object.keys(responses).find(key =>
            topic.toLowerCase().includes(key.toLowerCase()) ||
            question.toLowerCase().includes(key.toLowerCase())
        );

        if (relevantTopic) {
            response += responses[relevantTopic];
        } else {
            response += "Based on Islamic teachings, I recommend seeking knowledge with sincere intention. The Prophet Muhammad (ﷺ) said: 'Seeking knowledge is an obligation upon every Muslim.' (Sunan Ibn Majah)";
        }

        response += "\n\nIs there anything specific about this topic you'd like me to elaborate on?";

        return response;
    }
}

export default new BookingManager();