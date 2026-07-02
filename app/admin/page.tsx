import AdminSidebar from '@/components/admin/AdminSidebar'
import { getConcepts, getDigestEntries } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let allConcepts: Awaited<ReturnType<typeof getConcepts>> = []
  let pendingConcepts: Awaited<ReturnType<typeof getConcepts>> = []
  let recentDigest: Awaited<ReturnType<typeof getDigestEntries>> = []

  try {
    const [all, pending, digest] = await Promise.all([
      getConcepts({ approved: true }),
      getConcepts({ approved: false }),
      getDigestEntries(),
    ])
    allConcepts = all
    pendingConcepts = pending
    recentDigest = digest.slice(0, 3)
  } catch {}

  const statusCount = allConcepts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const metrics = [
    { label: 'Total concepts', value: allConcepts.length, sub: `+${pendingConcepts.length} pending` },
    { label: 'Pending review', value: pendingConcepts.length, sub: 'AI-drafted, not approved', accent: pendingConcepts.length > 0 },
    { label: 'Emerging', value: statusCount.emerging || 0, sub: 'new & gaining traction' },
    { label: 'Stable', value: statusCount.stable || 0, sub: 'mainstream adoption' },
  ]

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>Welcome back. Here's what needs your attention.</p>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {metrics.map(m => (
              <div key={m.label} style={{
                background: 'var(--bg-2)', border: `1px solid ${m.accent ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
                borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: m.accent ? '#fbbf24' : 'var(--text)', lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Pending review */}
          {pendingConcepts.length > 0 && (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '24px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>⚠️ Pending review</div>
                <Link href="/admin/concepts?filter=pending" style={{ fontSize: '13px', color: 'var(--accent)' }}>View all →</Link>
              </div>
              {pendingConcepts.slice(0, 3).map(c => (
                <div key={c.id} style={{
                  padding: '14px 20px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>AI-drafted · pending your approval</div>
                  </div>
                  <span className={`pill pill-${c.status}`}>{c.status}</span>
                  <Link href="/admin/concepts">
                    <button style={{
                      padding: '5px 14px', background: 'var(--accent)', color: '#fff',
                      border: 'none', borderRadius: 'var(--radius)', fontSize: '12px',
                      fontWeight: 500, cursor: 'pointer',
                    }}>Review</button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {[
              { href: '/admin/add', icon: '✦', title: 'Add concept', desc: 'AI-assisted drafting with NVIDIA NIM' },
              { href: '/admin/concepts', icon: '◈', title: 'Manage concepts', desc: 'Edit, approve, or delete entries' },
              { href: '/admin/digest', icon: '◉', title: 'Weekly digest', desc: 'Review and send this week\'s update' },
            ].map(a => (
              <Link key={a.href} href={a.href} className="admin-action-card-link">
                <div className="admin-action-card">
                  <div style={{ fontSize: '22px', marginBottom: '10px' }}>{a.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Status breakdown */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>Status breakdown</div>
            {Object.entries({ emerging: '#818cf8', growing: '#4ade80', stable: '#60a5fa', declining: '#fbbf24', historical: '#71717a' }).map(([status, color]) => {
              const count = statusCount[status] || 0
              const pct = allConcepts.length ? Math.round((count / allConcepts.length) * 100) : 0
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '90px', fontSize: '12px', color: 'var(--text-2)', textTransform: 'capitalize', flexShrink: 0 }}>{status}</div>
                  <div style={{ flex: 1, height: '6px', background: 'var(--bg-4)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s' }}></div>
                  </div>
                  <div style={{ width: '30px', fontSize: '12px', color: 'var(--text-3)', textAlign: 'right' }}>{count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <style>{`
        .admin-action-card-link {
          text-decoration: none;
          color: inherit;
        }
        .admin-action-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .admin-action-card:hover {
          border-color: var(--border-strong);
        }
      `}</style>
    </div>
  )
}
