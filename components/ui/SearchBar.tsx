'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ defaultValue = '', onSearch }: {
  defaultValue?: string
  onSearch?: (q: string) => void
}) {
  const [q, setQ] = useState(defaultValue)
  const router = useRouter()

  const handle = useCallback((val: string) => {
    setQ(val)
    if (onSearch) {
      onSearch(val)
    } else {
      const params = new URLSearchParams()
      if (val) params.set('q', val)
      router.push(`/concepts?${params.toString()}`)
    }
  }, [onSearch, router])

  return (
    <div style={{ position: 'relative' }}>
      <svg style={{
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-3)', pointerEvents: 'none',
      }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        value={q}
        onChange={e => handle(e.target.value)}
        placeholder="Search concepts…"
        style={{
          width: '100%', padding: '10px 12px 10px 38px',
          background: 'var(--bg-3)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', color: 'var(--text)',
          fontSize: '14px', outline: 'none',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
      />
    </div>
  )
}
