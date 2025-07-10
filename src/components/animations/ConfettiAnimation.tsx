"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export interface ConfettiAnimationProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  trigger = false,
  duration = 3000,
  particleCount = 50,
  colors = ["#ec4899", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"],
  size = "md",
  className = "",
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const sizeConfig = useMemo(
    () => ({
      sm: { min: 4, max: 8 },
      md: { min: 6, max: 12 },
      lg: { min: 8, max: 16 },
    }),
    []
  );

  const createParticle = useCallback(
    (id: number): Particle => {
      const sizeRange = sizeConfig[size];
      return {
        id,
        x: Math.random() * 100, // Percentage
        y: -10, // Start above viewport
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
        velocityX: (Math.random() - 0.5) * 4, // Horizontal velocity
        velocityY: Math.random() * 2 + 1, // Vertical velocity
        gravity: Math.random() * 0.1 + 0.05, // Gravity effect
      };
    },
    [colors, size, sizeConfig]
  );

  const createConfetti = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(i));
    }
    setParticles(newParticles);
    setIsActive(true);

    // Clean up after duration
    setTimeout(() => {
      setIsActive(false);
      setParticles([]);
    }, duration);
  }, [particleCount, duration, createParticle]);

  useEffect(() => {
    if (trigger) {
      createConfetti();
    }
  }, [trigger, createConfetti]);

  if (!isActive) return null;

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: `${particle.x}vw`,
              y: "-10vh",
              rotate: particle.rotation,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: `${particle.x + particle.velocityX * 10}vw`,
              y: "110vh",
              rotate: particle.rotation + 720,
              scale: [0, 1, 1, 0.8],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: duration / 1000,
              ease: "easeOut",
              times: [0, 0.1, 0.8, 1],
            }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Composant de confettis spécialisé pour les célébrations
export const CelebrationConfetti: React.FC<{ trigger: boolean }> = ({
  trigger,
}) => (
  <ConfettiAnimation
    trigger={trigger}
    duration={4000}
    particleCount={100}
    size="lg"
    colors={[
      "#ec4899",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#3b82f6",
      "#8b5cf6",
      "#ef4444",
    ]}
  />
);

// Composant de confettis pour l'ajout au panier
export const CartConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => (
  <ConfettiAnimation
    trigger={trigger}
    duration={2000}
    particleCount={30}
    size="md"
    colors={["#ec4899", "#f97316", "#eab308"]}
  />
);

// Composant de confettis pour les commandes
export const OrderConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => (
  <ConfettiAnimation
    trigger={trigger}
    duration={5000}
    particleCount={150}
    size="lg"
    colors={["#22c55e", "#10b981", "#059669", "#047857"]}
  />
);

export { ConfettiAnimation };
