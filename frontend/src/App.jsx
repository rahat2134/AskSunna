// In frontend/src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Router from './Router';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Router />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;