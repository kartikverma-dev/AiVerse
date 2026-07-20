import Nav from '@/components/ui/Nav'
import GraphClient from './GraphClient'
import { getConcepts, getEvolutionChain } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GraphPage() {
  let nodes: Array<{ id: string; name: string; status: string; difficulty: string; categories: string[] }> = []
  let links: Array<{ source: string; target: string; relationship_type: string }> = []

  try {
    const [concepts, evolutions] = await Promise.all([
      getConcepts({ approved: true }),
      getEvolutionChain(),
    ])
    nodes = concepts.map(c => ({
      id: c.id, name: c.name, status: c.status,
      difficulty: c.difficulty, categories: c.categories || [],
      slug: c.slug,
      first_appeared: c.first_appeared,
    }))
    links = evolutions.map(ev => ({
      source: ev.parent_concept_id,
      target: ev.child_concept_id,
      relationship_type: ev.relationship_type,
    }))
  } catch {
    // fallback
  }

  return (
    <>
      <Nav />
      <main style={{ paddingTop: '56px', height: '100vh', overflow: 'hidden' }}>
        <GraphClient nodes={nodes} links={links} />
      </main>
    </>
  )
}
