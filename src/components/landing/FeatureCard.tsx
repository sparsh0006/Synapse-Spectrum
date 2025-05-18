// src/components/landing/FeatureCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon?: React.ReactNode; // You can pass an SVG icon component or similar
  title: string;
  description: string;
  index: number; // For staggered animation
  bgColorClass?: string; // e.g. 'bg-card-gradient-1'
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15, // Stagger delay
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function FeatureCard({ icon, title, description, index, bgColorClass = "bg-neon-purple-indigo/20" }: FeatureCardProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // Trigger when 30% of card is visible
      variants={cardVariants}
      className={`p-6 md:p-8 rounded-xl shadow-xl border border-neon-electric-blue/20 backdrop-blur-sm h-full flex flex-col ${bgColorClass}`}
    >
      {icon && <div className="text-4xl text-neon-pink mb-4">{icon}</div>}
      <h3 className="text-xl md:text-2xl font-semibold text-neon-electric-blue mb-3">{title}</h3>
      <p className="text-brand-light-text/80 text-sm md:text-base flex-grow">{description}</p>
    </motion.div>
  );
}