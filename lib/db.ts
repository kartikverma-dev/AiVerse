import { createServiceClient } from './supabase/server'
import type { Concept, DigestEntry } from '@/types'

export async function getConcepts(options?: {
  status?: string
  category?: string
  approved?: boolean
  limit?: number
  search?: string
}): Promise<Concept[]> {
  const db = createServiceClient()
  let query = db
    .from('concepts')
    .select('*, sources(*), examples(*)')
    .order('created_at', { ascending: false })

  if (options?.approved !== undefined) query = query.eq('approved', options.approved)
  if (options?.status) query = query.eq('status', options.status)
  if (options?.search) query = query.ilike('name', `%${options.search}%`)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getConceptBySlug(slug: string): Promise<Concept | null> {
  const db = createServiceClient()
  const { data, error } = await db
    .from('concepts')
    .select(`
      *,
      sources(*),
      examples(*),
      children:concept_evolutions!parent_concept_id(*, child:concepts!child_concept_id(*)),
      parents:concept_evolutions!child_concept_id(*, parent:concepts!parent_concept_id(*))
    `)
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  if (error) return null
  return data
}

export async function getEvolutionChain(): Promise<Array<{
  parent_concept_id: string
  child_concept_id: string
  relationship_type: string
  parent: { id: string; name: string; status: string }
  child: { id: string; name: string; status: string }
}>> {
  const db = createServiceClient()
  const { data, error } = await db
    .from('concept_evolutions')
    .select(`
      *,
      parent:concepts!parent_concept_id(id, name, status, difficulty, categories),
      child:concepts!child_concept_id(id, name, status, difficulty, categories)
    `)

  if (error) throw error
  return data || []
}

export async function getDigestEntries(weekOf?: string): Promise<DigestEntry[]> {
  const db = createServiceClient()
  let query = db
    .from('digest_entries')
    .select('*, concept:concepts(id, name, slug, status)')
    .order('week_of', { ascending: false })

  if (weekOf) query = query.eq('week_of', weekOf)
  else query = query.limit(20)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createConceptFromDraft(draft: Record<string, unknown>): Promise<string> {
  const db = createServiceClient()
  const slug = (draft.name as string)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

  const { data, error } = await db
    .from('concepts')
    .insert({
      slug,
      name: draft.name,
      abbreviation: draft.abbreviation,
      tldr: draft.tldr,
      definition_technical: draft.definition_technical,
      definition_beginner: draft.definition_beginner,
      status: draft.status || 'emerging',
      difficulty: draft.difficulty || 'intermediate',
      learning_priority: draft.learning_priority || 'know_basics',
      first_appeared: draft.first_appeared,
      popularized_by: draft.popularized_by,
      categories: draft.categories || [],
      approved: false,
    })
    .select('id')
    .single()

  if (error) throw error

  const conceptId = data.id

  if (draft.suggested_sources && Array.isArray(draft.suggested_sources)) {
    await db.from('sources').insert(
      (draft.suggested_sources as Array<Record<string, unknown>>).map((s) => ({ ...s, concept_id: conceptId }))
    )
  }

  if (draft.examples && Array.isArray(draft.examples)) {
    await db.from('examples').insert(
      (draft.examples as Array<Record<string, unknown>>).map((e) => ({ ...e, concept_id: conceptId }))
    )
  }

  return conceptId
}

export async function approveConcept(id: string): Promise<void> {
  const db = createServiceClient()
  const { error } = await db.from('concepts').update({ approved: true }).eq('id', id)
  if (error) throw error
}

export async function deleteConcept(id: string): Promise<void> {
  const db = createServiceClient()
  const { error } = await db.from('concepts').delete().eq('id', id)
  if (error) throw error
}

export async function updateConcept(id: string, updates: Partial<Concept>): Promise<void> {
  const db = createServiceClient()
  const { error } = await db
    .from('concepts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
