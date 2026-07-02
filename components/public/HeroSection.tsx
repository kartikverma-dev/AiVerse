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
      background: 'var(--hero-bg)',
      padding: '120px 24px 80px',
    }}>
      {/* Texture / vignette layers */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 35%, var(--hero-orb-1) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        boxShadow: 'var(--hero-vignette)',
      }} />

      {/* Slowly drifting background grid */}
      <div 
        className="bg-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
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
          background: 'radial-gradient(circle, var(--hero-orb-1) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, var(--hero-orb-2) 0%, transparent 70%)',
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
            background: 'var(--hero-badge-bg)', border: '1px solid var(--hero-badge-border)',
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
                backgroundColor: 'var(--success)',
                opacity: 0.75,
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }} />
              <span style={{
                position: 'relative',
                display: 'inline-flex',
                borderRadius: '50%',
                height: '7px',
                width: '7px',
                backgroundColor: 'var(--success)',
              }} />
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {totalCount} AI concepts tracked · archive active
            </span>
          </span>
        </motion.div>

        {/* Premium editorial headline */}
        <h1 style={{
          fontSize: 'clamp(32px, 8.5vw, 92px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          fontFamily: 'var(--font-heading)',
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
          fontSize: 'clamp(16.5px, 1.8vw, 19.5px)',
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
              whileHover={{ scale: 1.02, background: 'var(--accent-soft)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px',
                background: 'var(--accent)',
                color: 'var(--bg-1)', borderRadius: '11px', fontWeight: 600, fontSize: '15px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              Explore the library <span>→</span>
            </motion.span>
          </Link>
          <Link href="/graph">
            <motion.span
              whileHover={{ borderColor: 'var(--accent)', background: 'var(--accent-dim)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', color: 'var(--text)', borderRadius: '11px',
                fontWeight: 500, fontSize: '15px', border: '1px solid var(--border-strong)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              View force graph
            </motion.span>
          </Link>
        </motion.div>

        {/* Upgraded Dashboard Cards Section */}
        <motion.div 
          variants={stagger.item}
          className="hero-dashboard-grid"
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
            whileHover={{ y: -6, borderColor: 'var(--accent-border)', background: 'var(--bg-2)' }}
            className="hero-card"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Evolutionary Pathways
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent-2)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Active Flow</span>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              Semantic Lineages
            </h3>
            
            {/* Visual Node Dotted Pathway */}
            <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              {/* Animated SVG Dotted Line */}
              <svg style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '4px', transform: 'translateY(-50%)', zIndex: 0 }}>
                <line 
                  x1="12" y1="2" x2="95%" y2="2" 
                  stroke="var(--accent)" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  style={{
                    animation: 'dashFlow 12s linear infinite',
                    opacity: 'var(--line-opacity)',
                  }}
                />
              </svg>

              {['Attention', 'Transformer', 'LLM', 'Agents'].map((node, i) => (
                <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <motion.div 
                    animate={activeCard === 0 ? { scale: [1, 1.25, 1] } : {}}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    style={{
                      width: '9px', height: '9px',
                      borderRadius: '50%',
                      background: i === 3 ? 'var(--success)' : 'var(--accent)',
                      border: '2px solid var(--bg-1)',
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-2)', marginTop: '6px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {node}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Ecosystem Status Distribution */}
          <motion.div
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
            whileHover={{ y: -6, borderColor: 'var(--accent-border)', background: 'var(--bg-2)' }}
            className="hero-card"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Status Distribution
              </span>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Healthy</span>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              Maturity Levels
            </h3>

            {/* Visual stacked percentage bar */}
            <div style={{ height: '8px', borderRadius: '4px', display: 'flex', overflow: 'hidden', background: 'var(--bg-4)', marginBottom: '12px' }}>
              <div style={{ width: '40%', background: 'var(--emerging)' }} title="Emerging: 40%" />
              <div style={{ width: '30%', background: 'var(--growing)' }} title="Growing: 30%" />
              <div style={{ width: '20%', background: 'var(--stable)' }} title="Stable: 20%" />
              <div style={{ width: '10%', background: 'var(--declining)' }} title="Declining: 10%" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerging)' }} /> Emerging
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--growing)' }} /> Growing
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--stable)' }} /> Stable
              </span>
            </div>
          </motion.div>

          {/* Card 3: Highlight Paradigm Shift */}
          <motion.div
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
            whileHover={{ y: -6, borderColor: 'var(--accent-border)', background: 'var(--bg-2)' }}
            className="hero-card"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.3s, background-color 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Featured Trend
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Paradigm Shift</span>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '6px', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              RLHF → DPO
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: 1.5 }}>
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
        @media (max-width: 768px) {
          .hero-dashboard-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            padding: 8px 16px 20px !important;
            margin-top: 16px !important;
            gap: 16px !important;
            width: calc(100% + 48px) !important;
            margin-left: -24px !important;
            scrollbar-width: none !important;
          }
          .hero-dashboard-grid::-webkit-scrollbar {
            display: none !important;
          }
          .hero-card {
            min-width: 280px !important;
            max-width: 280px !important;
            flex-shrink: 0 !important;
            scroll-snap-align: center !important;
            padding: 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
