'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/admin/concepts', label: 'Concepts', icon: '◈' },
  { href: '/admin/add', label: 'Add concept', icon: '+' },
  { href: '/admin/digest', label: 'Weekly digest', icon: '◉' },
  { href: '/admin/pipeline', label: 'Pipeline', icon: '⟳' },
]

export default function AdminSidebar() {
  const path = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? path === href : path?.startsWith(href)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Top Header */}
      <div className="admin-mobile-header" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '56px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: '#fff',
          }}>AV</div>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>AiVerse Admin</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-2)',
            cursor: 'pointer',
          }}
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="admin-sidebar-overlay"
        />
      )}

      <aside className={`admin-aside ${isOpen ? 'open' : ''}`} style={{
        width: '220px', flexShrink: 0,
        background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'sticky',
        top: 0, height: '100vh', overflow: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', background: 'var(--accent)', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', flexShrink: 0,
          }}>AV</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>AiVerse</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Admin panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', padding: '6px 8px 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Content</div>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '7px 10px', borderRadius: 'var(--radius)', margin: '1px 0',
                fontSize: '13px', fontWeight: isActive(item.href, item.exact) ? 500 : 400,
                background: isActive(item.href, item.exact) ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: isActive(item.href, item.exact) ? 'var(--accent)' : 'var(--text-2)',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: '16px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '7px 10px', borderRadius: 'var(--radius)',
              fontSize: '13px', color: 'var(--text-2)', cursor: 'pointer',
            }}>
              <span>↗</span> View public site
            </div>
          </Link>
          <div
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '7px 10px', borderRadius: 'var(--radius)',
              fontSize: '13px', color: '#f87171', cursor: 'pointer',
            }}
          >
            <span>←</span> Sign out
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-header {
            display: flex !important;
          }
          .admin-sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 140;
          }
          .admin-aside {
            position: fixed !important;
            top: 56px !important;
            left: 0 !important;
            height: calc(100vh - 56px) !important;
            z-index: 150 !important;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 10px 0 30px rgba(0,0,0,0.15);
          }
          .admin-aside.open {
            transform: translateX(0) !important;
          }
          .admin-aside + main {
            padding-top: 80px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </>
  )
}
