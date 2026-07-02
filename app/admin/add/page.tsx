'use client'
import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Agents', 'Prompting', 'Training', 'Retrieval', 'Infrastructure', 'Coding', 'Multimodal', 'Evaluation']
const STATUS_OPTIONS = ['emerging', 'growing', 'stable', 'declining', 'historical']
const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced']
const PRIORITY_OPTIONS = ['learn_now', 'know_basics', 'nice_to_know', 'historical']
const PRIORITY_LABELS: Record<string, string> = { learn_now: 'Learn now', know_basics: 'Know basics', nice_to_know: 'Nice to know', historical: 'Historical context' }

const SOURCE_TYPES = ['official_blog', 'paper', 'github', 'researcher', 'community']
const SOURCE_LABELS: Record<string, string> = { official_blog: 'Official blog', paper: 'Research paper', github: 'GitHub', researcher: 'Verified researcher', community: 'Community' }

interface DraftData {
  name?: string; abbreviation?: string; tldr?: string
  definition_technical?: string; definition_beginner?: string
  status?: string; difficulty?: string; learning_priority?: string
  first_appeared?: string; popularized_by?: string; categories?: string[]
  suggested_sources?: Array<{ url: string; title: string; source_type: string; authority_rank: number }>
  examples?: Array<{ title: string; description: string; industry?: string }>
}

export default function AdminAddPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'text' | 'url'>('text')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [draft, setDraft] = useState<DraftData | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const steps = ['Sending to NVIDIA NIM (Llama 3.3 70B)…', 'Analyzing concept…', 'Drafting all fields…', 'Suggesting sources…', 'Finalizing…']

  async function runDraft() {
    if (!input.trim()) { setError('Please enter some text or a URL first.'); return }
    setError(''); setLoading(true); setDraft(null)
    let i = 0
    setLoadingStep(steps[0])
    const interval = setInterval(() => {
      i = Math.min(i + 1, steps.length - 1)
      setLoadingStep(steps[i])
    }, 1200)

    try {
      const res = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, inputType: tab }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setDraft(data.draft)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'AI draft failed. Check your NVIDIA NIM API key.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  async function saveDraft() {
    if (!draft) return
    setSaving(true)
    try {
      const res = await fetch('/api/concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', draft }),
      })
      if (!res.ok) throw new Error('Save failed')
      router.push('/admin/concepts?success=1')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setSaving(false)
    }
  }

  const field = (label: string, sub?: string, children?: React.ReactNode) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '6px' }}>
        {label} {sub && <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>{sub}</span>}
      </label>
      {children}
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '8px 12px',
    background: 'var(--bg-3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)',
    fontSize: '13px', outline: 'none', fontFamily: 'inherit',
  } as React.CSSProperties

  const taStyle = { ...inputStyle, minHeight: '80px', resize: 'vertical' as const, lineHeight: '1.5' }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '760px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Add concept</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: '28px', fontSize: '14px' }}>Paste content or a URL — NVIDIA NIM drafts all fields for you to review.</p>

          {/* AI Input */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              {(['text', 'url'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  background: tab === t ? 'rgba(99,102,241,0.08)' : 'transparent',
                  color: tab === t ? '#818cf8' : 'var(--text-2)',
                  fontSize: '13px', fontWeight: tab === t ? 600 : 400, fontFamily: 'inherit',
                  borderBottom: tab === t ? '2px solid #818cf8' : '2px solid transparent',
                }}>
                  {t === 'text' ? 'Raw text / description' : 'URL'}
                </button>
              ))}
            </div>

            <div style={{ padding: '16px' }}>
              {tab === 'text' ? (
                <textarea
                  value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Paste an excerpt from a blog post, paper, or describe the concept you want to add…"
                  style={{ ...taStyle, minHeight: '120px', border: 'none', background: 'transparent', padding: '0' }}
                />
              ) : (
                <input
                  type="url" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="https://…"
                  style={{ ...inputStyle, border: 'none', background: 'transparent', padding: '0' }}
                />
              )}
            </div>

            <div style={{
              background: 'var(--bg-3)', padding: '10px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>⚡ NVIDIA NIM · Llama 3.3 70B</span>
              <button onClick={runDraft} disabled={loading} style={{
                padding: '7px 18px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius)', fontSize: '13px',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
              }}>
                {loading ? '⟳ Drafting…' : '✦ Draft with AI'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#f87171' }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', color: 'var(--text-2)', fontSize: '13px' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }}></div>
              {loadingStep}
            </div>
          )}

          {/* Draft form */}
          {draft && (
            <div className="fade-in">
              <div style={{
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 'var(--radius)', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '20px', fontSize: '13px', color: '#4ade80',
              }}>
                ✓ Fields drafted by AI — review and edit before saving
              </div>

              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                {/* Name + Abbreviation */}
                <div className="admin-name-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  {field('Concept name *', undefined,
                    <input value={draft.name || ''} onChange={e => setDraft({ ...draft, name: e.target.value })} style={inputStyle} />
                  )}
                  {field('Abbreviation', '(optional)',
                    <input value={draft.abbreviation || ''} onChange={e => setDraft({ ...draft, abbreviation: e.target.value })} style={inputStyle} />
                  )}
                </div>

                {field('TL;DR', '1–2 sentences, jargon-free',
                  <textarea value={draft.tldr || ''} onChange={e => setDraft({ ...draft, tldr: e.target.value })} style={{ ...taStyle, minHeight: '56px' }} />
                )}
                {field('Technical definition',
                  undefined,
                  <textarea value={draft.definition_technical || ''} onChange={e => setDraft({ ...draft, definition_technical: e.target.value })} style={taStyle} />
                )}
                {field('Beginner explanation', '(analogy-based)',
                  <textarea value={draft.definition_beginner || ''} onChange={e => setDraft({ ...draft, definition_beginner: e.target.value })} style={taStyle} />
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {field('Status', undefined,
                    <select value={draft.status || 'emerging'} onChange={e => setDraft({ ...draft, status: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                  {field('Difficulty', undefined,
                    <select value={draft.difficulty || 'intermediate'} onChange={e => setDraft({ ...draft, difficulty: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  )}
                  {field('Learning priority', undefined,
                    <select value={draft.learning_priority || 'know_basics'} onChange={e => setDraft({ ...draft, learning_priority: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                    </select>
                  )}
                  {field('First appeared', undefined,
                    <input value={draft.first_appeared || ''} onChange={e => setDraft({ ...draft, first_appeared: e.target.value })} style={inputStyle} placeholder="e.g. 2024" />
                  )}
                </div>

                {field('Popularized by', undefined,
                  <input value={draft.popularized_by || ''} onChange={e => setDraft({ ...draft, popularized_by: e.target.value })} style={inputStyle} />
                )}

                {field('Categories', undefined,
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                    {CATEGORIES.map(cat => {
                      const active = draft.categories?.includes(cat)
                      return (
                        <button key={cat} onClick={() => {
                          const cats = draft.categories || []
                          setDraft({ ...draft, categories: active ? cats.filter(c => c !== cat) : [...cats, cat] })
                        }} style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                          border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                          background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                          color: active ? '#818cf8' : 'var(--text-2)', cursor: 'pointer', fontFamily: 'inherit',
                        }}>{cat}</button>
                      )
                    })}
                  </div>
                )}

                {/* AI-suggested sources */}
                {draft.suggested_sources && draft.suggested_sources.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '8px' }}>
                      AI-suggested sources
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {draft.suggested_sources.map((src, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          background: 'var(--bg-3)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)', padding: '8px 12px',
                        }}>
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-4)',
                            border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', flexShrink: 0,
                          }}>{src.authority_rank}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', color: '#818cf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.url}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{SOURCE_LABELS[src.source_type] || src.source_type}</div>
                          </div>
                          <button onClick={() => setDraft({ ...draft, suggested_sources: draft.suggested_sources?.filter((_, j) => j !== i) })}
                            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '16px' }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => { setDraft(null); setInput('') }} style={{
                    padding: '8px 18px', background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--text-2)', borderRadius: 'var(--radius)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                  }}>Clear</button>
                  <button onClick={saveDraft} disabled={saving} style={{
                    padding: '8px 22px', background: 'var(--accent)', color: '#fff',
                    border: 'none', borderRadius: 'var(--radius)', fontSize: '13px',
                    fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit',
                  }}>
                    {saving ? 'Saving…' : '✓ Save for review'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 500px) {
          .admin-name-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
