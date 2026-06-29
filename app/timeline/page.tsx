import Nav from '@/components/ui/Nav'
import { getEvolutionChain, getConcepts } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const statusColor: Record<string, string> = {
  emerging: '#818cf8', growing: '#4ade80',
  stable: '#60a5fa', declining: '#fbbf24', historical: '#71717a'
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
            border: `1px solid ${statusColor[concept.status] || 'var(--border)'}22`,
            borderLeft: `3px solid ${statusColor[concept.status] || 'var(--border)'}`,
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{concept.name}</div>
              {concept.first_appeared && (
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{concept.first_appeared}</div>
              )}
            </div>
            <span className={`pill pill-${concept.status}`} style={{ marginLeft: 'auto' }}>{concept.status}</span>
          </div>
        </Link>

        {children.length > 0 && (
          <div style={{ marginLeft: '24px', paddingLeft: '24px', borderLeft: '1px solid var(--border)', marginTop: '0' }}>
            {children.map((ev, idx) => (
              <div key={`${ev.parent_concept_id}-${ev.child_concept_id}-${idx}`} style={{ marginTop: '8px' }}>
                <div style={{
                  fontSize: '11px', color: 'var(--text-3)', padding: '4px 0 4px 0',
                  fontWeight: 500, letterSpacing: '0.04em',
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
      <main style={{ paddingTop: '56px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Evolution timeline</h1>
            <p style={{ color: 'var(--text-2)' }}>
              How AI ideas are born from others — click any concept to explore it in depth.
            </p>
          </div>

          {roots.length === 0 && allConcepts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-2)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌱</div>
              <p>No concepts yet. Add some from the admin panel.</p>
              <Link href="/admin" style={{ color: 'var(--accent)', marginTop: '12px', display: 'block' }}>Go to Admin →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {roots.length > 0 && (
                <section>
                  <h2 style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '12px' }}>
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
                  <h2 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
          gap: 10px;
          background: var(--bg-2);
          border-radius: var(--radius);
          padding: 12px 18px;
          cursor: pointer;
          min-width: 240px;
          transition: background 0.15s;
        }
        .timeline-card:hover {
          background: var(--bg-3);
        }
        .standalone-concept-badge {
          padding: 8px 16px;
          border-radius: 20px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          font-size: 13px;
          color: var(--text-2);
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .standalone-concept-badge:hover {
          border-color: var(--border-strong);
        }
      `}</style>
    </>
  )
}
