import { Suspense } from 'react'
import Nav from '@/components/ui/Nav'
import ConceptsClient from './ConceptsClient'

export const revalidate = 60

export default function ConceptsPage() {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', minHeight: '100vh' }}>
        <Suspense fallback={<div style={{ padding: '80px 24px', color: 'var(--text-2)', textAlign: 'center' }}>Loading…</div>}>
          <ConceptsClient />
        </Suspense>
      </main>
    </>
  )
}
