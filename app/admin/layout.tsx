import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'AiVerse Admin' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>{children}</div>
}
