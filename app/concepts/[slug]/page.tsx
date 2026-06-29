import { notFound } from 'next/navigation'
import Nav from '@/components/ui/Nav'
import { getConceptBySlug, getConcepts } from '@/lib/db'
import Link from 'next/link'

export const revalidate = 60

const statusEmoji: Record<string, string> = {
  emerging: '🌱', growing: '📈', stable: '✅', declining: '📉', historical: '📦'
}
const sourceTypeLabel: Record<string, string> = {
  official_blog: 'Official blog', paper: 'Research paper',
  github: 'GitHub', researcher: 'Verified researcher', community: 'Community'
}
const relLabel: Record<string, string> = {
  replaced: 'replaced by', extended: 'extended into',
  inspired_by: 'inspired', competes_with: 'competes with'
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concept = await getConceptBySlug(slug)
  if (!concept) notFound()

  const priorityLabel: Record<string, string> = {
    learn_now: '🔥 Learn now', know_basics: '📗 Know basics',
    nice_to_know: '💡 Nice to know', historical: '📦 Historical context'
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link href="/concepts" style={{ color: 'var(--text-2)' }}>Concepts</Link>
            <span>/</span>
            <span>{concept.name}</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
                {concept.name}
              </h1>
              {concept.abbreviation && (
                <span style={{
                  fontFamily: 'monospace', fontSize: '14px', color: 'var(--text-3)',
                  background: 'var(--bg-4)', padding: '3px 8px', borderRadius: '6px',
                }}>{concept.abbreviation}</span>
              )}
              <span style={{ fontSize: '28px' }}>{statusEmoji[concept.status]}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <span className={`pill pill-${concept.status}`}>{concept.status}</span>
              <span className={`pill pill-${concept.difficulty}`}>{concept.difficulty}</span>
              <span className={`pill pill-${concept.learning_priority}`}>{priorityLabel[concept.learning_priority]}</span>
              {concept.categories?.map(c => (
                <span key={c} style={{
                  fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-4)',
                  padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)',
                }}>{c}</span>
              ))}
            </div>

            {/* TL;DR */}
            <div style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)', borderRadius: 'var(--radius)',
              padding: '16px 20px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>TL;DR</div>
              <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--text)' }}>{concept.tldr}</p>
            </div>
          </div>

          {/* Meta */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px', marginBottom: '48px',
          }}>
            {concept.first_appeared && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>First appeared</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{concept.first_appeared}</div>
              </div>
            )}
            {concept.popularized_by && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Popularized by</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{concept.popularized_by}</div>
              </div>
            )}
          </div>

          {/* Evolution chain */}
          {((concept.parents && concept.parents.length > 0) || (concept.children && concept.children.length > 0)) && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Evolution chain</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {concept.parents?.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link href={`/concepts/${ev.parent?.slug}`}>
                      <div style={{
                        padding: '7px 14px', borderRadius: '20px',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        fontSize: '13px', color: 'var(--text-2)',
                      }}>{ev.parent?.name}</div>
                    </Link>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>→ {relLabel[ev.relationship_type] || ev.relationship_type} →</span>
                  </div>
                ))}
                <div style={{
                  padding: '7px 14px', borderRadius: '20px',
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  fontSize: '13px', color: '#818cf8', fontWeight: 600,
                }}>{concept.name}</div>
                {concept.children?.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>→ {relLabel[ev.relationship_type] || ev.relationship_type} →</span>
                    <Link href={`/concepts/${ev.child?.slug}`}>
                      <div style={{
                        padding: '7px 14px', borderRadius: '20px',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        fontSize: '13px', color: 'var(--text-2)',
                      }}>{ev.child?.name}</div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Technical definition */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px' }}>Technical definition</h2>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>{concept.definition_technical}</p>
          </section>

          {/* Beginner explanation */}
          <section style={{
            marginBottom: '40px', background: 'var(--bg-2)',
            border: '1px solid var(--border)', borderRadius: '12px', padding: '24px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              💡 Beginner explanation
            </div>
            <p style={{ color: 'var(--text)', lineHeight: 1.8 }}>{concept.definition_beginner}</p>
          </section>

          {/* Examples */}
          {concept.examples && concept.examples.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Real-world examples</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {concept.examples.map(ex => (
                  <div key={ex.id} style={{
                    background: 'var(--bg-2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '16px 20px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{ex.title}</span>
                      {ex.industry && (
                        <span style={{
                          fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-4)',
                          padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border)',
                        }}>{ex.industry}</span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>{ex.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sources */}
          {concept.sources && concept.sources.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Trusted sources</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {concept.sources.sort((a, b) => a.authority_rank - b.authority_rank).map(src => (
                  <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer" className="source-card-link">
                    <div className="source-card">
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'var(--bg-4)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', flexShrink: 0,
                      }}>{src.authority_rank}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>{src.title || src.url}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{sourceTypeLabel[src.source_type] || src.source_type}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Back */}
          <Link href="/concepts" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-2)', fontSize: '14px', marginTop: '16px',
          }}>← Back to all concepts</Link>
        </div>
      </main>
      <style>{`
        .source-card-link {
          text-decoration: none;
          color: inherit;
        }
        .source-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 12px 16px;
          transition: border-color 0.15s;
        }
        .source-card:hover {
          border-color: var(--border-strong);
        }
      `}</style>
    </>
  )
}
