'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Sun, Moon, Menu, X, BookOpen } from 'lucide-react'

const links = [
  { href: '/concepts', label: 'Concepts' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/graph', label: 'Graph' },
  { href: '/digest', label: 'Digest' },
]

export default function Nav() {
  const path = usePathname()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [menuOpen, setMenuOpen] = useState(false)

  // Initialize theme from document attribute on mount
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || 'dark'
    setTheme(currentTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  const triggerFlashcard = () => {
    window.dispatchEvent(new Event('open-flashcard'))
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
      background: 'var(--nav-bg)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      height: '56px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      transition: 'background-color 0.3s ease',
    }}>
      {/* Brand logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '32px' }} onClick={() => setMenuOpen(false)}>
        <div style={{
          width: '28px', height: '28px', background: 'var(--accent)',
          borderRadius: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff',
          letterSpacing: '-0.5px',
        }}>AV</div>
        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>AiVerse</span>
      </Link>

      {/* Desktop Navigation links */}
      <div className="desktop-nav" style={{ gap: '4px', flex: 1, display: 'flex' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            padding: '6px 12px', borderRadius: 'var(--radius)',
            fontSize: '14.5px', fontWeight: 500,
            color: path?.startsWith(l.href) ? 'var(--text)' : 'var(--text-2)',
            background: path?.startsWith(l.href) ? 'var(--bg-3)' : 'transparent',
            transition: 'background-color 0.2s, color 0.2s',
          }}>{l.label}</Link>
        ))}
      </div>

      {/* Desktop Controls (Theme + Flashcard + Admin) */}
      <div className="desktop-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Flashcard Trigger Button */}
        <button
          onClick={triggerFlashcard}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', borderRadius: 'var(--radius)',
            color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13.5px', fontWeight: 500,
            transition: 'color 0.2s, background-color 0.2s',
          }}
          className="nav-control-btn"
          title="Open AI terms flashcard"
        >
          <BookOpen size={16} />
          <span>Flashcard</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', borderRadius: 'var(--radius)',
            color: 'var(--text-2)', display: 'flex', alignItems: 'center',
            transition: 'color 0.2s, background-color 0.2s',
          }}
          className="nav-control-btn"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link href="/admin" style={{
          padding: '6px 14px', borderRadius: 'var(--radius)',
          border: '1px solid var(--border-strong)',
          fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)',
          transition: 'border-color 0.2s, color 0.2s',
        }} className="admin-btn">Admin</Link>
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px', color: 'var(--text)',
        }}
        className="mobile-menu-btn"
        aria-label="Toggle mobile menu"
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '56px', left: 0, right: 0,
          background: 'var(--bg-1)',
          borderBottom: '1px solid var(--border-strong)',
          padding: '24px', display: 'flex', flexDirection: 'column',
          gap: '16px', zIndex: 89,
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        }} className="mobile-menu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
                padding: '10px 14px', borderRadius: 'var(--radius)',
                fontSize: '16px', fontWeight: 600,
                color: path?.startsWith(l.href) ? 'var(--text)' : 'var(--text-2)',
                background: path?.startsWith(l.href) ? 'var(--bg-3)' : 'transparent',
              }}>{l.label}</Link>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={triggerFlashcard}
              style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                padding: '12px 14px', borderRadius: 'var(--radius)',
                color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <BookOpen size={18} />
              <span>Learn AI Terms (Flashcard)</span>
            </button>

            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                padding: '12px 14px', borderRadius: 'var(--radius)',
                color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
              padding: '12px 14px', borderRadius: 'var(--radius)',
              background: 'var(--bg-3)', border: '1px solid var(--border-strong)',
              fontSize: '15px', fontWeight: 600, color: 'var(--text)',
              display: 'flex', justifyContent: 'center',
            }}>Admin Dashboard</Link>
          </div>
        </div>
      )}

      <style>{`
        .nav-control-btn:hover {
          color: var(--text) !important;
          background-color: var(--bg-3);
        }
        .admin-btn:hover {
          border-color: var(--text-2) !important;
          color: var(--text) !important;
        }
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-nav, .desktop-controls {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  )
}
