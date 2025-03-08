// frontend/src/Router.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SimpleChat from './components/SimpleChat';
import LandingPage from './components/landing/LandingPage';
import { useAuth } from './context/AuthContext';
import { ScholarSection } from './components/scholars';
import QiblaPage from './components/QiblaPage';
import RamadanTimesPage from './components/RamadanTimesPage';
import PrayerTimesPage from './components/prayer/PrayerTimesPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isProUser } = useAuth();

  if (!isProUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={
        <ProtectedRoute>
          <SimpleChat />
        </ProtectedRoute>
      } />
      <Route path="/demo" element={<SimpleChat />} />
      <Route path="/scholars" element={<ScholarSection />} />
      <Route path="/qibla" element={<QiblaPage />} />
      <Route path="/ramadan" element={<RamadanTimesPage />} />
      <Route path="/prayers" element={<PrayerTimesPage />} />
    </Routes>
  );
};

export default Router;