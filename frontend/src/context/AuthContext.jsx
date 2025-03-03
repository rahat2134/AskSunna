// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analytics';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isProUser, setIsProUser] = useState(false);
    const [user, setUser] = useState(null);

    const verifyProAccess = (key) => {
        if (key === 'admin123') {
            localStorage.setItem('auth_token', 'pro_access');
            localStorage.setItem('user_id', 'admin');
            setIsProUser(true);
            setUser({ id: 'admin' });
            toast.success('Pro access granted!');
            trackEvent(ANALYTICS_EVENTS.PRO_UPGRADED);
            return true;
        }
        return false;
    };

    useEffect(() => {
        // Check localStorage for auth token
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsProUser(true);
            setUser({ id: localStorage.getItem('user_id') });
        }
    }, []);

    const upgradeToPro = () => {
        // In real app, this would handle payment processing
        toast.error('Please subscribe to access Pro features');
        window.location.href = '/';  // Use window.location for simple redirects
    };

    const login = async (email, password) => {
        // Implement actual login logic here
        localStorage.setItem('auth_token', 'temp_token');
        localStorage.setItem('user_id', 'user_123');
        setIsProUser(true);
        setUser({ id: 'user_123' });
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        setIsProUser(false);
        setUser(null);
        window.location.href = '/';  // Use window.location for simple redirects
    };

    return (
        <AuthContext.Provider value={{
            isProUser,
            user,
            login,
            logout,
            upgradeToPro,
            verifyProAccess
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};