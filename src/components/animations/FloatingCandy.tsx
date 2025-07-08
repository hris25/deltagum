"use client";

import { motion } from "framer-motion";
import React from "react";

export interface FloatingCandyProps {
  emoji?: string;
  size?: "sm" | "md" | "lg" | "xl";
  x?: number; // Position X en pourcentage (0-100)
  y?: number; // Position Y en pourcentage (0-100)
  delay?: number;
  duration?: number;
  amplitude?: number; // Amplitude du mouvement
  className?: string;
  style?: React.CSSProperties;
}

const FloatingCandy: React.FC<FloatingCandyProps> = ({
  emoji = "🍭",
  size = "md",
  x = 50,
  y = 50,
  delay = 0,
  duration = 4,
  amplitude = 20,
  className = "",
  style = {},
}) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
    xl: "text-8xl",
  };

  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${sizeClasses[size]} ${className}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        ...style,
      }}
      initial={{
        y: 0,
        x: 0,
        rotate: 0,
        scale: 0.8,
        opacity: 0.7,
      }}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        x: [-amplitude / 2, amplitude / 2, -amplitude / 2],
        rotate: [0, 10, -10, 0],
        scale: [0.8, 1.1, 0.9, 1],
        opacity: [0.7, 1, 0.8, 0.9],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
        times: [0, 0.33, 0.66, 1],
      }}
    >
      {emoji}
    </motion.div>
  );
};

// Composant pour créer plusieurs bonbons flottants
export interface FloatingCandyFieldProps {
  candies?: Array<{
    emoji: string;
    x: number;
    y: number;
    delay?: number;
    size?: "sm" | "md" | "lg" | "xl";
  }>;
  className?: string;
}

export const FloatingCandyField: React.FC<FloatingCandyFieldProps> = ({
  candies = [
    { emoji: "🍭", x: 10, y: 20, delay: 0, size: "md" },
    { emoji: "🍬", x: 80, y: 15, delay: 0.5, size: "lg" },
    { emoji: "🧁", x: 15, y: 70, delay: 1, size: "sm" },
    { emoji: "🍰", x: 85, y: 75, delay: 1.5, size: "md" },
    { emoji: "🎂", x: 50, y: 10, delay: 2, size: "xl" },
    { emoji: "🍪", x: 70, y: 60, delay: 2.5, size: "lg" },
  ],
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {candies.map((candy, index) => (
        <FloatingCandy
          key={index}
          emoji={candy.emoji}
          x={candy.x}
          y={candy.y}
          delay={candy.delay}
          size={candy.size}
        />
      ))}
    </div>
  );
};

// Composants prédéfinis pour différents contextes
export const HeroFloatingCandies: React.FC = () => (
  <FloatingCandyField
    candies={[
      { emoji: "🍭", x: 10, y: 20, delay: 0, size: "lg" },
      { emoji: "🍬", x: 85, y: 15, delay: 0.8, size: "md" },
      { emoji: "🧁", x: 15, y: 75, delay: 1.2, size: "xl" },
      { emoji: "🍰", x: 90, y: 80, delay: 1.8, size: "sm" },
      { emoji: "🎂", x: 50, y: 5, delay: 2.2, size: "lg" },
      { emoji: "🍪", x: 75, y: 55, delay: 2.8, size: "md" },
    ]}
  />
);

export const ProductFloatingCandies: React.FC = () => (
  <FloatingCandyField
    candies={[
      { emoji: "🍓", x: 5, y: 30, delay: 0, size: "md" },
      { emoji: "🫐", x: 95, y: 25, delay: 1, size: "sm" },
      { emoji: "🍏", x: 8, y: 80, delay: 2, size: "lg" },
      { emoji: "🍭", x: 92, y: 75, delay: 3, size: "md" },
    ]}
  />
);

export const CheckoutFloatingCandies: React.FC = () => (
  <FloatingCandyField
    candies={[
      { emoji: "✨", x: 20, y: 20, delay: 0, size: "sm" },
      { emoji: "🎉", x: 80, y: 25, delay: 0.5, size: "md" },
      { emoji: "💫", x: 25, y: 75, delay: 1, size: "sm" },
      { emoji: "🌟", x: 75, y: 80, delay: 1.5, size: "lg" },
    ]}
  />
);

// Hook pour contrôler les animations de bonbons
export const useCandyAnimation = () => {
  const [isPlaying, setIsPlaying] = React.useState(true);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const toggle = () => setIsPlaying(!isPlaying);

  return { isPlaying, play, pause, toggle };
};

export { FloatingCandy };
