'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import type { DigestEntry } from '@/types'

const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  new_concept: { label: 'New concept', color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
  status_change: { label: 'Status change', color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
  notable_paper: { label: 'Notable paper', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
  framework_release: { label: 'Framework release', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
}

export default function AdminDigestPage() {
  const [entries, setEntries] = useState<DigestEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetch('/api/digest')
      .then(r => r.json())
      .then(d => setEntries(d.entries || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const byWeek: Record<string, DigestEntry[]> = {}
  entries.forEach(e => {
    if (!byWeek[e.week_of]) byWeek[e.week_of] = []
    byWeek[e.week_of].push(e)
  })
  const weeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a))

  async function sendDigest() {
    setSending(true)
    // In production: call /api/digest/send which uses Resend
    await new Promise(r => setTimeout(r, 1500))
    setSending(false); setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const fmt = (d: string) => { try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) } catch { return d } }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '760px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Weekly digest</h1>
            <button onClick={sendDigest} disabled={sending} style={{
              padding: '8px 18px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontSize: '13px',
              fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, fontFamily: 'inherit',
            }}>
              {sending ? 'Sending…' : sent ? '✓ Sent!' : '✉ Send digest'}
            </button>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: '14px', marginBottom: '28px' }}>Review and send this week's digest via Resend.</p>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div>
          ) : weeks.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-2)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>◉</div>
              <p>No digest entries yet. They'll appear after the weekly pipeline runs.</p>
            </div>
          ) : (
            weeks.map((week, wi) => (
              <div key={week} style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Week of {fmt(week)}</h2>
                  {wi === 0 && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Latest</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {byWeek[week].map(entry => {
                    const t = TYPE_STYLES[entry.entry_type] || { label: entry.entry_type, color: 'var(--text-2)', bg: 'var(--bg-3)' }
                    return (
                      <div key={entry.id} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', background: t.bg, color: t.color, border: `1px solid ${t.color}33`, borderRadius: '20px' }}>{t.label}</span>
                          {entry.concept && <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>· {entry.concept.name}</span>}
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>{entry.summary}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
