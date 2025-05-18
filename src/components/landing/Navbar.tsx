// src/components/landing/Navbar.tsx
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // npm install framer-motion
import NeonButton from '../ui/NeonButton'; // Path: ../ui/NeonButton

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a
    href={href} // For scrolling to sections on the same page
    className="text-brand-light-text hover:text-neon-electric-blue transition-colors duration-300 px-3 py-2"
    onClick={(e) => {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    {children}
  </a>
);

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 py-3 px-6 bg-brand-deep-blue/80 backdrop-blur-md shadow-navbar-glow" // Ensure shadow-navbar-glow is in tailwind.config.js
    >
      <div className="container mx-auto flex justify-between items-center">
        <RouterLink to="/" className="text-2xl font-display text-glow-pink font-bold"> {/* Ensure font-display is in tailwind.config.js */}
          Mind<span className="text-neon-electric-blue">Flux</span> 3D
        </RouterLink>
        <div className="hidden md:flex items-center space-x-1">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          {/* <NavLink href="#faq">FAQs</NavLink> */}
        </div>
        <NeonButton
            onClick={() => navigate('/app')} // Navigate to the mind map app
            className="bg-submit-now-gradient text-sm !text-brand-deep-blue font-semibold shadow-neon-pink hover:opacity-90" // Ensure bg-submit-now-gradient is in tailwind.config.js
        >
          Launch App →
        </NeonButton>
      </div>
    </motion.nav>
  );
}