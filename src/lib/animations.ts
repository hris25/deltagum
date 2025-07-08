// Configurations d'animations pour Framer Motion

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4 },
};

export const slideLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4 },
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.4 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3 },
};

export const scaleOut = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3 },
};

export const bounce = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0.3 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

// Animations spécifiques pour les saveurs
export const flavorHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

export const flavorTap = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

export const flavorSelect = {
  scale: [1, 1.1, 1],
  transition: { duration: 0.3 },
};

// Animations pour le panier
export const cartItemAdd = {
  initial: { opacity: 0, x: -20, scale: 0.8 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

export const cartBadgePulse = {
  scale: [1, 1.2, 1],
  transition: { duration: 0.3 },
};

// Animations pour les modales
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// Animations pour les notifications
export const notificationSlide = {
  initial: { opacity: 0, x: 300 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 300,
    transition: { duration: 0.2 },
  },
};

// Animations pour les boutons
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const buttonLoading = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
};

// Animations pour les éléments flottants
export const floatingCandy = {
  initial: { y: 0, x: 0, rotate: 0, scale: 0.8, opacity: 0.7 },
  animate: {
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    rotate: [-5, 5, -5],
    scale: [0.8, 1.1, 0.9, 1],
    opacity: [0.7, 1, 0.8, 0.9],
  },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const parallaxSlow = {
  y: [0, -50],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  },
};

export const parallaxFast = {
  y: [0, -100],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  },
};

// Animations pour les confettis
export const confettiPiece = {
  y: [0, 300],
  x: [-50, 50],
  rotate: [0, 360],
  transition: {
    duration: 2,
    ease: "easeOut",
  },
};

// Animations spécifiques au Hero
export const heroTitle = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const heroSubtitle = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3,
      ease: "easeOut",
    },
  },
};

export const heroButton = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.6,
      ease: "easeOut",
    },
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Easings personnalisés
export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
};
