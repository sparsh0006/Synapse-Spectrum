// src/pages/LandingPage.tsx
import React from 'react';
import Hero from '../components/landing/Hero';
import AboutSection from '../components/landing/AboutSection'; // Create this
import FeaturesSection from '../components/landing/FeaturesSection'; // Add this
// ... other section imports

export default function LandingPage() {
  return (
    <div className="bg-brand-deep-blue text-brand-light-text scroll-smooth"> {/* Added scroll-smooth */}
      {/* Navbar is rendered conditionally in App.tsx */}
      <Hero />
      <AboutSection /> {/* Make sure to create/fill this component */}
      <FeaturesSection />
      {/* Add other sections like HowItWorks, Timeline, FAQs, Contact/Footer */}
      <div className="text-center py-20">
        <p> Made with <span role="img" aria-label="love">❤️</span> in CodeCircuit Hackathon</p>
      </div>
    </div>
  );
}