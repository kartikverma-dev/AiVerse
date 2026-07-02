import Nav from '@/components/ui/Nav'
import { getEvolutionChain, getConcepts } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 60

const statusColor: Record<string, string> = {
  emerging: 'var(--emerging)', growing: 'var(--growing)',
  stable: 'var(--stable)', declining: 'var(--declining)', historical: 'var(--historical)'
}

export default async function TimelinePage() {
  let evolutions: Awaited<ReturnType<typeof getEvolutionChain>> = []
  let allConcepts: Awaited<ReturnType<typeof getConcepts>> = []

  try {
    [evolutions, allConcepts] = await Promise.all([
      getEvolutionChain(),
      getConcepts({ approved: true }),
    ])
  } catch {
    // fallback to empty
  }

  // Build adjacency for chains
  const childMap: Record<string, typeof evolutions[0][]> = {}
  const hasParent = new Set<string>()
  evolutions.forEach(ev => {
    if (!childMap[ev.parent_concept_id]) childMap[ev.parent_concept_id] = []
    childMap[ev.parent_concept_id].push(ev)
    hasParent.add(ev.child_concept_id)
  })

  // Find chain roots (concepts with no parent in the evolution graph)
  const roots = allConcepts.filter(c => !hasParent.has(c.id) && childMap[c.id])

  function buildChain(conceptId: string, depth = 0): React.ReactNode {
    const children = childMap[conceptId] || []
    const concept = allConcepts.find(c => c.id === conceptId)
    if (!concept) return null

    const relLabel: Record<string, string> = {
      replaced: '⬆ replaced', extended: '→ extended',
      inspired_by: '✦ inspired', competes_with: '⇄ competes'
    }

    return (
      <div key={conceptId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Link href={`/concepts/${concept.slug}`} className="timeline-card-link">
          <div className="timeline-card" style={{
            border: '1px solid var(--border)',
            borderLeft: `3px solid ${statusColor[concept.status] || 'var(--border)'}`,
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text)' }}>{concept.name}</div>
              {concept.first_appeared && (
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{concept.first_appeared}</div>
              )}
            </div>
            <span className={`pill pill-${concept.status}`} style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{concept.status}</span>
          </div>
        </Link>

        {children.length > 0 && (
          <div className="timeline-child-wrapper">
            {children.map((ev, idx) => (
              <div key={`${ev.parent_concept_id}-${ev.child_concept_id}-${idx}`} style={{ marginTop: '8px' }}>
                <div style={{
                  fontSize: '10px', color: 'var(--text-3)', padding: '4px 0',
                  fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                }}>
                  {relLabel[ev.relationship_type] || ev.relationship_type}
                  {(ev as any).year && ` · ${(ev as any).year}`}
                </div>
                {buildChain(ev.child_concept_id, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Standalone concepts (no evolution relations)
  const inEvolution = new Set([...evolutions.map(e => e.parent_concept_id), ...evolutions.map(e => e.child_concept_id)])
  const standalone = allConcepts.filter(c => !inEvolution.has(c.id))

  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 80px' }}>
          <div style={{ marginBottom: '44px' }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '10px' }}>Evolution timeline</h1>
            <p style={{ color: 'var(--text-2)', fontSize: '15.5px' }}>
              How AI ideas are born from others — click any concept to explore it in depth.
            </p>
          </div>

          {roots.length === 0 && allConcepts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
              <p>No concepts yet. Add some from the admin panel.</p>
              <Link href="/admin" style={{ color: 'var(--accent)', marginTop: '12px', display: 'block', textDecoration: 'none' }}>Go to Admin →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {roots.length > 0 && (
                <section>
                  <h2 style={{ fontWeight: 600, color: 'var(--text-3)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    Evolution chains
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                    {roots.map(c => (
                      <div key={c.id}>{buildChain(c.id)}</div>
                    ))}
                  </div>
                </section>
              )}

              {standalone.length > 0 && (
                <section>
                  <h2 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                    Independent concepts
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {standalone.map(c => (
                      <Link key={c.id} href={`/concepts/${c.slug}`} className="standalone-concept-link">
                        <div className="standalone-concept-badge">{c.name}</div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <style>{`
        .timeline-card-link, .standalone-concept-link {
          text-decoration: none;
          color: inherit;
        }
        .timeline-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-2);
          border-radius: var(--radius);
          padding: 14px 20px;
          cursor: pointer;
          min-width: 240px;
          transition: background 0.2s, border-color 0.2s;
        }
        .timeline-card:hover {
          background: var(--bg-3);
          border-color: var(--accent-border);
        }
        .standalone-concept-badge {
          padding: 8px 18px;
          border-radius: var(--radius);
          background: var(--bg-2);
          border: 1px solid var(--border);
          font-size: 13.5px;
          color: var(--text-2);
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s, color 0.2s;
        }
        .standalone-concept-badge:hover {
          border-color: var(--accent);
          background: var(--bg-3);
          color: var(--text);
        }
        .timeline-child-wrapper {
          margin-left: 24px;
          padding-left: 24px;
          border-left: 1px solid var(--border);
          margin-top: 0;
        }
        @media (max-width: 600px) {
          .timeline-child-wrapper {
            margin-left: 12px !important;
            padding-left: 12px !important;
          }
          .timeline-card {
            min-width: 100% !important;
            width: 100% !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </>
  )
}
