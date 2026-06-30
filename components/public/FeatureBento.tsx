'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

function MiniGraph() {
  return (
    <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, opacity: 0.9 }}>
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[[40,30],[100,20],[160,45],[70,70],[140,80]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" opacity="0.8" />
      ))}
      <line x1="40" y1="30" x2="100" y2="20" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      <line x1="100" y1="20" x2="160" y2="45" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      <line x1="40" y1="30" x2="70" y2="70" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      <line x1="70" y1="70" x2="140" y2="80" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      <line x1="160" y1="45" x2="140" y2="80" stroke="var(--accent)" strokeWidth="1" opacity="0.25" />
      <circle cx="100" cy="50" r="40" fill="url(#g1)" />
    </svg>
  )
}

function MiniTimeline() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ width: '100%', position: 'relative' }}>
        <div style={{ height: '2px', background: 'var(--border-strong)', borderRadius: '2px' }} />
        {[0.1, 0.35, 0.62, 0.88].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: `${p * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '8px', height: '8px', borderRadius: '50%',
            background: i === 2 ? 'var(--accent)' : 'var(--bg-4)',
            border: i === 2 ? '2px solid var(--bg-1)' : 'none',
          }} />
        ))}
      </div>
    </div>
  )
}

function MiniPriority() {
  const rows = [
    { w: '85%', c: 'var(--accent)' },
    { w: '60%', c: 'var(--accent-2)' },
    { w: '40%', c: 'var(--text-3)' },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '0 22px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--bg-4)', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: r.w }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ height: '100%', background: r.c, borderRadius: '3px' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const cards = [
  {
    title: 'Lineage tracing',
    desc: 'Trace exactly which idea spawned which — full evolutionary chains from prompt engineering to autonomous agents.',
    span: 'large',
    visual: <MiniGraph />,
    href: '/graph',
  },
  {
    title: 'Weekly digest',
    desc: 'A curated pulse of what changed in the AI ecosystem this week, sourced and cited.',
    span: 'small',
    visual: null,
    href: '/digest',
    icon: '📡',
  },
  {
    title: 'Relevance scoring',
    desc: 'Every concept ranked by adoption stage — know what to learn now vs. what to skip.',
    span: 'small',
    visual: <MiniPriority />,
    href: '/concepts',
  },
  {
    title: 'Historical timeline',
    desc: 'Watch terms rise, peak, and get superseded across the timeline of modern AI.',
    span: 'large',
    visual: <MiniTimeline />,
    href: '/timeline',
  },
]

export default function FeatureBento() {
  return (
    <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 24px 100px', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <motion.div variants={fadeUp} style={{
          display: 'inline-block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--accent)', background: 'var(--accent-dim)',
          padding: '5px 12px', borderRadius: '20px', marginBottom: '16px',
          fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-border)',
        }}>
          What you get
        </motion.div>
        <motion.h2 variants={fadeUp} style={{
          fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700,
          fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em', marginBottom: '12px',
          color: 'var(--text)',
        }}>
          One map of the entire AI landscape
        </motion.h2>
        <motion.p variants={fadeUp} style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '520px', margin: '0 auto' }}>
          Stop piecing together blog posts and tweets. See how every concept connects.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}
        className="bento-grid"
      >
        {cards.map((c, i) => (
          <Link key={i} href={c.href} style={{ gridColumn: c.span === 'large' ? 'span 2' : 'span 1' }} className="bento-link">
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: 'var(--accent-border)' }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'relative', overflow: 'hidden',
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '26px',
                height: '230px', display: 'flex', flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              {c.visual && (
                <div style={{ position: 'absolute', inset: 0, opacity: 0.9 }}>{c.visual}</div>
              )}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, var(--bg-2) 25%, transparent 75%)',
              }} />
              <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                {c.icon && <div style={{ fontSize: '22px', marginBottom: '10px' }}>{c.icon}</div>}
                <h3 style={{
                  fontSize: '19px', fontWeight: 700, marginBottom: '8px',
                  fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em',
                  color: 'var(--text)',
                }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.55, maxWidth: '380px' }}>
                  {c.desc}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <style>{`
        .bento-link { text-decoration: none; color: inherit; display: block; }
        @media (max-width: 800px) {
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid > a { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  )
}
