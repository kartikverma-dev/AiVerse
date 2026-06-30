'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, RotateCw, BookOpen } from 'lucide-react'
import type { Concept } from '@/types'

interface FlashcardModalProps {
  concepts: Concept[]
}

const statusEmoji: Record<string, string> = {
  emerging: '🌱', growing: '📈', stable: '✅', declining: '📉', historical: '📦'
}

export default function FlashcardModal({ concepts }: FlashcardModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  // Choose a random concept
  const selectRandomConcept = () => {
    if (!concepts || concepts.length === 0) return
    const randomIndex = Math.floor(Math.random() * concepts.length)
    setSelectedConcept(concepts[randomIndex])
    setIsFlipped(false)
  }

  useEffect(() => {
    // 1. Listen for open event
    const handleOpen = () => {
      selectRandomConcept()
      setIsOpen(true)
    };
    window.addEventListener('open-flashcard', handleOpen)

    // 2. Check if shown this session
    const hasShown = sessionStorage.getItem('aiverse-flashcard-shown')
    if (!hasShown && concepts.length > 0) {
      selectRandomConcept()
      setIsOpen(true)
      sessionStorage.setItem('aiverse-flashcard-shown', 'true')
    }

    return () => {
      window.removeEventListener('open-flashcard', handleOpen)
    }
  }, [concepts])

  if (!isOpen || !selectedConcept) return null

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5, 5, 7, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            zIndex: 101,
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Top Close Button (floating outside card) */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '-48px',
              right: '0',
              background: 'var(--bg-2)',
              border: '1px solid var(--border-strong)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-2)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-2)'}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* 3D Flashcard Section */}
          <div 
            style={{
              perspective: '1200px',
              width: '100%',
              height: '460px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* CARD FRONT FACE */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(99,102,241,0.05)',
                  overflow: 'hidden',
                }}
              >
                {/* Visual holographic glow effect */}
                <div style={{
                  position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '50%',
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Top header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '11px', fontWeight: 600, color: 'var(--accent-2)',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    <BookOpen size={12} /> Concept Flashcard
                  </span>
                  <span style={{ fontSize: '20px' }}>{statusEmoji[selectedConcept.status]}</span>
                </div>

                {/* Main Concept display */}
                <div style={{ textAlign: 'center', margin: '40px 0', position: 'relative', zIndex: 1 }}>
                  <h3 style={{
                    fontSize: 'clamp(28px, 6vw, 36px)',
                    fontWeight: 800,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1.15,
                    marginBottom: '12px',
                  }}>
                    {selectedConcept.name}
                  </h3>
                  {selectedConcept.abbreviation && (
                    <span style={{
                      fontSize: '13px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-4)', padding: '3px 8px', borderRadius: '6px',
                    }}>{selectedConcept.abbreviation}</span>
                  )}
                </div>

                {/* Card footer details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span className={`pill pill-${selectedConcept.status}`}>{selectedConcept.status}</span>
                    <span className={`pill pill-${selectedConcept.difficulty}`}>{selectedConcept.difficulty}</span>
                    {selectedConcept.categories?.slice(0, 1).map(c => (
                      <span key={c} style={{
                        fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-4)',
                        padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border)',
                      }}>{c}</span>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                    ✨ Click card to flip and learn
                  </div>
                </div>
              </div>

              {/* CARD BACK FACE */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'var(--bg-2)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(52,211,153,0.03)',
                  overflow: 'hidden',
                }}
              >
                {/* Visual glow on back face */}
                <div style={{
                  position: 'absolute', bottom: '-10%', right: '-10%', width: '120%', height: '50%',
                  background: 'radial-gradient(ellipse at 50% 100%, rgba(52,211,153,0.08) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Back top header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-heading)' }}>
                    {selectedConcept.name}
                  </span>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.04em' }}>Definition</span>
                </div>

                {/* Back body scroll container */}
                <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0', paddingRight: '4px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>TL;DR Summary</div>
                    <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--text)', fontWeight: 500 }}>
                      {selectedConcept.tldr}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Beginner Explanation</div>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-2)' }}>
                      {selectedConcept.definition_beginner}
                    </p>
                  </div>
                </div>

                {/* Back CTA Buttons */}
                <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                  <Link href={`/concepts/${selectedConcept.slug}`} style={{ flex: 1 }}>
                    <span 
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block', textAlign: 'center', padding: '10px 0',
                        background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                        color: 'white', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(99,102,241,0.15)',
                        cursor: 'pointer',
                      }}
                    >
                      Full Details →
                    </span>
                  </Link>

                  <button
                    onClick={selectRandomConcept}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--bg-3)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      color: 'var(--text-2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-4)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-3)';
                      e.currentTarget.style.color = 'var(--text-2)';
                    }}
                    title="Next random card"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick instructions underneath */}
          <div style={{ fontSize: '12.5px', color: 'var(--text-2)', textAlign: 'center' }}>
            <span>Stuck? Click card to flip. Or </span>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Skip to site
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
