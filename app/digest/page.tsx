import Nav from '@/components/ui/Nav'
import { getDigestEntries } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 60

const typeLabel: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  new_concept: { label: 'New concept', color: 'var(--success)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '✨' },
  status_change: { label: 'Status change', color: 'var(--accent-2)', bg: 'var(--accent-dim)', border: 'var(--accent-border)', icon: '🔄' },
  notable_paper: { label: 'Notable paper', color: 'var(--stable)', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)', icon: '📄' },
  framework_release: { label: 'Framework release', color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '📦' },
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
      <main style={{ paddingTop: '56px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '56px', textAlign: 'center' }}>
            <h1 className="gradient-text" style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              Weekly Digest
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: '16.5px', maxWidth: '500px', margin: '0 auto' }}>
              Stay ahead of the curve. New concepts, status transitions, and key publications curated every single week.
            </p>
          </div>

          {weeks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
              <p style={{ color: 'var(--text-2)', fontWeight: 500 }}>No digest entries yet. The weekly pipeline will populate this feed soon.</p>
            </div>
          ) : (
            <div className="digest-timeline">
              {weeks.map((week, wi) => (
                <section key={week} className="digest-week-section">
                  {/* Timeline node dot */}
                  <div className="digest-week-dot" />

                  {/* Week Title Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>📅</span>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                        Week of {fmt(week)}
                      </h2>
                    </div>
                    {wi === 0 && (
                      <span style={{
                        fontSize: '9px', fontWeight: 700, padding: '2px 8px',
                        background: 'var(--accent-dim)', color: 'var(--accent)',
                        border: '1px solid var(--accent-border)', borderRadius: '20px',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                      }}>Latest</span>
                    )}
                  </div>

                  {/* Cards stack */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {byWeek[week].map(entry => {
                      const t = typeLabel[entry.entry_type] || { label: entry.entry_type, color: 'var(--text-2)', bg: 'var(--bg-3)', border: 'var(--border)', icon: '📝' }
                      return (
                        <div key={entry.id} className="digest-card">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                              background: t.bg, color: t.color,
                              border: `1px solid ${t.border}`, borderRadius: '20px',
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                            }}>
                              <span>{t.icon}</span>
                              <span>{t.label}</span>
                            </span>
                            {entry.concept && (
                              <Link href={`/concepts/${entry.concept.slug}`}>
                                <span className={`pill pill-${entry.concept.status}`} style={{ cursor: 'pointer', transition: 'transform 0.15s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                                  {entry.concept.name}
                                </span>
                              </Link>
                            )}
                          </div>
                          <p style={{ color: 'var(--text-2)', fontSize: '15px', lineHeight: 1.65 }}>
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

      <style>{`
        .digest-timeline {
          position: relative;
          padding-left: 32px;
          border-left: 2px solid var(--border);
          margin-left: 8px;
        }
        .digest-week-section {
          position: relative;
          margin-bottom: 56px;
        }
        .digest-week-section:last-child {
          margin-bottom: 0;
        }
        .digest-week-dot {
          position: absolute;
          left: -41px;
          top: 6px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--bg);
          border: 4px solid var(--accent);
          box-shadow: 0 0 0 4px var(--bg);
          z-index: 2;
          transition: border-color 0.3s ease;
        }
        .digest-week-section:hover .digest-week-dot {
          border-color: var(--success);
        }
        .digest-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .digest-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-strong);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
        [data-theme='dark'] .digest-card:hover {
          box-shadow: 0 12px 30px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  )
}
