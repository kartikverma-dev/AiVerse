import { notFound } from 'next/navigation'
import Nav from '@/components/ui/Nav'
import { getConceptBySlug, getConcepts } from '@/lib/db'
import { getStrategicInsights } from '@/lib/strategic-insights'
import ConceptQuiz from '@/components/public/ConceptQuiz'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  const insights = getStrategicInsights(concept.slug, concept.status, concept.difficulty)

  const priorityLabel: Record<string, string> = {
    learn_now: '🔥 Learn now', know_basics: '📗 Know basics',
    nice_to_know: '💡 Nice to know', historical: '📦 Historical context'
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '28px', display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Link href="/concepts" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>Concepts</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-3)' }}>{concept.name}</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '44px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', lineHeight: 1.15 }}>
                {concept.name}
              </h1>
              {concept.abbreviation && (
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-2)',
                  background: 'var(--bg-3)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)',
                }}>{concept.abbreviation}</span>
              )}
              <span style={{ fontSize: '28px' }}>{statusEmoji[concept.status]}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              <span className={`pill pill-${concept.status}`}>{concept.status}</span>
              <span className={`pill pill-${concept.difficulty}`}>{concept.difficulty}</span>
              <span className={`pill pill-${concept.learning_priority}`}>{priorityLabel[concept.learning_priority]}</span>
              {concept.categories?.map(c => (
                <span key={c} style={{
                  fontSize: '11px', color: 'var(--text-2)', background: 'var(--bg-3)',
                  padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)',
                }}>{c}</span>
              ))}
            </div>

            {/* TL;DR */}
            <div style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderLeft: '4px solid var(--accent)', borderRadius: 'var(--radius)',
              padding: '20px 24px',
            }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>TL;DR</div>
              <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>{concept.tldr}</p>
            </div>
          </div>

          {/* Meta */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px', marginBottom: '48px',
          }}>
            {concept.first_appeared && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>First appeared</div>
                <div style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{concept.first_appeared}</div>
              </div>
            )}
            {concept.popularized_by && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>Popularized by</div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{concept.popularized_by}</div>
              </div>
            )}
          </div>

          {/* Evolution chain */}
          {((concept.parents && concept.parents.length > 0) || (concept.children && concept.children.length > 0)) && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '20px' }}>Evolution chain</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {concept.parents?.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link href={`/concepts/${ev.parent?.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        padding: '6px 14px', borderRadius: '20px',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        fontSize: '13px', color: 'var(--text-2)', fontWeight: 500,
                        transition: 'border-color 0.2s',
                      }} className="evolution-link-node">{ev.parent?.name}</div>
                    </Link>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'lowercase' }}>{relLabel[ev.relationship_type] || ev.relationship_type}</span>
                  </div>
                ))}
                <div style={{
                  padding: '6px 14px', borderRadius: '20px',
                  background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                  fontSize: '13px', color: 'var(--accent)', fontWeight: 600,
                }}>{concept.name}</div>
                {concept.children?.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'lowercase' }}>{relLabel[ev.relationship_type] || ev.relationship_type}</span>
                    <Link href={`/concepts/${ev.child?.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        padding: '6px 14px', borderRadius: '20px',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        fontSize: '13px', color: 'var(--text-2)', fontWeight: 500,
                        transition: 'border-color 0.2s',
                      }} className="evolution-link-node">{ev.child?.name}</div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Technical definition */}
          <section style={{ marginBottom: '44px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '16px' }}>Technical definition</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '17px', lineHeight: 1.8 }}>{concept.definition_technical}</p>
          </section>

          {/* Beginner explanation */}
          <section className="beginner-explanation-panel" style={{
            marginBottom: '44px', background: 'var(--bg-2)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
              💡 Beginner explanation
            </div>
            <p style={{ color: 'var(--text)', fontSize: '16.5px', lineHeight: 1.8 }}>{concept.definition_beginner}</p>
          </section>

          {/* Maturity Assessment */}
          <section style={{ marginBottom: '44px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span> Maturity Assessment
            </h2>
            <div style={{
              background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px',
              display: 'grid', gridTemplateColumns: '1fr', gap: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-2)' }}>Overall Maturity Score</span>
                <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{insights.maturityScore}/100</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'Academic / Paper Mentions', val: insights.maturityFactors.academic },
                  { label: 'Production Readiness', val: insights.maturityFactors.production },
                  { label: 'Tooling Ecosystem', val: insights.maturityFactors.tooling },
                  { label: 'Community Volume', val: insights.maturityFactors.community }
                ].map(factor => (
                  <div key={factor.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{factor.label}</span>
                      <span style={{ color: 'var(--text)', fontWeight: 600 }}>{factor.val}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-3)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${factor.val}%`, background: 'var(--accent)', borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Enterprise Adoption Implications */}
          <section style={{ marginBottom: '44px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏢</span> Enterprise Adoption Implications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>💻 Infrastructure & Cost</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>{insights.enterpriseImplications.infrastructure}</p>
              </div>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>📚 Training & Skill Overhead</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>{insights.enterpriseImplications.training}</p>
              </div>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent)', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>💰 Business Value Horizon</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>{insights.enterpriseImplications.businessValue}</p>
              </div>
            </div>
          </section>

          {/* Governance Relevance (Hook into product) */}
          <section style={{ marginBottom: '44px', background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius)', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <span>🛡️</span> Governance & Oversight Relevance
              </h2>
              <span style={{
                fontSize: '10px', fontWeight: 800, padding: '4px 10px',
                background: insights.governanceRelevance.riskLevel === 'CRITICAL' || insights.governanceRelevance.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(212, 175, 55, 0.08)',
                color: insights.governanceRelevance.riskLevel === 'CRITICAL' || insights.governanceRelevance.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--accent)',
                border: `1px solid ${insights.governanceRelevance.riskLevel === 'CRITICAL' || insights.governanceRelevance.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(212, 175, 55, 0.25)'}`,
                borderRadius: '20px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                {insights.governanceRelevance.riskLevel} GRC RISK LEVEL
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.08)', paddingBottom: '12px' }}>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Compliance & Regulatory Impact</strong>
                <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>{insights.governanceRelevance.complianceImpact}</p>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Oversight & Monitoring Guideline</strong>
                <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>{insights.governanceRelevance.oversightGuideline}</p>
              </div>
            </div>
          </section>

          {/* Examples */}
          {concept.examples && concept.examples.length > 0 && (
            <section style={{ marginBottom: '44px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '20px' }}>Real-world examples</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {concept.examples.map(ex => (
                  <div key={ex.id} style={{
                    background: 'var(--bg-2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '20px 24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{ex.title}</span>
                      {ex.industry && (
                        <span style={{
                          fontSize: '10px', color: 'var(--text-2)', background: 'var(--bg-3)',
                          padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border)',
                          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                        }}>{ex.industry}</span>
                      )}
                    </div>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>{ex.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Knowledge Check Micro-Quiz */}
          <ConceptQuiz concept={concept} />

          {/* Sources */}
          {concept.sources && concept.sources.length > 0 && (
            <section style={{ marginBottom: '44px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '20px' }}>Trusted sources</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {concept.sources.sort((a, b) => a.authority_rank - b.authority_rank).map(src => (
                  <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer" className="source-card-link">
                    <div className="source-card">
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'var(--bg-3)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
                        fontFamily: 'var(--font-mono)',
                      }}>{src.authority_rank}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px', color: 'var(--text)', wordBreak: 'break-word' }}>{src.title || src.url}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{sourceTypeLabel[src.source_type] || src.source_type}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" style={{ flexShrink: 0 }}>
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
            color: 'var(--text-2)', fontSize: '14px', marginTop: '24px',
            textDecoration: 'none',
          }} className="back-link-btn">← Back to all concepts</Link>
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
          gap: 14px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 20px;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .source-card:hover {
          border-color: var(--accent);
          background: var(--bg-3);
        }
        .evolution-link-node:hover {
          border-color: var(--accent) !important;
          color: var(--text) !important;
        }
        .back-link-btn:hover {
          color: var(--accent) !important;
        }
        @media (max-width: 600px) {
          .beginner-explanation-panel {
            padding: 16px !important;
          }
          .source-card {
            padding: 12px 16px !important;
            gap: 10px !important;
          }
        }
      `}</style>
    </>
  )
}
