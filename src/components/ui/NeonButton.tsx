// src/components/ui/NeonButton.tsx
import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColorClass?: string; // e.g., 'shadow-neon-blue'
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  className = '',
  glowColorClass = 'shadow-neon-blue', // Default glow
  ...props
}) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-md font-semibold
        text-neon-light-yellow 
        bg-neon-orange-gold-gradient
        hover:opacity-90 active:opacity-80 transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-neon-pink focus:ring-opacity-75
        disabled:opacity-50 disabled:cursor-not-allowed
        ${glowColorClass ? `shadow-md hover:${glowColorClass}` : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;