// In frontend/src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Router from './Router';
import RamadanButton from './components/ui/RamadanButton';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
}

function App() {
  // Only show the Ramadan button during certain months (Feb-April for testing)
  const currentMonth = new Date().getMonth();
  const showRamadanButton = currentMonth >= 1 && currentMonth <= 3; // Feb-Apr

  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Router />
            {showRamadanButton && <RamadanButton />}
          </Suspense>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;