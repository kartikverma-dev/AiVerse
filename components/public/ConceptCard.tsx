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

export default function ConceptCard({
  concept,
  index = 0,
  isComparing = false,
  isSelectedForCompare = false,
  onToggleCompare,
}: {
  concept: Concept
  index?: number
  isComparing?: boolean
  isSelectedForCompare?: boolean
  onToggleCompare?: () => void
}) {
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
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '20px', cursor: 'pointer', overflow: 'hidden',
          }}
          className="concept-card-hoverable"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '11px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                  {concept.name}
                </span>
                {concept.abbreviation && (
                  <span style={{
                    fontSize: '11px', color: 'var(--text-2)', fontFamily: 'var(--font-mono)',
                    background: 'var(--bg-3)', padding: '2px 7px', borderRadius: '4px',
                    border: '1px solid var(--border)',
                  }}>{concept.abbreviation}</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {isComparing && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleCompare?.()
                  }}
                  style={{
                    background: isSelectedForCompare ? 'var(--accent-dim)' : 'var(--bg-3)',
                    border: '1px solid ' + (isSelectedForCompare ? 'var(--accent-border)' : 'var(--border)'),
                    color: isSelectedForCompare ? 'var(--accent)' : 'var(--text-3)',
                    padding: '3px 8px', borderRadius: '4px', fontSize: '10px',
                    fontFamily: 'var(--font-mono)', cursor: 'pointer',
                    transition: 'all 0.15s',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '9px' }}>{isSelectedForCompare ? '✓' : '+'}</span> Compare
                </button>
              )}
              <span style={{ fontSize: '20px' }}>{statusEmoji[concept.status]}</span>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: '1.65', marginBottom: '15px' }}>
            {concept.tldr}
          </p>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '11px', alignItems: 'center' }}>
            <span className={`pill pill-${concept.status}`}>{concept.status}</span>
            <span className={`pill pill-${concept.difficulty}`}>{concept.difficulty}</span>
            {concept.categories?.map(c => (
              <span key={c} style={{
                fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)',
                padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border)',
              }}>{c}</span>
            ))}
            <span style={{
              marginLeft: 'auto', fontSize: '10px', color: 'var(--accent)', background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)', padding: '2px 7px', borderRadius: '4px', fontWeight: 600
            }}>🧠 Quiz</span>
          </div>
        </motion.div>
      </Link>
      <style>{`
        .concept-card-hoverable::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: var(--radius);
          padding: 1px;
          background: linear-gradient(135deg, rgba(212,175,55,0), rgba(212,175,55,0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: background 0.25s;
          pointer-events: none;
        }
        .concept-card-hoverable:hover::before {
          background: linear-gradient(135deg, rgba(212,175,55,0.4), rgba(212,175,55,0.1));
        }
        .concept-card-hoverable:hover {
          background: var(--bg-3);
        }
      `}</style>
    </motion.div>
  )
}
