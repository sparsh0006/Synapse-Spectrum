// src/components/landing/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion'; // Keep framer-motion for other animations
import { useNavigate } from 'react-router-dom';
import NeonButton from '../ui/NeonButton';
import Minimal3DShape from './Minimal3DShape';

export default function Hero() {
  const navigate = useNavigate();

  const heroSubtitle = "Build dynamic, interconnected mind maps with a stunning neon aesthetic. Perfect for brainstorming, planning, and creative thinking.";

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-10 bg-brand-deep-blue">
      {/* Decorative 3D elements */}
      <div className="absolute top-[5%] left-[5%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-20 md:opacity-30">
        <Minimal3DShape shapeColor="#ff5ecb" />
      </div>
      <div className="absolute bottom-[5%] right-[5%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-20 md:opacity-30 transform rotate-45">
        <Minimal3DShape shapeColor="#7df9ff" />
      </div>
      
      <div className="container mx-auto text-center relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
        >
          <span className="text-glow-pink">Visualize</span> Your Ideas in
          <span className="block text-neon-electric-blue">3D Neon Space</span>
        </motion.h1>

        {/* Static text instead of Typewriter */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="text-md md:text-lg text-brand-light-text/80 mb-12 max-w-xl md:max-w-2xl mx-auto"
        >
            {heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
        >
          <NeonButton
            onClick={() => navigate('/app')}
            className="text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 bg-submit-now-gradient !text-brand-deep-blue font-bold shadow-lg shadow-neon-pink/60 hover:opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Launch Mind Map Builder →
          </NeonButton>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[url('./assets/grid-bg.png')] opacity-[0.03] bg-repeat pointer-events-none -z-10"></div>
    </section>
  );
}