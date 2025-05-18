// src/components/landing/FeaturesSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
// Example: Using simple text for icons, ideally replace with actual SVG icons
const Icon3D = () => <span role="img" aria-label="3D Cube">🧊</span>;
const IconNeon = () => <span role="img" aria-label="Neon Glow">✨</span>;
const IconShare = () => <span role="img" aria-label="Share">📤</span>;

export default function FeaturesSection() {
  const features = [
    { icon: <Icon3D />, title: "Immersive 3D Space", description: "Navigate and build your mind maps in a fully interactive 3D environment." },
    { icon: <IconNeon />, title: "Vibrant Neon Aesthetics", description: "A visually stunning interface with glowing elements and neon gradients to spark creativity." },
    { icon: <IconShare />, title: "Easy Node Management", description: "Intuitive controls for adding, linking, editing, and organizing your ideas effortlessly." },
    { title: "Task Integration", description: "Turn ideas into actionable tasks with descriptions, statuses, and due dates right within your nodes." },
    { title: "Customizable Layouts", description: "Choose between dynamic force-directed graphs or structured tree layouts to suit your needs." },
    { title: "Export & Share", description: "Save your mind maps as images to share your brilliant ideas with others." },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-brand-deep-blue relative">
      <div className="absolute inset-0 bg-[url('./assets/grid-bg.png')] opacity-[0.02] bg-repeat pointer-events-none -z-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-display font-bold text-center mb-16 text-glow-blue"
        >
          Core <span className="text-neon-pink">Features</span>
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bgColorClass='bg-card-gradient-1' // Example gradient from tailwind.config.js
            />
          ))}
        </div>
      </div>
    </section>
  );
}