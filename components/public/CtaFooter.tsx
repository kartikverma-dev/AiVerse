'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CtaFooter() {
  return (
    <>
      {/* CTA band */}
      <section style={{ position: 'relative', padding: '0 24px 100px', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            maxWidth: '1100px', margin: '0 auto',
            position: 'relative', overflow: 'hidden',
            borderRadius: '24px', padding: '64px 40px',
            background: 'var(--cta-bg)',
            border: '1px solid var(--cta-border)',
            textAlign: 'center',
          }}
        >
          {/* Ambient glow inside the card */}
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -15, 10, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
              width: '420px', height: '420px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
              filter: 'blur(70px)', pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, marginBottom: '14px',
              fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em',
              color: 'var(--cta-text)',
            }}>
              Stop chasing headlines.<br />
              <span className="gradient-text">Start tracking the evolution.</span>
            </h2>
            <p style={{ color: 'var(--cta-text-2)', fontSize: '15px', maxWidth: '460px', margin: '0 auto 32px' }}>
              Free, weekly, and built for people who want signal — not hype.
            </p>
            <Link href="/concepts">
              <motion.span
                whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(99,102,241,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 30px',
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  color: 'white', borderRadius: '11px', fontWeight: 600, fontSize: '15px',
                  boxShadow: '0 6px 24px rgba(99,102,241,0.35)',
                }}
              >
                Browse the library <span>→</span>
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '48px 24px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '26px', height: '26px',
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: '#fff',
            }}>AV</div>
            <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>AiVerse</span>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { href: '/concepts', label: 'Concepts' },
              { href: '/timeline', label: 'Timeline' },
              { href: '/graph', label: 'Graph' },
              { href: '/digest', label: 'Digest' },
            ].map(l => (
              <Link key={l.href} href={l.href}>
                <motion.span
                  whileHover={{ color: 'var(--text)' }}
                  style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}
                >
                  {l.label}
                </motion.span>
              </Link>
            ))}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            Built with Next.js, Supabase, NVIDIA NIM · {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </>
  )
}
