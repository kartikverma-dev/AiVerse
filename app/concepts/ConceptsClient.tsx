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

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState<Concept[]>([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleToggleCompare = (concept: Concept) => {
    setSelectedForCompare(prev => {
      const exists = prev.some(c => c.id === concept.id)
      if (exists) {
        return prev.filter(c => c.id !== concept.id)
      } else {
        if (prev.length >= 3) {
          setToastMessage('You can compare a maximum of 3 concepts at a time.')
          return prev
        }
        return [...prev, concept]
      }
    })
  }

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toastMessage])

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
          {filtered.map(c => (
            <ConceptCard 
              key={c.id} 
              concept={c} 
              isComparing={true} 
              isSelectedForCompare={selectedForCompare.some(item => item.id === c.id)}
              onToggleCompare={() => handleToggleCompare(c)}
            />
          ))}
        </div>
      )}

      {/* Toast Warning */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent)', color: '#000', fontWeight: 700,
          padding: '10px 20px', borderRadius: '30px', zIndex: 100,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)', fontSize: '13px',
          fontFamily: 'var(--font-mono)', border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'fadeUp 0.3s ease'
        }}>
          ⚠️ {toastMessage}
        </div>
      )}

      {/* Floating Comparison Drawer */}
      {selectedForCompare.length > 0 && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(15, 15, 15, 0.85)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '14px', padding: '10px 18px', zIndex: 90,
          display: 'flex', alignItems: 'center', gap: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          maxWidth: '90vw', width: 'max-content',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '6px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              Comparison
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              {selectedForCompare.length} / 3 Selected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {selectedForCompare.map(concept => (
              <div 
                key={concept.id}
                style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '3px 8px', display: 'flex',
                  alignItems: 'center', gap: '6px', fontSize: '11px',
                  color: 'var(--text-2)', fontFamily: 'var(--font-mono)'
                }}
              >
                <span>{concept.abbreviation || concept.name}</span>
                <button 
                  onClick={() => handleToggleCompare(concept)}
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-3)',
                    cursor: 'pointer', fontSize: '13px', padding: 0,
                    lineHeight: 1, display: 'flex', alignItems: 'center'
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginLeft: '6px' }}>
            <button
              onClick={() => setSelectedForCompare([])}
              style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text-2)', padding: '6px 12px', borderRadius: '6px',
                fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase'
              }}
            >
              Clear
            </button>
            <button
              disabled={selectedForCompare.length < 2}
              onClick={() => setIsCompareModalOpen(true)}
              style={{
                background: selectedForCompare.length < 2 ? 'var(--border)' : 'var(--accent)',
                color: selectedForCompare.length < 2 ? 'var(--text-3)' : '#000',
                border: 'none', padding: '6px 14px', borderRadius: '6px',
                fontSize: '11px', fontWeight: 700, cursor: selectedForCompare.length < 2 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                boxShadow: selectedForCompare.length < 2 ? 'none' : '0 4px 12px rgba(212, 175, 55, 0.2)',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Comparison Modal */}
      {isCompareModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: '16px', width: '100%', maxWidth: '1100px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            animation: 'modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '9px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Side-by-Side Matrix
                </span>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                  Concept Comparison
                </h2>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  color: 'var(--text)', width: '32px', height: '32px',
                  borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                  lineHeight: 1, padding: 0
                }}
              >
                ×
              </button>
            </div>

            {/* Matrix Table */}
            <div style={{
              flex: 1, overflow: 'auto', padding: '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `160px repeat(${selectedForCompare.length}, 1fr)`,
                gap: '16px',
                minWidth: '700px'
              }}>
                {/* Header Row */}
                <div style={{ fontWeight: 700, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', alignSelf: 'center' }}>
                  Concept
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {c.status === 'emerging' ? '🌱' : c.status === 'growing' ? '📈' : c.status === 'stable' ? '✅' : c.status === 'declining' ? '📉' : '📦'}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                        {c.name}
                      </h3>
                    </div>
                    {c.abbreviation && (
                      <span style={{
                        fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)',
                        alignSelf: 'flex-start', background: 'var(--accent-dim)',
                        padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--accent-border)'
                      }}>{c.abbreviation}</span>
                    )}
                  </div>
                ))}

                {/* Divider Row */}
                <div style={{ gridColumn: `1 / span ${selectedForCompare.length + 1}`, height: '1px', background: 'var(--border)' }}></div>

                {/* TL;DR Row */}
                <div style={{ fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  Overview (TL;DR)
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: '1.6' }}>
                    {c.tldr}
                  </div>
                ))}

                {/* Divider Row */}
                <div style={{ gridColumn: `1 / span ${selectedForCompare.length + 1}`, height: '1px', background: 'var(--border)' }}></div>

                {/* Status & Difficulty Row */}
                <div style={{ fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  Maturity & Difficulty
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className={`pill pill-${c.status}`}>{c.status}</span>
                    <span className={`pill pill-${c.difficulty}`}>{c.difficulty}</span>
                  </div>
                ))}

                {/* Divider Row */}
                <div style={{ gridColumn: `1 / span ${selectedForCompare.length + 1}`, height: '1px', background: 'var(--border)' }}></div>

                {/* Timeline Row */}
                <div style={{ fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  First Appeared
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{c.first_appeared || 'Unknown'}</div>
                    {c.popularized_by && (
                      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                        Popularized by: {c.popularized_by}
                      </div>
                    )}
                  </div>
                ))}

                {/* Divider Row */}
                <div style={{ gridColumn: `1 / span ${selectedForCompare.length + 1}`, height: '1px', background: 'var(--border)' }}></div>

                {/* Categories Row */}
                <div style={{ fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  Categories
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {c.categories?.map(cat => (
                      <span key={cat} style={{
                        fontSize: '10px', color: 'var(--text-2)', background: 'var(--bg-3)',
                        padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border)',
                        fontFamily: 'var(--font-mono)'
                      }}>{cat}</span>
                    ))}
                  </div>
                ))}

                {/* Divider Row */}
                <div style={{ gridColumn: `1 / span ${selectedForCompare.length + 1}`, height: '1px', background: 'var(--border)' }}></div>

                {/* Beginner Definition Row */}
                <div style={{ fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  Beginner Friendly
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.6', background: 'var(--bg-3)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    💡 {c.definition_beginner}
                  </div>
                ))}

                {/* Divider Row */}
                <div style={{ gridColumn: `1 / span ${selectedForCompare.length + 1}`, height: '1px', background: 'var(--border)' }}></div>

                {/* Technical Definition Row */}
                <div style={{ fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                  Technical Deep-Dive
                </div>
                {selectedForCompare.map(c => (
                  <div key={c.id} style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.6', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>
                    ⚙️ {c.definition_technical}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              padding: '12px 20px', borderTop: '1px solid var(--border)',
              background: 'var(--bg-3)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'
            }}>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                style={{
                  background: 'var(--accent)', color: '#000', border: 'none',
                  padding: '8px 20px', borderRadius: '6px', fontSize: '12px',
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)'
                }}
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, 15px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 40px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
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
