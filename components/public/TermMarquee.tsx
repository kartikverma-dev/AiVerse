'use client'
import { motion } from 'framer-motion'

const ROW_1 = ['Transformer Architecture', 'Chain-of-Thought', 'Model Context Protocol', 'RAG Pipelines', 'Mixture of Experts', 'RLHF']
const ROW_2 = ['Agentic Loops', 'Constitutional AI', 'Vector Embeddings', 'Prompt Engineering', 'Tool Use', 'Context Windows', 'Vibe Coding']

function Row({ terms, reverse, speed }: { terms: string[]; reverse?: boolean; speed: number }) {
  const items = [...terms, ...terms]

  return (
    <div style={{ overflow: 'hidden', width: '100%' }} className="marquee-row">
      <motion.div
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '14px', width: 'max-content' }}
      >
        {items.map((term, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '9px 18px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            fontSize: '13px', color: 'var(--text-2)',
            fontWeight: 500, whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#34d399' : '#38bdf8',
              flexShrink: 0,
            }} />
            {term}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function TermMarquee() {
  return (
    <section style={{
      position: 'relative', padding: '56px 0',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-1)',
    }}>
      <div style={{
        maxWidth: '1180px', margin: '0 auto 28px', padding: '0 24px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Tracking the terms shaping AI right now
        </span>
      </div>
      <div style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        <Row terms={ROW_1} speed={32} />
        <Row terms={ROW_2} reverse speed={36} />
      </div>

      {/* Respect reduced motion purely via CSS — same DOM on server & client, no hydration mismatch */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .marquee-row > div { animation: none !important; transform: none !important; }
        }
      `}</style>
    </section>
  )
}
