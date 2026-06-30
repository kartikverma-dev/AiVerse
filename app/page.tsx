import Nav from '@/components/ui/Nav'
import { getConcepts, getDigestEntries } from '@/lib/db'
import InteractiveEvolution from '@/components/public/InteractiveEvolution'
import HeroSection from '@/components/public/HeroSection'
import ParticleBurst from '@/components/public/ParticleBurst'
import TermMarquee from '@/components/public/TermMarquee'
import FeatureBento from '@/components/public/FeatureBento'
import AnimatedSections from '@/components/public/AnimatedSections'
import CtaFooter from '@/components/public/CtaFooter'
import FlashcardModal from '@/components/public/FlashcardModal'

export const revalidate = 60

const statusColor: Record<string, string> = {
  emerging: '#818cf8',
  growing: '#34d399',
  stable: '#38bdf8',
  declining: '#fbbf24',
  historical: '#6b6b76',
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

  const totalCount = allConcepts.length
  const statusCounts = allConcepts.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const latestConcepts = allConcepts.slice(0, 3)
  const recentDigestItems = latestDigests.slice(0, 4)

  return (
    <>
      <Nav />
      <FlashcardModal concepts={allConcepts} />
      <main style={{ position: 'relative', overflowX: 'hidden', background: 'var(--bg)', color: 'var(--text)' }}>

        {/* Cinematic 3D hero — crystal centerpiece, stacked editorial type */}
        <HeroSection totalCount={totalCount} />

        {/* Scroll-driven particle burst revealing key stats */}
        <ParticleBurst />

        <TermMarquee />

        <FeatureBento />

        {/* Interactive Lineage Sandbox */}
        <section style={{
          maxWidth: '1040px', margin: '0 auto', padding: '90px 24px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '600px' }}>
            <div style={{
              display: 'inline-block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--accent)', background: 'var(--accent-dim)',
              padding: '5px 12px', borderRadius: '20px', marginBottom: '16px',
            }}>
              Sandbox
            </div>
            <h2 style={{
              fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, marginBottom: '12px',
              fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em',
            }}>
              Interactive lineage explorer
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '14.5px', lineHeight: 1.6 }}>
              Click on any node in the evolution pathways below to trace how ideas build on top of each other.
            </p>
          </div>
          <InteractiveEvolution concepts={allConcepts} />
        </section>

        <AnimatedSections
          latestConcepts={latestConcepts}
          recentDigestItems={recentDigestItems}
          statusCounts={statusCounts}
          statusColor={statusColor}
          statusEmoji={statusEmoji}
        />

        <CtaFooter />
      </main>
    </>
  )
}
