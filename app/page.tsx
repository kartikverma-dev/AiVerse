'use client'
import Link from 'next/link'
import Nav from '@/components/ui/Nav'

const features = [
  { icon: '📚', title: 'Concept Library', desc: 'Every AI term with TL;DR, technical depth, beginner explanation, sources, and status.', href: '/concepts' },
  { icon: '🔗', title: 'Evolution Timeline', desc: 'See how ideas are born from others — Prompt Engineering → CoT → Context Engineering.', href: '/timeline' },
  { icon: '🕸️', title: 'Relationship Graph', desc: 'Interactive force graph connecting all concepts. Filter by status, category, or difficulty.', href: '/graph' },
  { icon: '📡', title: 'Relevance Tracker', desc: 'Evidence-based status: GitHub activity, paper mentions, community volume — updated weekly.', href: '/concepts' },
  { icon: '🏆', title: 'Source Hierarchy', desc: 'Every claim is cited. Ranked from official AI lab blogs down to community discussion.', href: '/concepts' },
  { icon: '📬', title: 'Weekly Digest', desc: 'New concepts, status changes, notable papers — one curated page every week.', href: '/digest' },
]

const statuses = [
  { label: '🌱 Emerging', desc: 'New, gaining traction', color: '#818cf8' },
  { label: '📈 Growing', desc: 'Rapid adoption', color: '#4ade80' },
  { label: '✅ Stable', desc: 'Mainstream, well-understood', color: '#60a5fa' },
  { label: '📉 Declining', desc: 'Being superseded', color: '#fbbf24' },
  { label: '📦 Historical', desc: 'Foundational context', color: '#71717a' },
]

export default function Home() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px' }}>
        {/* Hero */}
        <section style={{
          minHeight: '90vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '80px 24px',
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12), transparent)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '20px', padding: '5px 14px', marginBottom: '32px',
            fontSize: '12px', color: '#818cf8', fontWeight: 500,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            15 concepts live · Updated weekly
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700,
            lineHeight: 1.1, letterSpacing: '-0.03em',
            maxWidth: '800px', marginBottom: '24px',
            color: 'var(--text)',
          }}>
            Don't chase headlines.<br />
            <span style={{ color: 'var(--accent)' }}>Track the evolution</span> of ideas.
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-2)',
            maxWidth: '560px', marginBottom: '40px', lineHeight: 1.6,
          }}>
            A living knowledge graph for the AI ecosystem — tracking not just what terms mean,
            but how they were born, evolved, and whether they're worth your attention today.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/concepts" style={{
              padding: '12px 28px', background: 'var(--accent)', color: '#fff',
              borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '15px',
              border: 'none', cursor: 'pointer',
            }}>Explore concepts</Link>
            <Link href="/graph" style={{
              padding: '12px 28px', background: 'transparent', color: 'var(--text)',
              borderRadius: 'var(--radius)', fontWeight: 500, fontSize: '15px',
              border: '1px solid var(--border-strong)',
            }}>View knowledge graph</Link>
          </div>

          {/* Evolution preview */}
          <div style={{
            marginTop: '72px', display: 'flex', alignItems: 'center', gap: '0',
            flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px',
          }}>
            {['Prompt Engineering', 'Chain-of-Thought', 'Context Engineering', 'Loop Engineering'].map((t, i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '7px 14px', borderRadius: '20px',
                  background: i === 3 ? 'rgba(99,102,241,0.15)' : 'var(--bg-3)',
                  border: `1px solid ${i === 3 ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                  fontSize: '13px', color: i === 3 ? '#818cf8' : 'var(--text-2)',
                  fontWeight: i === 3 ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>{t}</div>
                {i < 3 && <div style={{ color: 'var(--text-3)', padding: '0 6px', fontSize: '16px' }}>→</div>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '12px' }}>
            Every concept shows its full lineage
          </p>
        </section>

        {/* Status system */}
        <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Evidence-based relevance</h2>
            <p style={{ color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto' }}>
              Not editorial opinion — status is determined by GitHub activity, paper mentions, and community volume.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {statuses.map(s => (
              <div key={s.label} style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{
          padding: '80px 24px', maxWidth: '1100px', margin: '0 auto',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>8 interconnected features</h2>
            <p style={{ color: 'var(--text-2)' }}>Signal over noise. Every feature serves one goal.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {features.map(f => (
              <Link key={f.title} href={f.href}>
                <div style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '24px', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: '100px 24px', textAlign: 'center',
          borderTop: '1px solid var(--border)',
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
            Built for the people who need signal
          </h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Developers, researchers, students, and educators who need to understand AI clearly — not just keep up.
          </p>
          <Link href="/concepts" style={{
            padding: '14px 32px', background: 'var(--accent)', color: '#fff',
            borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '16px',
            display: 'inline-block',
          }}>Start exploring →</Link>
        </section>

        <footer style={{
          borderTop: '1px solid var(--border)', padding: '24px',
          textAlign: 'center', color: 'var(--text-3)', fontSize: '13px',
        }}>
          AiVerse · Built with Next.js, Supabase, NVIDIA NIM · {new Date().getFullYear()}
        </footer>
      </main>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </>
  )
}
