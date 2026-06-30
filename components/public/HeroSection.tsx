'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stagger = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } } },
}

export default function HeroSection({ totalCount }: { totalCount: number }) {
  const [mounted, setMounted] = useState(false)
  const [activeCard, setActiveCard] = useState<number | null>(null)

  useEffect(() => setMounted(true), [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #0a0a14 0%, #050507 80%)',
      padding: '120px 24px 80px',
    }}>
      {/* Texture / vignette layers */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 35%, rgba(99,102,241,0.08) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        boxShadow: 'inset 0 0 160px 40px rgba(0,0,0,0.85)',
      }} />

      {/* Slowly drifting background grid */}
      <div 
        className="bg-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'gridDrift 28s linear infinite',
        }} 
      />

      {/* Floating high-end ambient glowing orbs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 20, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '20%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top badges & title content */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate={mounted ? 'show' : 'hidden'}
        style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '840px', width: '100%' }}
      >
        {/* Live concept tracker badge */}
        <motion.div variants={stagger.item} style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '24px', padding: '6px 14px',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ 
              position: 'relative',
              display: 'flex', 
              width: '7px', 
              height: '7px' 
            }}>
              <span style={{
                position: 'absolute',
                display: 'inline-flex',
                height: '100%',
                width: '100%',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                opacity: 0.75,
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }} />
              <span style={{
                position: 'relative',
                display: 'inline-flex',
                borderRadius: '50%',
                height: '7px',
                width: '7px',
                backgroundColor: '#34d399',
              }} />
            </span>
            <span style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.02em' }}>
              {totalCount} AI concepts tracked · live updates
            </span>
          </span>
        </motion.div>

        {/* Premium editorial headline */}
        <h1 style={{
          fontSize: 'clamp(44px, 8.5vw, 92px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          fontFamily: 'var(--font-heading)',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          <motion.span variants={stagger.item} style={{ display: 'block', color: 'var(--text)' }}>
            Born of
          </motion.span>
          <motion.span variants={stagger.item} className="gradient-text" style={{ display: 'block' }}>
            Evolution
          </motion.span>
        </h1>

        {/* Description paragraph */}
        <motion.p variants={stagger.item} style={{
          fontSize: 'clamp(15px, 1.6vw, 18px)',
          color: 'var(--text-2)',
          maxWidth: '560px',
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}>
          A living knowledge graph mapping the lineage, depth, and relevance of every AI concept as it emerges, matures, and shifts the industry.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={stagger.item} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}>
          <Link href="/concepts">
            <motion.span
              whileHover={{ scale: 1.03, boxShadow: '0 12px 36px rgba(99,102,241,0.45)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                color: 'white', borderRadius: '11px', fontWeight: 600, fontSize: '15px',
                boxShadow: '0 6px 24px rgba(99,102,241,0.25)',
                cursor: 'pointer',
              }}
            >
              Explore the library <span>→</span>
            </motion.span>
          </Link>
          <Link href="/graph">
            <motion.span
              whileHover={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.03)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', color: 'var(--text)', borderRadius: '11px',
                fontWeight: 500, fontSize: '15px', border: '1px solid var(--border-strong)',
                cursor: 'pointer',
              }}
            >
              View force graph
            </motion.span>
          </Link>
        </motion.div>

        {/* Upgraded Dashboard Cards Section */}
        <motion.div 
          variants={stagger.item}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            textAlign: 'left',
            marginTop: '20px',
            width: '100%',
          }}
        >
          {/* Card 1: Live Concept Flow (Pathways) */}
          <motion.div
            onClick={() => setActiveCard(activeCard === 0 ? null : 0)}
            whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(19,19,25,0.6)' }}
            style={{
              padding: '24px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'rgba(13,13,17,0.4)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Evolutionary Pathways
              </span>
              <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 500 }}>Active Flow</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
              Semantic Lineages
            </h3>
            
            {/* Visual Node Dotted Pathway */}
            <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              {/* Animated SVG Dotted Line */}
              <svg style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '4px', transform: 'translateY(-50%)', zIndex: 0 }}>
                <line 
                  x1="12" y1="2" x2="95%" y2="2" 
                  stroke="rgba(99,102,241,0.3)" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  style={{
                    animation: 'dashFlow 12s linear infinite'
                  }}
                />
              </svg>

              {['Attention', 'Transformer', 'LLM', 'Agents'].map((node, i) => (
                <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <motion.div 
                    animate={activeCard === 0 ? { scale: [1, 1.25, 1] } : {}}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    style={{
                      width: '10px', height: '10px',
                      borderRadius: '50%',
                      background: i === 3 ? '#34d399' : '#818cf8',
                      boxShadow: i === 3 ? '0 0 8px #34d399' : '0 0 8px #818cf8',
                    }}
                  />
                  <span style={{ fontSize: '8.5px', color: 'var(--text-2)', marginTop: '6px', fontWeight: 500 }}>
                    {node}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Ecosystem Status Distribution */}
          <motion.div
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
            whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(19,19,25,0.6)' }}
            style={{
              padding: '24px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'rgba(13,13,17,0.4)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Status Distribution
              </span>
              <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 500 }}>Healthy</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
              Maturity Levels
            </h3>

            {/* Visual stacked percentage bar */}
            <div style={{ height: '8px', borderRadius: '4px', display: 'flex', overflow: 'hidden', background: '#222', marginBottom: '12px' }}>
              <div style={{ width: '40%', background: '#818cf8' }} title="Emerging: 40%" />
              <div style={{ width: '30%', background: '#34d399' }} title="Growing: 30%" />
              <div style={{ width: '20%', background: '#38bdf8' }} title="Stable: 20%" />
              <div style={{ width: '10%', background: '#fbbf24' }} title="Declining: 10%" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-2)', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#818cf8' }} /> Emerging
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} /> Growing
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8' }} /> Stable
              </span>
            </div>
          </motion.div>

          {/* Card 3: Highlight Paradigm Shift */}
          <motion.div
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
            whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(19,19,25,0.6)' }}
            style={{
              padding: '24px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'rgba(13,13,17,0.4)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Featured Trend
              </span>
              <span style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 500 }}>Decline/Shift</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
              RLHF → DPO
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.4 }}>
              Preference alignment shifts from complex RL reward models towards direct preference optimization.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Explore Platform
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px', height: '24px',
            background: 'linear-gradient(to bottom, var(--text-3), transparent)',
          }}
        />
      </motion.div>

      <style>{`
        @keyframes dashFlow {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
