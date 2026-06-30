'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Concept } from '@/types'

const statusEmoji: Record<string, string> = {
  emerging: '🌱', growing: '📈', stable: '✅', declining: '📉', historical: '📦'
}
const priorityLabel: Record<string, string> = {
  learn_now: 'Learn now', know_basics: 'Know basics',
  nice_to_know: 'Nice to know', historical: 'Historical'
}

export default function ConceptCard({ concept, index = 0 }: { concept: Concept; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <Link href={`/concepts/${concept.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'relative', background: 'var(--bg-2)',
            border: '1px solid var(--border)', borderRadius: '14px',
            padding: '20px', cursor: 'pointer', overflow: 'hidden',
          }}
          className="concept-card-hoverable"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '11px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                  {concept.name}
                </span>
                {concept.abbreviation && (
                  <span style={{
                    fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-4)', padding: '1px 6px', borderRadius: '4px',
                  }}>{concept.abbreviation}</span>
                )}
              </div>
            </div>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{statusEmoji[concept.status]}</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.55', marginBottom: '15px' }}>
            {concept.tldr}
          </p>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`pill pill-${concept.status}`}>{concept.status}</span>
            <span className={`pill pill-${concept.difficulty}`}>{concept.difficulty}</span>
            <span className={`pill pill-${concept.learning_priority}`}>
              {priorityLabel[concept.learning_priority]}
            </span>
            {concept.categories?.slice(0, 2).map(c => (
              <span key={c} style={{
                fontSize: '11px', color: 'var(--text-3)',
                background: 'var(--bg-4)', padding: '2px 7px',
                borderRadius: '4px', border: '1px solid var(--border)',
              }}>{c}</span>
            ))}
          </div>
        </motion.div>
      </Link>
      <style>{`
        .concept-card-hoverable::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(129,140,248,0), rgba(129,140,248,0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: background 0.25s;
          pointer-events: none;
        }
        .concept-card-hoverable:hover::before {
          background: linear-gradient(135deg, rgba(129,140,248,0.5), rgba(99,102,241,0.1));
        }
        .concept-card-hoverable:hover {
          background: var(--bg-3);
        }
      `}</style>
    </motion.div>
  )
}
