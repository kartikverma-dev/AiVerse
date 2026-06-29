export type ConceptStatus = 'emerging' | 'growing' | 'stable' | 'declining' | 'historical'
export type LearningPriority = 'learn_now' | 'know_basics' | 'nice_to_know' | 'historical'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type SourceType = 'official_blog' | 'paper' | 'github' | 'researcher' | 'community'
export type RelationshipType = 'replaced' | 'extended' | 'inspired_by' | 'competes_with'

export interface Concept {
  id: string
  slug: string
  name: string
  abbreviation?: string
  tldr: string
  definition_technical: string
  definition_beginner: string
  difficulty: Difficulty
  status: ConceptStatus
  learning_priority: LearningPriority
  first_appeared?: string
  popularized_by?: string
  categories: string[]
  approved: boolean
  created_at: string
  updated_at: string
  sources?: Source[]
  examples?: Example[]
  children?: ConceptEvolution[]
  parents?: ConceptEvolution[]
}

export interface ConceptEvolution {
  id: string
  parent_concept_id: string
  child_concept_id: string
  relationship_type: RelationshipType
  description?: string
  year?: number
  parent?: Concept
  child?: Concept
}

export interface Source {
  id: string
  concept_id: string
  url: string
  title: string
  source_type: SourceType
  authority_rank: number
  published_date?: string
}

export interface Example {
  id: string
  concept_id: string
  title: string
  description: string
  industry?: string
}

export interface DigestEntry {
  id: string
  week_of: string
  entry_type: 'new_concept' | 'status_change' | 'notable_paper' | 'framework_release'
  concept_id?: string
  summary: string
  concept?: Concept
}

export interface GraphNode {
  id: string
  name: string
  status: ConceptStatus
  difficulty: Difficulty
  categories: string[]
  val?: number
}

export interface GraphLink {
  source: string
  target: string
  relationship_type: RelationshipType
}
