import { Variants } from 'framer-motion';

// Custom Easing
export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Fade in and lift up
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: EASE } 
  }
};

// Pure fade in
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.5, ease: EASE } 
  }
};

// Scale in
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.5, ease: EASE } 
  }
};

// Slide in from left
export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: EASE } 
  }
};

// Slide in from right
export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: EASE } 
  }
};

// Stagger child elements
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Lifecycle pulse variants for each status
export const lifecyclePulse = {
  emerging: {
    scale: [1, 1.15, 1],
    opacity: [0.7, 1, 0.7],
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  },
  growing: {
    scale: [1, 1.08, 1],
    opacity: [0.8, 1, 0.8],
    transition: { 
      duration: 1.5, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  },
  stable: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0 }
  },
  declining: {
    scale: [1, 0.95, 1],
    opacity: [1, 0.4, 1],
    transition: { 
      duration: 3, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  },
  historical: {
    scale: 1,
    opacity: 0.6,
    transition: { duration: 0 }
  }
};

// Card Hover spring effect
export const cardHover: Variants = {
  initial: { 
    y: 0, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)" 
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Page Transition standard layout
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: EASE } 
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: { duration: 0.3, ease: EASE } 
  }
};
