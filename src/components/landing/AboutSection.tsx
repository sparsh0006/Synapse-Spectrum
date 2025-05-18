// src/components/landing/AboutSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Minimal3DShape from './Minimal3DShape'; // Optional decorative element

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.5 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-brand-deep-blue/60 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute -top-20 -left-20 w-72 h-72 opacity-10">
        <Minimal3DShape shapeColor="#8A2BE2" />
      </div>
       <div className="absolute -bottom-20 -right-20 w-60 h-60 opacity-10 transform rotate-12">
        <Minimal3DShape shapeColor="#fcf6bd" />
      </div>
      <div className="absolute inset-0 bg-[url('./assets/grid-bg.png')] opacity-[0.02] bg-repeat pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-6 md:px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-center mb-12 md:mb-16"
          >
            About The <span className="text-glow-pink">Mind Map</span> Builder
          </motion.h2>

          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl md:text-4xl font-semibold text-neon-electric-blue mb-6 leading-tight">
                Some people brainstorm. <br />
                <span className="text-brand-light-text">You build connections.</span>
              </h3>
              <ul className="space-y-4 text-brand-light-text/80 text-lg">
                <motion.li variants={itemVariants} className="flex items-start">
                  <span className="text-neon-pink text-2xl mr-3 mt-1">→</span> {/* Simple arrow or use an icon */}
                  <span>
                    <strong>Visualize Potential:</strong> For those who see complex ideas and know how to bring them to life in 3D.
                  </span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start">
                  <span className="text-neon-pink text-2xl mr-3 mt-1">→</span>
                  <span>
                    <strong>Unlock Creativity:</strong> Dream up something fresh, map out intricate details, and watch your thoughts materialize.
                  </span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start">
                  <span className="text-neon-pink text-2xl mr-3 mt-1">→</span>
                  <span>
                    <strong>Dynamic & Immersive:</strong> Experience a fluid, engaging way to interact with information, far beyond static diagrams.
                  </span>
                </motion.li>
              </ul>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-neon-purple-indigo/30 p-6 md:p-8 rounded-xl shadow-2xl border border-neon-pink/30 aspect-video flex items-center justify-center min-h-[300px] md:min-h-[350px]"
            >
              {/* Placeholder for a more complex 3D visual or an animated GIF/video of your app */}
              <Minimal3DShape 
                className="w-48 h-48 md:w-64 md:h-64 opacity-90" // Slightly increased opacity for better visibility
                shapeColor="#ff5ecb" // Changed to your neon pink color
              />
              {/* <p className="text-center text-brand-light-text/70">
                [Visual representation of the mind map in action could go here - e.g., a more complex `Minimal3DShape` instance or an animated GIF]
              </p> */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}