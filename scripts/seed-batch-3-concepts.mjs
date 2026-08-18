import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

try {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach(line => {
      const parts = line.split('=')
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const val = parts.slice(1).join('=').trim()
        process.env[key] = val
      }
    })
  }
} catch (e) {
  console.log('No .env.local file loaded:', e.message)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing environment variables!')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const batch3Concepts = [
  // --- INFERENCE ACCELERATION ---
  {
    slug: 'medusa-speculative-decoding',
    name: 'Medusa Multi-Head Speculative Decoding',
    abbreviation: 'Medusa',
    tldr: 'An inference acceleration framework adding multiple decoding heads to a single base LLM to predict multiple future tokens in parallel.',
    definition_technical: 'Medusa attaches multiple extra decoding heads to the top of the frozen transformer backbone. Each head predicts tokens at future offsets (t+1, t+2, t+k), generating candidate token trees verified in a single forward pass using tree attention.',
    definition_beginner: 'Attaching extra prediction heads to an AI so it guesses 3 or 4 words ahead in every single step, speeding up text generation without needing a separate draft model.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Cai et al. (Together AI & Princeton)',
    categories: ['Inference', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2401.10774', title: 'Medusa: Simple LLM Generation Acceleration with Multiple Decoding Heads', source_type: 'paper', authority_rank: 1, published_date: '2024-01-19' }
    ]
  },
  {
    slug: 'streaming-llm-attention-sinks',
    name: 'StreamingLLM & Attention Sinks',
    abbreviation: 'StreamingLLM',
    tldr: 'An inference framework retaining initial prompt tokens (attention sinks) to enable language models to stream infinitely long text without performance degradation.',
    definition_technical: 'StreamingLLM identifies that early tokens (initial sequence tokens) absorb massive softmax attention scores ("attention sinks"). By preserving initial tokens alongside a sliding window of recent tokens, models generate millions of streaming tokens without perplexity explosion.',
    definition_beginner: 'Keeping the very first words of a conversation anchored in memory as an anchor point, allowing the AI to stream endless text without forgetting how to speak.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Xiao et al. (MIT & Meta AI)',
    categories: ['Inference', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2309.17453', title: 'Efficient Streaming Language Models with Attention Sinks', source_type: 'paper', authority_rank: 1, published_date: '2023-09-29' }
    ]
  },

  // --- ADVANCED RAG & RETRIEVAL ---
  {
    slug: 'adaptive-rag',
    name: 'Adaptive-RAG Strategy Router',
    abbreviation: 'Adaptive-RAG',
    tldr: 'A RAG framework using a dynamic classifier to route user queries between non-retrieval direct answers, single-step retrieval, and complex multi-step iterative RAG.',
    definition_technical: 'Adaptive-RAG employs a classifier model trained to predict query complexity. Simple queries are answered directly by the LLM without retrieval, medium queries invoke single-step RAG, and complex multi-hop queries trigger iterative graph retrieval.',
    definition_beginner: 'A smart traffic cop for search: answering easy questions immediately, doing quick searches for medium questions, and running deep research for complex questions.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Jeong et al. (KAIST)',
    categories: ['Retrieval', 'Agents'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2403.14403', title: 'Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Query Complexity', source_type: 'paper', authority_rank: 1, published_date: '2024-03-21' }
    ]
  },

  // --- AGENT FRAMEWORKS ---
  {
    slug: 'autogen-multi-agent-framework',
    name: 'AutoGen Multi-Agent Framework',
    abbreviation: 'AutoGen',
    tldr: 'An open-source programming framework enabling developers to build multi-agent applications using conversational agent abstractions.',
    definition_technical: 'AutoGen structures multi-agent workflows around ConversableAgent primitives. Agents communicate asynchronously via natural language or JSON tool calls, supporting autonomous group chats, code execution sandboxes, and human input loops.',
    definition_beginner: 'A framework for orchestrating teams of specialized AI agents that talk to each other, write code, run tests, and fix bugs until a project is done.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Microsoft Research (Wu et al.)',
    categories: ['Agents'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2308.08155', title: 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', source_type: 'paper', authority_rank: 1, published_date: '2023-08-16' }
    ]
  },
  {
    slug: 'swe-agent',
    name: 'SWE-agent Repository Fixing Agent',
    abbreviation: 'SWE-agent',
    tldr: 'An autonomous software engineering agent system equipped with a specialized Agent-Computer Interface (ACI) for navigating and fixing GitHub repositories.',
    definition_technical: 'SWE-agent introduces custom Agent-Computer Interfaces (ACIs) optimized for LLMs to view, edit, search, and run tests on codebases. It sets top performance scores on the SWE-bench benchmark for autonomous GitHub issue resolution.',
    definition_beginner: 'An AI developer designed to take a real GitHub bug ticket, search through thousands of code files, write a fix, run tests, and submit a pull request.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Yang et al. (Princeton University)',
    categories: ['Agents', 'Coding'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2405.15793', title: 'SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering', source_type: 'paper', authority_rank: 1, published_date: '2024-05-24' }
    ]
  },

  // --- ALTERNATIVE & EFFICIENT ARCHITECTURES ---
  {
    slug: 'retentive-networks',
    name: 'Retentive Networks',
    abbreviation: 'RetNet',
    tldr: 'An architecture introducing retention mechanisms as a successor to Transformers, offering parallel training, O(1) inference, and linear memory scaling.',
    definition_technical: 'RetNet replaces self-attention with a multi-scale retention mechanism. It supports parallel representation during training, recurrent O(1) state updating during inference, and chunkwise recurrent processing for long context processing.',
    definition_beginner: 'A proposed replacement for Transformers that trains super fast like a Transformer, but runs inference blazingly fast like an RNN.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Sun et al. (Microsoft Research)',
    categories: ['Architectures', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2307.08621', title: 'Retentive Network: A Successor to Transformer for Large Language Models', source_type: 'paper', authority_rank: 1, published_date: '2023-07-17' }
    ]
  },
  {
    slug: 'evol-instruct',
    name: 'Evol-Instruct Automated Data Synthesis',
    abbreviation: 'Evol-Instruct',
    tldr: 'An automated method using LLMs to rewrite simple instruction data into increasingly complex, diverse, and difficult instruction sets.',
    definition_technical: 'Evol-Instruct applies 2 evolution strategies: In-Depth Evolving (adding constraints, deepening inquiries, concretizing abstractions) and In-Breadth Evolving (generating novel topics). This creates high-complexity SFT datasets for model alignment.',
    definition_beginner: 'Using AI to take easy practice questions and rewrite them into challenging, multi-step exam questions to train super-smart models.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Xu et al. (WizardLM / Microsoft)',
    categories: ['Training', 'Prompting'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2304.12244', title: 'WizardLM: Empowering Large Language Models to Follow Complex Instructions', source_type: 'paper', authority_rank: 1, published_date: '2023-04-24' }
    ]
  }
]

const batch3Relationships = [
  { parent: 'speculative-decoding', child: 'medusa-speculative-decoding', type: 'extended', desc: 'Medusa replaces draft models with multi-head predictions directly on the target LLM', year: 2024 },
  { parent: 'kv-cache-compression', child: 'streaming-llm-attention-sinks', type: 'extended', desc: 'StreamingLLM uses attention sinks to maintain infinite sequence context without memory growth', year: 2023 },
  { parent: 'retrieval-augmented-generation', child: 'adaptive-rag', type: 'extended', desc: 'Adaptive-RAG routes queries dynamically based on difficulty complexity', year: 2024 },
  { parent: 'agentic-ai', child: 'autogen-multi-agent-framework', type: 'inspired_by', desc: 'AutoGen popularized multi-agent conversational workflows', year: 2023 },
  { parent: 'agentic-coding', child: 'swe-agent', type: 'extended', desc: 'SWE-agent uses Agent-Computer Interfaces to fix complex software repositories', year: 2024 },
  { parent: 'transformers', child: 'retentive-networks', type: 'replaced', desc: 'RetNet replaces self-attention with multi-scale retention mechanisms', year: 2023 },
  { parent: 'synthetic-data-curation-pipelines', child: 'evol-instruct', type: 'inspired_by', desc: 'Evol-Instruct provides automated evolutionary complexity upgrades for SFT data', year: 2023 }
]

async function runSeed() {
  console.log(`Starting Batch 3 seed for ${batch3Concepts.length} concepts...`)

  const slugToIdMap = {}
  const { data: existing } = await db.from('concepts').select('id, slug')
  if (existing) existing.forEach(c => slugToIdMap[c.slug] = c.id)

  let added = 0
  let updated = 0

  for (const c of batch3Concepts) {
    const { sources, ...conceptData } = c
    const { data: upserted, error } = await db.from('concepts').upsert(conceptData, { onConflict: 'slug' }).select('id, slug').single()
    if (error) {
      console.error(`Error on ${c.slug}:`, error.message)
      continue
    }
    if (upserted) {
      const isNew = !slugToIdMap[upserted.slug]
      slugToIdMap[upserted.slug] = upserted.id
      if (isNew) added++
      else updated++

      if (sources && sources.length > 0) {
        await db.from('sources').delete().eq('concept_id', upserted.id)
        const sourcesToInsert = sources.map(s => ({
          concept_id: upserted.id,
          url: s.url,
          title: s.title,
          source_type: s.source_type,
          authority_rank: s.authority_rank,
          published_date: s.published_date
        }))
        await db.from('sources').insert(sourcesToInsert)
      }
    }
  }

  console.log(`Batch 3 complete: ${added} new added, ${updated} updated.`)

  const rels = []
  for (const r of batch3Relationships) {
    const pId = slugToIdMap[r.parent]
    const cId = slugToIdMap[r.child]
    if (pId && cId) {
      rels.push({ parent_concept_id: pId, child_concept_id: cId, relationship_type: r.type, description: r.desc, year: r.year })
    }
  }

  if (rels.length > 0) {
    await db.from('concept_evolutions').upsert(rels, { onConflict: 'parent_concept_id,child_concept_id' })
    console.log(`Upserted ${rels.length} relationships in Batch 3.`)
  }
}

runSeed().catch(e => console.error(e))
