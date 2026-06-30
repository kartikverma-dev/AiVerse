'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ConceptCard from './ConceptCard'
import type { Concept } from '@/types'

interface DigestItem {
  id?: string
  week_of: string
  entry_type: string
  summary: string
  concept?: { slug: string; name: string; status: string }
}

interface Props {
  latestConcepts: Concept[]
  recentDigestItems: DigestItem[]
  statusCounts: Record<string, number>
  statusColor: Record<string, string>
  statusEmoji: Record<string, string>
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
}

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 26
  const circ = 2 * Math.PI * r
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--bg-4)" strokeWidth="5" />
      <motion.circle
        cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        whileInView={{ strokeDashoffset: circ - (pct / 100) * circ }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
      />
    </svg>
  )
}

export default function AnimatedSections({
  latestConcepts,
  recentDigestItems,
  statusCounts,
  statusColor,
  statusEmoji,
}: Props) {
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1

  return (
    <>
      {/* ===== Status overview — horizontal ring cards ===== */}
      <section style={{
        maxWidth: '1180px', margin: '0 auto', padding: '90px 24px 70px',
        borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <motion.div variants={fadeUp} style={{
              display: 'inline-block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--accent)', background: 'var(--accent-dim)',
              padding: '5px 12px', borderRadius: '20px', marginBottom: '14px',
              fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-border)',
            }}>
              Relevance system
            </motion.div>
            <motion.h2 variants={fadeUp} style={{
              fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700,
              fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em', color: 'var(--text)',
            }}>
              Where every concept stands today
            </motion.h2>
          </div>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}
        >
          {[
            { status: 'stable', label: 'Stable', desc: 'Mainstream, adopted, well-integrated into standard stacks.' },
            { status: 'growing', label: 'Growing', desc: 'Accelerating adoption with wide tooling support.' },
            { status: 'emerging', label: 'Emerging', desc: 'Cutting-edge, just appearing in papers or repos.' },
            { status: 'declining', label: 'Declining', desc: 'Foundational, being replaced by newer methods.' },
          ].map(s => {
            const count = statusCounts[s.status] || 0
            const pct = Math.round((count / total) * 100)
            return (
              <motion.div
                key={s.status}
                variants={fadeUp}
                whileHover={{ y: -4, borderColor: 'var(--accent-border)' }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '22px',
                  display: 'flex', flexDirection: 'column', gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <ProgressRing pct={pct} color={statusColor[s.status]} />
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                      color: 'var(--text)',
                    }}>
                      {pct}%
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '17px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '2px', color: 'var(--text)' }}>
                      {s.label}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{count} terms</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.55, color: 'var(--text-2)' }}>
                  {s.desc}
                </p>
                <Link href={`/concepts?status=${s.status}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                  <motion.span
                    whileHover={{ x: 3 }}
                    style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, display: 'inline-block' }}
                  >
                    Explore →
                  </motion.span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ===== Dashboard Grid: Concepts + Digest ===== */}
      <section style={{
        maxWidth: '1180px', margin: '0 auto', padding: '60px 24px 100px',
        position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '44px' }}>
          {/* Latest concepts */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '18px' }}>✨</span>
                <h3 style={{ fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                  Recently added
                </h3>
              </div>
              <Link href="/concepts" style={{ textDecoration: 'none' }}>
                <motion.span whileHover={{ color: 'var(--accent)' }} style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  See all →
                </motion.span>
              </Link>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {latestConcepts.map((c, i) => (
                <motion.div key={c.id} variants={fadeUp}><ConceptCard concept={c} index={i} /></motion.div>
              ))}
            </div>
          </motion.div>

          {/* Digest feed */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '18px' }}>📡</span>
                <h3 style={{ fontSize: '19px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                  Activity feed
                </h3>
              </div>
              <Link href="/digest" style={{ textDecoration: 'none' }}>
                <motion.span whileHover={{ color: 'var(--accent)' }} style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 600, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                  See all →
                </motion.span>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '24px',
            }}>
              {recentDigestItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {recentDigestItems.map((item, idx) => (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                      style={{ display: 'flex', gap: '16px' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px', flexShrink: 0 }} />
                        {idx < recentDigestItems.length - 1 && (
                          <div style={{ width: '2px', flex: 1, background: 'var(--border)', minHeight: '48px', margin: '6px 0' }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: '24px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{item.week_of}</span>
                          <span style={{
                            fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em',
                            background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--text-2)',
                            padding: '1px 6px', borderRadius: '4px', fontWeight: 600, fontFamily: 'var(--font-mono)',
                          }}>{item.entry_type.replace('_', ' ')}</span>
                        </div>
                        <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text-2)', marginBottom: '8px' }}>{item.summary}</p>
                        {item.concept && (
                          <Link href={`/concepts/${item.concept.slug}`} style={{ textDecoration: 'none' }}>
                            <motion.span whileHover={{ color: 'var(--accent)' }} style={{ display: 'inline-block', fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                              View {item.concept.name} {statusEmoji[item.concept.status]}
                            </motion.span>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
                  No updates recorded this week.
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
