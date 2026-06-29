'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import type { Concept } from '@/types'
import { Suspense } from 'react'

const STATUS_COLOR: Record<string, string> = {
  emerging: '#818cf8', growing: '#4ade80', stable: '#60a5fa', declining: '#fbbf24', historical: '#71717a'
}

function ConceptsManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tab, setTab] = useState<'published' | 'pending'>(
    searchParams?.get('filter') === 'pending' ? 'pending' : 'published'
  )
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [success, setSuccess] = useState(searchParams?.get('success') === '1')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (tab === 'pending') params.set('pending', 'true')
      if (search) params.set('q', search)
      const res = await fetch(`/api/concepts/admin?${params}`)
      const data = await res.json()
      setConcepts(data.concepts || [])
    } catch { setConcepts([]) }
    setLoading(false)
  }, [tab, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (success) setTimeout(() => setSuccess(false), 3000) }, [success])

  async function approve(id: string) {
    await fetch('/api/concepts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve', id }) })
    setConcepts(prev => prev.filter(c => c.id !== id))
  }

  async function remove(id: string) {
    if (!confirm('Delete this concept?')) return
    await fetch('/api/concepts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) })
    setConcepts(prev => prev.filter(c => c.id !== id))
  }

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: active ? 600 : 400,
    border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
    background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
    color: active ? '#818cf8' : 'var(--text-2)', cursor: 'pointer', fontFamily: 'inherit',
  })

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Concepts</h1>
              <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>{concepts.length} {tab === 'pending' ? 'pending review' : 'published'}</p>
            </div>
            <button onClick={() => router.push('/admin/add')} style={{
              padding: '8px 18px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>+ Add concept</button>
          </div>

          {success && (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius)', padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#4ade80' }}>
              ✓ Concept saved for review
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button style={btnStyle(tab === 'published')} onClick={() => setTab('published')}>Published</button>
            <button style={btnStyle(tab === 'pending')} onClick={() => setTab('pending')}>Pending review</button>
          </div>

          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              style={{ width: '100%', padding: '8px 12px 8px 32px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '13px', outline: 'none' }} />
          </div>

          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-2)' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }}></div>
                Loading…
              </div>
            ) : concepts.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-2)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>◈</div>
                <p>{tab === 'pending' ? 'No concepts pending review.' : 'No published concepts yet.'}</p>
              </div>
            ) : (
              concepts.map((c, i) => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 20px',
                  borderBottom: i < concepts.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLOR[c.status] || 'var(--text-3)', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>{c.name}</span>
                      {c.abbreviation && <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'monospace', background: 'var(--bg-4)', padding: '1px 5px', borderRadius: '4px' }}>{c.abbreviation}</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.tldr}</div>
                  </div>
                  <span className={`pill pill-${c.status}`}>{c.status}</span>
                  <span className={`pill pill-${c.difficulty}`}>{c.difficulty}</span>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {tab === 'pending' && (
                      <button onClick={() => approve(c.id)} style={{
                        padding: '5px 12px', background: 'var(--accent)', color: '#fff',
                        border: 'none', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                      }}>Approve</button>
                    )}
                    <button onClick={() => router.push(`/concepts/${c.slug}`)} style={{
                      padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)',
                      color: 'var(--text-2)', borderRadius: 'var(--radius)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
                    }}>View</button>
                    <button onClick={() => remove(c.id)} style={{
                      padding: '5px 10px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171', borderRadius: 'var(--radius)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
                    }}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function AdminConceptsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '48px', color: 'var(--text-2)' }}>Loading…</div>}>
      <ConceptsManager />
    </Suspense>
  )
}
