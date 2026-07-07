'use client'
import { useState, useEffect, useCallback } from 'react'
import ConceptCard from '@/components/public/ConceptCard'
import type { Concept } from '@/types'
import { parseYear } from '@/lib/yearParser'

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
  const [selectedYear, setSelectedYear] = useState(2026)
  const [isPlaying, setIsPlaying] = useState(false)

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

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedYear(prev => {
          if (prev >= 2026) return 2015
          return prev + 1
        })
      }, 1200)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying])

  const filtered = (priority === 'all'
    ? concepts
    : concepts.filter(c => c.learning_priority === priority)
  ).filter(c => parseYear(c.first_appeared) <= selectedYear)

  const btn = (active: boolean, label: string, onClick: () => void) => (
    <button key={label} onClick={onClick} style={{
      padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
      border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border)'}`,
      background: active ? 'var(--accent-dim)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer',
      fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
      transition: 'all 0.2s',
    }}>{label}</button>
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: '10px', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>Concept library</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '15.5px' }}>
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

      {/* Timeline Slider */}
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '16px 20px', marginBottom: '24px',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, fontFamily: 'var(--font-heading)' }}>
              <span>⏳</span> Time-Travel Timeline
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: '2px 0 0 0' }}>
              Drag to view the state of AI knowledge in any given year.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? 'var(--accent-dim)' : 'var(--bg-3)',
                border: '1px solid ' + (isPlaying ? 'var(--accent-border)' : 'var(--border)'),
                color: isPlaying ? 'var(--accent)' : 'var(--text-2)',
                borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em'
              }}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play Evolution'}
            </button>
            <div style={{
              background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)',
              borderRadius: '6px', padding: '4px 10px', fontSize: '13px', fontWeight: 700,
              fontFamily: 'var(--font-mono)'
            }}>
              {selectedYear}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>2015</span>
          <input 
            type="range"
            min="2015"
            max="2026"
            value={selectedYear}
            onChange={e => {
              setSelectedYear(parseInt(e.target.value, 10))
              setIsPlaying(false)
            }}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: 'var(--border)',
              outline: 'none',
              cursor: 'pointer',
              accentColor: 'var(--accent)'
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>2026</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {STATUS_FILTERS.map(s => btn(status === s, s === 'all' ? 'All status' : s, () => setStatus(s)))}
      </div>
      <div className="filter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {CATEGORY_FILTERS.map(c => btn(category === c, c, () => setCategory(c)))}
      </div>
      <div className="filter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '16px' }}>
          {filtered.map(c => <ConceptCard key={c.id} concept={c} />)}
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .filter-row {
            display: flex !important;
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
            margin-bottom: 12px !important;
            scrollbar-width: none !important;
            width: calc(100% + 48px) !important;
            margin-left: -24px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .filter-row::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
