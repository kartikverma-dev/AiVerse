'use client'
import { useState, useEffect, useCallback } from 'react'
import ConceptCard from '@/components/public/ConceptCard'
import type { Concept } from '@/types'

const STATUS_FILTERS = ['all', 'emerging', 'growing', 'stable', 'declining', 'historical']
const CATEGORY_FILTERS = ['All', 'Agents', 'Prompting', 'Training', 'Retrieval', 'Infrastructure', 'Coding']
const PRIORITY_FILTERS = ['all', 'learn_now', 'know_basics', 'nice_to_know']
const PRIORITY_LABELS: Record<string, string> = { all: 'All priorities', learn_now: 'Learn now', know_basics: 'Know basics', nice_to_know: 'Nice to know' }

export default function ConceptsClient() {
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('All')
  const [priority, setPriority] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (status !== 'all') params.set('status', status)
      if (category !== 'All') params.set('category', category)
      const res = await fetch(`/api/concepts?${params}`)
      const data = await res.json()
      setConcepts(data.concepts || [])
    } catch {
      setConcepts([])
    }
    setLoading(false)
  }, [search, status, category])

  useEffect(() => { load() }, [load])

  const filtered = priority === 'all'
    ? concepts
    : concepts.filter(c => c.learning_priority === priority)

  const btn = (active: boolean, label: string, onClick: () => void) => (
    <button key={label} onClick={onClick} style={{
      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
      border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
      background: active ? 'var(--accent-dim)' : 'transparent',
      color: active ? '#818cf8' : 'var(--text-2)', cursor: 'pointer',
    }}>{label}</button>
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Concept library</h1>
        <p style={{ color: 'var(--text-2)' }}>
          {filtered.length} concept{filtered.length !== 1 ? 's' : ''} — every AI term with depth, context, and cited sources.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search concepts…"
          style={{
            width: '100%', padding: '10px 12px 10px 38px',
            background: 'var(--bg-3)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: '14px', outline: 'none',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {STATUS_FILTERS.map(s => btn(status === s, s === 'all' ? 'All status' : s, () => setStatus(s)))}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {CATEGORY_FILTERS.map(c => btn(category === c, c, () => setCategory(c)))}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {PRIORITY_FILTERS.map(p => btn(priority === p, PRIORITY_LABELS[p], () => setPriority(p)))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-2)' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }}></div>
          Loading concepts…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-2)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
          <p>No concepts match your filters.</p>
          <button onClick={() => { setSearch(''); setStatus('all'); setCategory('All'); setPriority('all') }}
            style={{ marginTop: '16px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map(c => <ConceptCard key={c.id} concept={c} />)}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
