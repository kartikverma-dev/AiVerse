import Link from 'next/link'
import type { Concept } from '@/types'

const statusEmoji: Record<string, string> = {
  emerging: '🌱', growing: '📈', stable: '✅', declining: '📉', historical: '📦'
}
const priorityLabel: Record<string, string> = {
  learn_now: 'Learn now', know_basics: 'Know basics',
  nice_to_know: 'Nice to know', historical: 'Historical'
}

export default function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link href={`/concepts/${concept.slug}`}>
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '20px', cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)'
          ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-3)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>
                {concept.name}
              </span>
              {concept.abbreviation && (
                <span style={{
                  fontSize: '11px', color: 'var(--text-3)',
                  fontFamily: 'monospace', background: 'var(--bg-4)',
                  padding: '1px 6px', borderRadius: '4px',
                }}>{concept.abbreviation}</span>
              )}
            </div>
          </div>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>{statusEmoji[concept.status]}</span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '14px' }}>
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
      </div>
    </Link>
  )
}
