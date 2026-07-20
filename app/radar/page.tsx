import { Suspense } from 'react'
import Nav from '@/components/ui/Nav'
import { getDigestEntries, getConcepts } from '@/lib/db'
import SkillIntelligenceClient from '@/components/public/SkillIntelligenceClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function SkillRadarData() {
  let entries: Awaited<ReturnType<typeof getDigestEntries>> = []
  let concepts: Awaited<ReturnType<typeof getConcepts>> = []
  
  try {
    const [fetchedEntries, fetchedConcepts] = await Promise.all([
      getDigestEntries(),
      getConcepts({ approved: true })
    ])
    entries = fetchedEntries
    concepts = fetchedConcepts
  } catch (err) {
    console.error('Failed to load Skill Radar data:', err)
  }

  return <SkillIntelligenceClient initialConcepts={concepts} initialEntries={entries} />
}

export default function RadarPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh', background: 'var(--bg)' }}>
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', color: 'var(--text-2)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', marginBottom: '16px', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>Loading Skill Intelligence Radar…</p>
          </div>
        }>
          <SkillRadarData />
        </Suspense>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
