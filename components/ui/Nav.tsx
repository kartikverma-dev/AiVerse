'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/concepts', label: 'Concepts' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/graph', label: 'Graph' },
  { href: '/digest', label: 'Digest' },
]

export default function Nav() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      height: '56px', display: 'flex', alignItems: 'center',
      padding: '0 24px',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '32px' }}>
        <div style={{
          width: '28px', height: '28px', background: 'var(--accent)',
          borderRadius: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff',
          letterSpacing: '-0.5px',
        }}>AV</div>
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text)' }}>AiVerse</span>
      </Link>

      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            padding: '6px 12px', borderRadius: 'var(--radius)',
            fontSize: '14px', fontWeight: 500,
            color: path?.startsWith(l.href) ? 'var(--text)' : 'var(--text-2)',
            background: path?.startsWith(l.href) ? 'var(--bg-3)' : 'transparent',
          }}>{l.label}</Link>
        ))}
      </div>

      <Link href="/admin" style={{
        padding: '6px 14px', borderRadius: 'var(--radius)',
        border: '1px solid var(--border-strong)',
        fontSize: '13px', fontWeight: 500, color: 'var(--text-2)',
      }}>Admin</Link>
    </nav>
  )
}
