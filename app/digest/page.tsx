import Nav from '@/components/ui/Nav'
import { getDigestEntries } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 60

const typeLabel: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new_concept: { label: 'New concept', color: 'var(--success)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
  status_change: { label: 'Status change', color: 'var(--accent-2)', bg: 'var(--accent-dim)', border: 'var(--accent-border)' },
  notable_paper: { label: 'Notable paper', color: 'var(--stable)', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
  framework_release: { label: 'Framework release', color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
}

export default async function DigestPage() {
  let entries: Awaited<ReturnType<typeof getDigestEntries>> = []
  try {
    entries = await getDigestEntries()
  } catch {}

  // Group by week
  const byWeek: Record<string, typeof entries> = {}
  entries.forEach(e => {
    if (!byWeek[e.week_of]) byWeek[e.week_of] = []
    byWeek[e.week_of].push(e)
  })
  const weeks = Object.keys(byWeek).sort((a, b) => b.localeCompare(a))

  const fmt = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    } catch { return dateStr }
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Weekly digest</h1>
            <p style={{ color: 'var(--text-2)' }}>
              New concepts, status changes, notable papers — curated weekly.
            </p>
          </div>

          {weeks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📬</div>
              <p>No digest entries yet. The first digest will appear after the weekly pipeline runs.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {weeks.map((week, wi) => (
                <section key={week}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '19.5px', fontWeight: 600 }}>Week of {fmt(week)}</h2>
                    {wi === 0 && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                        background: 'var(--accent-dim)', color: 'var(--accent)',
                        border: '1px solid var(--accent-border)', borderRadius: '20px',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>Latest</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {byWeek[week].map(entry => {
                      const t = typeLabel[entry.entry_type] || { label: entry.entry_type, color: 'var(--text-2)', bg: 'var(--bg-3)' }
                      return (
                        <div key={entry.id} style={{
                          background: 'var(--bg-2)', border: '1px solid var(--border)',
                          borderRadius: '12px', padding: '20px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span style={{
                              fontSize: '12px', fontWeight: 600, padding: '3px 8px',
                              background: t.bg, color: t.color,
                              border: `1px solid ${t.border}`, borderRadius: '20px',
                            }}>{t.label}</span>
                            {entry.concept && (
                              <Link href={`/concepts/${entry.concept.slug}`}>
                                <span className={`pill pill-${entry.concept.status}`} style={{ cursor: 'pointer' }}>
                                  {entry.concept.name}
                                </span>
                              </Link>
                            )}
                          </div>
                          <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.7 }}>
                            {entry.summary}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
