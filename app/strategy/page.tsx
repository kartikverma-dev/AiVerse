import { Suspense } from 'react'
import Nav from '@/components/ui/Nav'
import { getConcepts, getDigestEntries } from '@/lib/db'
import StrategyBoardClient from '@/components/public/StrategyBoardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function StrategyData() {
  let concepts: any[] = []
  let entries: any[] = []
  
  try {
    const [fetchedConcepts, fetchedEntries] = await Promise.all([
      getConcepts({ approved: true }),
      getDigestEntries()
    ])
    concepts = fetchedConcepts
    entries = fetchedEntries
  } catch (err) {
    console.error('Failed to load Strategy Board data:', err)
  }

  return <StrategyBoardClient initialConcepts={concepts} initialEntries={entries} />
}

export default function StrategyPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh', background: 'var(--bg)' }}>
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', color: 'var(--text-2)' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', marginBottom: '16px', animation: 'spin 0.8s linear infinite' }}></div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>Loading CTO AI Strategy Board…</p>
          </div>
        }>
          <StrategyData />
        </Suspense>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
