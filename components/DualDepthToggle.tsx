'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type DepthMode = 'beginner' | 'technical';

interface DualDepthToggleProps {
  depth: DepthMode;
  onChange: (depth: DepthMode) => void;
  className?: string;
}

/**
 * Animated toggle switch between "Beginner" (🎓) and "Technical" (⚙️)
 * Featuring a sliding gradient pill (gold to violet) matching the design system
 */
export const DualDepthToggle: React.FC<DualDepthToggleProps> = ({ depth, onChange, className = "" }) => {
  return (
    <div className={`relative flex items-center p-1.5 rounded-full bg-white/[0.02] border border-white/10 w-fit ${className}`}>
      {/* Sliding pill */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full"
        style={{
          left: depth === 'beginner' ? '6px' : 'calc(50% + 2px)',
          width: 'calc(50% - 8px)',
          background: depth === 'beginner' 
            ? 'linear-gradient(135deg, #D9A85C 0%, #B88E4B 100%)' 
            : 'linear-gradient(135deg, #8B7CF6 0%, #6E5EE4 100%)',
        }}
        layout
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      />
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange('beginner');
        }}
        className={`relative z-10 flex items-center gap-2 px-4.5 py-2 rounded-full text-xs font-semibold font-mono tracking-wide transition-colors duration-300 ${
          depth === 'beginner' ? 'text-ink-navy font-bold' : 'text-neutral-400 hover:text-paper-cream'
        }`}
      >
        <span>🎓</span>
        <span>Beginner</span>
      </button>
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange('technical');
        }}
        className={`relative z-10 flex items-center gap-2 px-4.5 py-2 rounded-full text-xs font-semibold font-mono tracking-wide transition-colors duration-300 ${
          depth === 'technical' ? 'text-ink-navy font-bold' : 'text-neutral-400 hover:text-paper-cream'
        }`}
      >
        <span>⚙️</span>
        <span>Technical</span>
      </button>
    </div>
  );
};

interface DualDepthInlineProps {
  depth: DepthMode;
  onChange: (depth: DepthMode) => void;
  className?: string;
}

/**
 * Compact inline variant for cards or tight spaces
 */
export const DualDepthInline: React.FC<DualDepthInlineProps> = ({ depth, onChange, className = "" }) => {
  return (
    <div className={`relative flex items-center p-0.5 rounded-lg bg-white/[0.03] border border-white/5 w-fit ${className}`}>
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-md"
        style={{
          left: depth === 'beginner' ? '2px' : 'calc(50% + 1px)',
          width: 'calc(50% - 3px)',
          background: depth === 'beginner' 
            ? 'rgba(217, 168, 92, 0.15)' 
            : 'rgba(139, 124, 246, 0.15)',
        }}
        layout
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange('beginner');
        }}
        className={`relative z-10 flex items-center justify-center w-8 h-7 rounded-md text-[11px] font-mono transition-colors ${
          depth === 'beginner' ? 'text-signal-gold font-bold' : 'text-neutral-500 hover:text-neutral-300'
        }`}
        title="Beginner Explanations"
      >
        🎓
      </button>
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange('technical');
        }}
        className={`relative z-10 flex items-center justify-center w-8 h-7 rounded-md text-[11px] font-mono transition-colors ${
          depth === 'technical' ? 'text-contrast-violet font-bold' : 'text-neutral-500 hover:text-neutral-300'
        }`}
        title="Technical Details"
      >
        ⚙️
      </button>
    </div>
  );
};

interface DualDepthContentProps {
  depth: DepthMode;
  beginnerContent: React.ReactNode;
  technicalContent: React.ReactNode;
  className?: string;
}

/**
 * Container that manages crossfade and blur transitions between modes
 */
export const DualDepthContent: React.FC<DualDepthContentProps> = ({ 
  depth, 
  beginnerContent, 
  technicalContent,
  className = ""
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={depth}
        className={className}
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(8px)' }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
      >
        {depth === 'beginner' ? beginnerContent : technicalContent}
      </motion.div>
    </AnimatePresence>
  );
};
