import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import { getConcepts, getDigestEntries } from '@/lib/db'
import InteractiveEvolution from '@/components/public/InteractiveEvolution'
import ConceptCard from '@/components/public/ConceptCard'

export const revalidate = 60

const statusColor: Record<string, string> = {
  emerging: '#818cf8',
  growing: '#4ade80',
  stable: '#60a5fa',
  declining: '#fbbf24',
  historical: '#71717a',
}

const statusEmoji: Record<string, string> = {
  emerging: '🌱',
  growing: '📈',
  stable: '✅',
  declining: '📉',
  historical: '📦',
}

export default async function Home() {
  const allConcepts = await getConcepts({ approved: true })
  const latestDigests = await getDigestEntries()

  // Calculate statistics
  const totalCount = allConcepts.length
  const statusCounts = allConcepts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get 3 latest concepts for display
  const latestConcepts = allConcepts.slice(0, 3)

  // Get 4 latest digest items
  const recentDigestItems = latestDigests.slice(0, 4)

  return (
    <>
      <Nav />
      <main className="homepage-container">
        {/* Glow Effects */}
        <div className="glow-orb main-orb" />
        <div className="glow-orb secondary-orb" />

        {/* Hero Section */}
        <section className="hero-section">
          <div className="badge-wrapper">
            <span className="live-dot" />
            <span className="badge-text">{totalCount} AI Concepts Monitored · Updated Weekly</span>
          </div>

          <h1 className="hero-headline">
            Don't just keep up with AI.<br />
            <span className="gradient-text">Understand how it evolves.</span>
          </h1>

          <p className="hero-subheadline">
            A living knowledge graph mapping the lineage, technical depth, and real-world relevance of AI terms as they emerge.
          </p>

          <div className="hero-ctas">
            <Link href="/concepts" className="primary-cta">
              Explore Concept Library
            </Link>
            <Link href="/graph" className="secondary-cta">
              Interactive Force Graph
            </Link>
          </div>
        </section>

        {/* Interactive Lineage Sandbox */}
        <section className="sandbox-section">
          <div className="section-header">
            <div className="pill-indicator">Sandbox</div>
            <h2>Interactive Lineage Explorer</h2>
            <p>Click on any node in the evolution pathways below to trace how ideas build on top of each other.</p>
          </div>
          <InteractiveEvolution concepts={allConcepts} />
        </section>

        {/* Dynamic Activity Feed & Latest Additions */}
        <section className="dashboard-grid-section">
          <div className="grid-container">
            {/* Column 1: Recently Added concepts */}
            <div className="grid-column">
              <div className="column-header">
                <div className="column-title">
                  <span className="header-icon">✨</span>
                  <h3>Recently Added Concepts</h3>
                </div>
                <Link href="/concepts" className="see-all-link">See all →</Link>
              </div>
              <div className="latest-concepts-list">
                {latestConcepts.map(c => (
                  <ConceptCard key={c.id} concept={c} />
                ))}
              </div>
            </div>

            {/* Column 2: Weekly Digest Feed */}
            <div className="grid-column">
              <div className="column-header">
                <div className="column-title">
                  <span className="header-icon">📡</span>
                  <h3>AI Ecosystem Activity Feed</h3>
                </div>
                <Link href="/digest" className="see-all-link">See all digests →</Link>
              </div>
              <div className="digest-feed-card">
                {recentDigestItems.length > 0 ? (
                  <div className="feed-timeline">
                    {recentDigestItems.map((item, idx) => (
                      <div key={item.id || idx} className="feed-item">
                        <div className="feed-item-marker">
                          <div className="marker-dot" />
                          {idx < recentDigestItems.length - 1 && <div className="marker-line" />}
                        </div>
                        <div className="feed-item-content">
                          <div className="feed-item-header">
                            <span className="feed-item-date">{item.week_of}</span>
                            <span className="feed-item-type">{item.entry_type.replace('_', ' ')}</span>
                          </div>
                          <p className="feed-item-summary">{item.summary}</p>
                          {item.concept && (
                            <Link href={`/concepts/${item.concept.slug}`} className="feed-concept-link">
                              View {item.concept.name} {statusEmoji[item.concept.status]}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-feed-text">No updates recorded this week.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Status System & Significance */}
        <section className="status-grid-section">
          <div className="section-header center">
            <h2>Relevance Status System</h2>
            <p>We classify AI concepts by their state of adoption in research and industry deployments.</p>
          </div>
          <div className="status-cards-wrapper">
            {[
              { status: 'stable', label: 'Stable', desc: 'Mainstream technology. Adopted, verified, and well-integrated into standard stacks.' },
              { status: 'growing', label: 'Growing', desc: 'Accelerating adoption. Seeing wide application, tooling support, and engineering interest.' },
              { status: 'emerging', label: 'Emerging', desc: 'Cutting-edge. Just appearing in papers or experimental github repositories.' },
              { status: 'declining', label: 'Declining', desc: 'Superseded. Foundational, but being replaced by more efficient methods.' },
            ].map(s => (
              <div key={s.status} className="status-category-card">
                <div className="status-card-header">
                  <span className="status-badge-dot" style={{ background: statusColor[s.status] }} />
                  <h4>{s.label}</h4>
                  <span className="status-count">{statusCounts[s.status] || 0} terms</span>
                </div>
                <p className="status-card-desc">{s.desc}</p>
                <Link href={`/concepts?status=${s.status}`} className="status-filter-link">
                  Explore {s.label} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="footer-content">
            <span className="footer-logo">AiVerse</span>
            <p>Mapping the evolution of AI knowledge, patterns, and paradigms.</p>
            <div className="footer-meta">
              Built with Next.js, Supabase, NVIDIA NIM · {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        .homepage-container {
          position: relative;
          padding-top: 56px;
          overflow-x: hidden;
          background-color: var(--bg);
          color: var(--text);
        }

        /* Glow effects */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          pointer-events: none;
          opacity: 0.15;
        }
        .main-orb {
          top: -100px;
          right: 15%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #6366f1 0%, transparent 80%);
        }
        .secondary-orb {
          top: 600px;
          left: 5%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #4f46e5 0%, transparent 80%);
        }

        /* Hero Section */
        .hero-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 100px 24px 60px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .badge-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 20px;
          padding: 6px 14px;
          margin-bottom: 28px;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #818cf8;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        .badge-text {
          font-size: 12px;
          color: #818cf8;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .hero-headline {
          font-size: clamp(38px, 6vw, 68px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subheadline {
          font-size: clamp(16px, 2vw, 19px);
          line-height: 1.6;
          color: var(--text-2);
          max-width: 620px;
          margin: 0 auto 38px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .primary-cta {
          padding: 14px 28px;
          background: var(--accent);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
          transition: transform 0.2s, background 0.2s;
        }
        .primary-cta:hover {
          background: #4f46e5;
          transform: translateY(-1px);
        }
        .secondary-cta {
          padding: 14px 28px;
          background: transparent;
          color: var(--text);
          border-radius: 8px;
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
          border: 1px solid var(--border-strong);
          transition: background 0.2s, border-color 0.2s;
        }
        .secondary-cta:hover {
          background: var(--bg-2);
          border-color: var(--text-2);
        }

        /* Sandbox Section */
        .sandbox-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .section-header {
          text-align: center;
          margin-bottom: 24px;
          max-width: 600px;
        }
        .section-header.center {
          margin: 0 auto 40px;
        }
        .pill-indicator {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #818cf8;
          background: rgba(129, 140, 248, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        .section-header h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .section-header p {
          color: var(--text-2);
          font-size: 14px;
          line-height: 1.5;
        }

        /* Dashboard Grid Section */
        .dashboard-grid-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 24px;
          position: relative;
          z-index: 1;
          border-top: 1px solid var(--border);
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .grid-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
        .grid-column {
          display: flex;
          flex-direction: column;
        }
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }
        .column-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header-icon {
          font-size: 18px;
        }
        .column-title h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
        }
        .see-all-link {
          font-size: 13px;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
        }
        .see-all-link:hover {
          text-decoration: underline;
        }
        .latest-concepts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Activity Feed Timeline */
        .digest-feed-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          flex: 1;
        }
        .feed-timeline {
          display: flex;
          flex-direction: column;
        }
        .feed-item {
          display: flex;
          gap: 16px;
        }
        .feed-item-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .marker-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #818cf8;
          margin-top: 6px;
        }
        .marker-line {
          width: 2px;
          flex: 1;
          background: var(--border);
          min-height: 48px;
          margin: 6px 0;
        }
        .feed-item-content {
          padding-bottom: 24px;
          flex: 1;
        }
        .feed-item-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .feed-item-date {
          font-size: 11px;
          color: var(--text-3);
          font-weight: 500;
        }
        .feed-item-type {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: var(--bg-4);
          border: 1px solid var(--border);
          color: var(--text-2);
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        .feed-item-summary {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-2);
          margin-bottom: 8px;
        }
        .feed-concept-link {
          display: inline-block;
          font-size: 12px;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
        }
        .feed-concept-link:hover {
          text-decoration: underline;
        }
        .empty-feed-text {
          color: var(--text-3);
          text-align: center;
          padding: 40px 0;
          font-size: 14px;
        }

        /* Status Grid Section */
        .status-grid-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 24px;
          border-top: 1px solid var(--border);
          position: relative;
          z-index: 1;
        }
        .status-cards-wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .status-category-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, background 0.2s;
        }
        .status-category-card:hover {
          border-color: var(--border-strong);
          background: var(--bg-3);
        }
        .status-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .status-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-card-header h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          flex: 1;
        }
        .status-count {
          font-size: 11px;
          color: var(--text-3);
          background: var(--bg-4);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }
        .status-card-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-2);
          margin-bottom: 20px;
          flex: 1;
        }
        .status-filter-link {
          font-size: 13px;
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          margin-top: auto;
        }
        .status-filter-link:hover {
          text-decoration: underline;
        }

        /* Footer */
        .home-footer {
          border-top: 1px solid var(--border);
          padding: 60px 24px;
          background: var(--bg-2);
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .footer-logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          display: block;
          margin-bottom: 8px;
          color: var(--text);
        }
        .footer-content p {
          font-size: 13px;
          color: var(--text-2);
          margin-bottom: 24px;
        }
        .footer-meta {
          font-size: 12px;
          color: var(--text-3);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}