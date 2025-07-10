"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useMemo, useRef } from "react";

export interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number; // Vitesse du parallaxe (0.1 = lent, 1 = normal, 2 = rapide)
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  offset?: [number, number]; // Offset de début et fin pour le parallaxe
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
  offset = [0, 1],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculer la transformation basée sur la direction
  const range = 100 * speed;
  const transformUp = useTransform(scrollYProgress, offset, [range, -range]);
  const transformDown = useTransform(scrollYProgress, offset, [-range, range]);
  const transformLeft = useTransform(scrollYProgress, offset, [range, -range]);
  const transformRight = useTransform(scrollYProgress, offset, [-range, range]);

  const transform = useMemo(() => {
    switch (direction) {
      case "up":
        return transformUp;
      case "down":
        return transformDown;
      case "left":
        return transformLeft;
      case "right":
        return transformRight;
      default:
        return transformUp;
    }
  }, [direction, transformUp, transformDown, transformLeft, transformRight]);

  const getStyle = () => {
    switch (direction) {
      case "up":
      case "down":
        return { y: transform };
      case "left":
      case "right":
        return { x: transform };
      default:
        return { y: transform };
    }
  };

  return (
    <div ref={ref} className={className}>
      <motion.div style={getStyle()}>{children}</motion.div>
    </div>
  );
};

// Composant pour les éléments de background parallaxe
export interface ParallaxBackgroundProps {
  layers?: Array<{
    content: React.ReactNode;
    speed: number;
    zIndex?: number;
    className?: string;
  }>;
  className?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  layers = [],
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Créer les transformations pour chaque layer en dehors de la boucle
  const layerTransforms = useMemo(
    () =>
      layers.map((layer) =>
        useTransform(scrollYProgress, [0, 1], [0, -100 * layer.speed])
      ),
    [layers, scrollYProgress]
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {layers.map((layer, index) => {
        const y = layerTransforms[index];
        return (
          <motion.div
            key={index}
            className={`absolute inset-0 ${layer.className || ""}`}
            style={{
              y,
              zIndex: layer.zIndex || index,
            }}
          >
            {layer.content}
          </motion.div>
        );
      })}
    </div>
  );
};

// Composant pour les images parallaxe
export interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  overlayClassName?: string;
  overlay?: React.ReactNode;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  speed = 0.5,
  className = "",
  overlayClassName = "",
  overlay,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="absolute inset-0 scale-110" // Scale pour éviter les espaces blancs
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>

      {overlay && (
        <div className={`relative z-10 ${overlayClassName}`}>{overlay}</div>
      )}
    </div>
  );
};

// Composant pour les textes avec effet parallaxe
export interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  stagger?: boolean;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  speed = 0.3,
  className = "",
  stagger = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  if (stagger && React.isValidElement(children)) {
    // Pour les textes avec effet de décalage par mot/lettre
    return (
      <div ref={ref} className={className}>
        <motion.div style={{ y, opacity }} className="inline-block">
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
};

// Hook pour créer des effets parallaxe personnalisés
export const useParallax = (
  speed: number = 0.5,
  offset: [number, number] = [0, 1]
) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, offset, [100 * speed, -100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return { ref, y, opacity, scrollYProgress };
};

export { ParallaxSection };
