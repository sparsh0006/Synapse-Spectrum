// src/App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MindMapBuilderPage from './pages/MindMapBuilderPage';
import Navbar from './components/landing/Navbar';
import SplashCursor from './components/SplashCursor/SplashCursor'; // <-- IMPORT THE CURSOR EFFECT

function App() {
  const location = useLocation();
  const showNavbar = location.pathname === '/'; // Show Navbar only on landing page

  return (
    <>
      <SplashCursor /> {/* <<< --- RENDER THE CURSOR EFFECT COMPONENT HERE */}
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MindMapBuilderPage />} />
        {/* Optional: Add a 404 Not Found Page
        <Route path="*" element={<NotFoundPage />} />
        */}
      </Routes>
    </>
  );
}

export default App;