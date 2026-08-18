import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load env variables
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
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment!')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const batch2Concepts = [
  // --- PROMPT & CONTEXT ENGINEERING ---
  {
    slug: 'skeleton-of-thought',
    name: 'Skeleton-of-Thought',
    abbreviation: 'SoT',
    tldr: 'An inference acceleration technique that prompts the model to first outline an answer skeleton, then expand point details in parallel.',
    definition_technical: 'SoT reduces end-to-end decoding latency by decoupling generation into a skeleton drafting phase followed by parallel expansion of each point across independent API requests or batched streams.',
    definition_beginner: 'Instead of writing an essay sentence by sentence, the AI writes bullet-point headings first, then fills in all the paragraphs simultaneously.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Ning et al. (Tsinghua University)',
    categories: ['Prompting', 'Inference'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2307.15337', title: 'Skeleton-of-Thought: Large Language Models Can Answer Faster via Parallel Decoding', source_type: 'paper', authority_rank: 1, published_date: '2023-07-28' }
    ]
  },
  {
    slug: 'chain-of-verification',
    name: 'Chain-of-Verification',
    abbreviation: 'CoVe',
    tldr: 'A self-correction prompting framework where the model drafts a baseline response, generates verification questions, answers them independently, and revises its final output.',
    definition_technical: 'CoVe mitigates hallucinations by decomposing response verification into 4 explicit phases: draft response generation, verification question drafting, execution of verification answers (fact-checking without draft context bias), and final response revision.',
    definition_beginner: 'An AI proofreader that double-checks its own story by making a list of factual quiz questions about what it wrote, answering them independently, and fixing any errors.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Dhuliawala et al. (Meta AI)',
    categories: ['Prompting', 'Alignment'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2309.11495', title: 'Chain-of-Verification Reduces Hallucination in Large Language Models', source_type: 'paper', authority_rank: 1, published_date: '2023-09-20' }
    ]
  },
  {
    slug: 'dspy-programming-model',
    name: 'DSPy Declarative Programming Model',
    abbreviation: 'DSPy',
    tldr: 'A framework that replaces manual prompt engineering with compiled, declarative Python signatures and automated prompt optimization algorithms.',
    definition_technical: 'DSPy abstracts LLM pipelines into declarative modules (Signatures, Predictors, Teleprompters). DSPy compilers automatically optimize prompts and few-shot examples using metrics-driven optimizers like BootstrapFewShot and MIPRO.',
    definition_beginner: 'Treating AI prompts like actual computer code—instead of hand-crafting prompts by trial and error, DSPy automatically tunes and writes the best prompt for you.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Khattab et al. (Stanford NLP)',
    categories: ['Prompting', 'Agents'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2310.03714', title: 'DSPy: Compiling Declarative Language Model Calls from Language-Model-Centric Programs', source_type: 'paper', authority_rank: 1, published_date: '2023-10-05' }
    ]
  },

  // --- EFFICIENT FINE-TUNING & MODEL MERGING ---
  {
    slug: 'qlora',
    name: 'Quantized Low-Rank Adaptation',
    abbreviation: 'QLoRA',
    tldr: 'An efficient fine-tuning technique using 4-bit NormalFloat quantization and double quantization to fine-tune large LLMs on consumer GPUs.',
    definition_technical: 'QLoRA quantizes base model parameters into a 4-bit NormalFloat (NF4) data type, adding Low-Rank Adaptation (LoRA) trainable adapter weights in 16-bit BrainFloatingPoint (BF16), using Double Quantization and Paged Optimizers to eliminate memory spikes.',
    definition_beginner: 'A trick that compresses massive AI models down to 4-bit precision so you can train a giant 70-billion parameter model on a single gaming graphics card.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Dettmers et al. (UW / Tim Dettmers)',
    categories: ['Training', 'Quantization'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2305.14314', title: 'QLoRA: Efficient Fine-Tuning of Quantized LLMs', source_type: 'paper', authority_rank: 1, published_date: '2023-05-23' }
    ]
  },
  {
    slug: 'dora',
    name: 'Weight-Decomposed Low-Rank Adaptation',
    abbreviation: 'DoRA',
    tldr: 'A fine-tuning method decomposing weight matrices into magnitude and direction components to closely match full fine-tuning performance.',
    definition_technical: 'DoRA decouples directional updates from magnitude scaling in weight matrices. By applying LoRA specifically to directional vectors while learning explicit magnitude scalars, DoRA accelerates convergence and achieves full fine-tuning accuracy.',
    definition_beginner: 'An upgrade to standard LoRA that trains both how hard an AI pushes (magnitude) and which direction it moves (direction), getting better accuracy with minimal extra memory.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Liu et al. (NVIDIA & UT Austin)',
    categories: ['Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2402.09353', title: 'DoRA: Weight-Decomposed Low-Rank Adaptation', source_type: 'paper', authority_rank: 1, published_date: '2024-02-14' }
    ]
  },
  {
    slug: 'ties-merging',
    name: 'TIES Model Merging',
    abbreviation: 'TIES-Merging',
    tldr: 'A model merging algorithm resolving parameter interference by trimming small updates, resolving sign conflicts, and averaging disjoint task vectors.',
    definition_technical: 'TIES-Merging (TRIM, Elect Sign, & Merge) combines multiple fine-tuned models derived from the same base model. It trims top-K redundant parameter changes, elects consensus parameter signs, and averages only non-conflicting task vectors.',
    definition_beginner: 'Fusing multiple specialized AI models (like a coding expert and a math expert) into one master model without them ruining each other\'s skills.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Yadav et al. (UNC Chapel Hill)',
    categories: ['Training', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2306.01793', title: 'TIES-Merging: Resolving Interference When Merging Models', source_type: 'paper', authority_rank: 1, published_date: '2023-06-02' }
    ]
  },

  // --- ALIGNMENT & PREFERENCE TUNING ---
  {
    slug: 'kahneman-tversky-optimization',
    name: 'Kahneman-Tversky Optimization',
    abbreviation: 'KTO',
    tldr: 'A preference alignment algorithm derived from prospect theory that learns from binary good/bad labels rather than paired preference data.',
    definition_technical: 'KTO directly optimizes policy weights using unpaired data labeled simply as desirable or undesirable. Grounded in behavioral economics (Kahneman-Tversky prospect theory), KTO models human loss aversion without requiring costly paired preference datasets (A vs B).',
    definition_beginner: 'Aligning AI using simple thumbs-up or thumbs-down feedback instead of forcing humans to compare two long responses side-by-side.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Ethayarajh et al. (Contextual AI & Stanford)',
    categories: ['Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2402.01306', title: 'KTO: Model Alignment as Prospect Theoretic Optimization', source_type: 'paper', authority_rank: 1, published_date: '2024-02-02' }
    ]
  },
  {
    slug: 'odds-ratio-preference-optimization',
    name: 'Odds Ratio Preference Optimization',
    abbreviation: 'ORPO',
    tldr: 'A reference-model-free alignment method combining supervised fine-tuning and preference alignment into a single loss function.',
    definition_technical: 'ORPO appends an odds ratio penalty directly to the standard cross-entropy SFT loss. This penalizes rejected generation odds while favoring accepted generation odds, eliminating the need for a reference model (like DPO) and saving 50% GPU memory.',
    definition_beginner: 'A streamlined alignment method that teaches AI proper style and safety in a single step without needing a second reference model running in memory.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Hong et al. (KAIST)',
    categories: ['Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2403.07691', title: 'ORPO: Monolithic Preference Optimization without Reference Model', source_type: 'paper', authority_rank: 1, published_date: '2024-03-12' }
    ]
  },

  // --- ADVANCED RAG VARIATIONS ---
  {
    slug: 'hypothetical-document-embeddings',
    name: 'Hypothetical Document Embeddings',
    abbreviation: 'HyDE',
    tldr: 'A retrieval technique where an LLM generates a hypothetical answer to a user question, which is then embedded to perform vector search.',
    definition_technical: 'HyDE bypasses query-document semantic domain gaps. When a user asks a query, an LLM drafts a hypothetical answer document. The hypothetical document vector is then used for k-NN similarity search against real document chunks.',
    definition_beginner: 'Instead of searching a database with a short question, the AI writes a mock target answer first and uses that mock document to find real matching articles.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2022',
    popularized_by: 'Gao et al. (LTI CMU)',
    categories: ['Retrieval', 'Prompting'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2212.10496', title: 'Precise Zero-Shot Dense Retrieval without Relevance Labels', source_type: 'paper', authority_rank: 1, published_date: '2022-12-20' }
    ]
  },
  {
    slug: 'colbert-v2',
    name: 'ColBERT & Late Interaction Retrieval',
    abbreviation: 'ColBERT',
    tldr: 'A fast, fine-grained retrieval model preserving token-level embeddings via late interaction (MaxSim operator) over document passages.',
    definition_technical: 'ColBERT decouples query and document encoding into multi-vector token matrices. During search, it uses a fast MaxSim operator (computing maximum cosine similarity between query and document token vectors), offering cross-encoder retrieval accuracy at bi-encoder speeds.',
    definition_beginner: 'A search engine that compares every single word vector in your search phrase against every word vector in articles, giving pinpoint retrieval accuracy in milliseconds.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2021',
    popularized_by: 'Khattab & Zou (Stanford University)',
    categories: ['Retrieval', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2112.01488', title: 'ColBERTv2: Effective and Efficient Retrieval via Lightweight Token-Level Compression', source_type: 'paper', authority_rank: 1, published_date: '2021-12-02' }
    ]
  },

  // --- MULTI-AGENT & TOOL FRAMEWORKS ---
  {
    slug: 'toolformer',
    name: 'Toolformer',
    abbreviation: 'Toolformer',
    tldr: 'A language model trained to self-teach tool usage by inserting explicit API call tokens and evaluating whether tool results improve text prediction.',
    definition_technical: 'Toolformer generates candidate API call tokens (calculator, Wikipedia, QA engine, translation) into text sequences via self-supervised learning. Calls are executed and filtered based on whether API outputs reduce perplexity on future tokens.',
    definition_beginner: 'An AI model that automatically learned when to pause typing and invoke a calculator or web search tool to make sure its facts and math were 100% correct.',
    difficulty: 'intermediate',
    status: 'historical',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Schick et al. (Meta AI Research)',
    categories: ['Agents', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2302.04761', title: 'Toolformer: Language Models Can Teach Themselves to Use Tools', source_type: 'paper', authority_rank: 1, published_date: '2023-02-09' }
    ]
  },
  {
    slug: 'langgraph-stateful-orchestration',
    name: 'LangGraph Stateful Agent Orchestration',
    abbreviation: 'LangGraph',
    tldr: 'A framework for building cyclical, stateful multi-agent applications using directed graphs with built-in persistence and human-in-the-loop controls.',
    definition_technical: 'LangGraph models agent workflows as cyclic state graphs. Nodes represent LLM calls or tool execution steps, while edges define conditional branching logic. Graph state is persisted across turns, supporting checkpointing and time-travel debugging.',
    definition_beginner: 'A blueprint builder for AI agents that lets developers loop agent steps, track state memory, and pause for human approval before taking critical actions.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'LangChain Team',
    categories: ['Agents'],
    approved: true,
    sources: [
      { url: 'https://github.com/langchain-ai/langgraph', title: 'LangGraph: Build resilient multi-agent applications', source_type: 'github', authority_rank: 1, published_date: '2024-01-18' }
    ]
  },

  // --- VISION & VIDEO ARCHITECTURES ---
  {
    slug: 'segment-anything-2',
    name: 'Segment Anything Model 2',
    abbreviation: 'SAM 2',
    tldr: 'A unified foundation model for promptable visual segmentation in both static images and real-time video streams.',
    definition_technical: 'SAM 2 extends transformer vision segmentation to spatio-temporal video domains. It incorporates a streaming memory module (memory encoder, memory bank, and memory attention) to track object masks across video frames in real time.',
    definition_beginner: 'A vision AI that lets you click on any object in a video (a car, a person, a dog) and automatically tracks and outlines that object across every frame.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'FAIR (Meta AI)',
    categories: ['Multimodal', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2408.00714', title: 'SAM 2: Segment Anything in Images and Videos', source_type: 'paper', authority_rank: 1, published_date: '2024-08-01' }
    ]
  },
  {
    slug: 'florence-2',
    name: 'Florence-2 Unified Vision Model',
    abbreviation: 'Florence-2',
    tldr: 'A compact vision foundation model unifying image captioning, object detection, segmentation, and OCR into a text-to-text sequence model.',
    definition_technical: 'Florence-2 treats diverse visual tasks as sequence-to-sequence problems. Using a DaViT vision encoder and Transformer sequence decoder, Florence-2 processes images and textual prompt tags to output region bounding box coordinates and textual labels.',
    definition_beginner: 'A Swiss-army-knife vision model that handles reading text in photos, detecting objects, and describing images using one single unified architecture.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Microsoft Research',
    categories: ['Multimodal', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2311.06242', title: 'Florence-2: Advancing a Unified Representation for Visual Tasks', source_type: 'paper', authority_rank: 1, published_date: '2023-11-10' }
    ]
  },

  // --- MECHANISTIC INTERPRETABILITY & REASONING ---
  {
    slug: 'representation-engineering',
    name: 'Representation Engineering',
    abbreviation: 'RepE',
    tldr: 'A top-down interpretability approach focused on reading and controlling high-level cognitive concepts in neural representation space.',
    definition_technical: 'RepE shifts interpretability from single-neuron analysis to population-level vector representations. Using Reading Vectors (PCA on activation differences) and Control Vectors (adding directional vectors during forward passes), RepE steers honesty, utility, and safety in real time.',
    definition_beginner: 'Reading and steering the AI\'s internal thoughts by tracking direction vectors inside its mind—like adding a positive vector to make the AI respond more truthfully.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Zou et al. (Center for AI Safety / UC Berkeley)',
    categories: ['Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2310.01405', title: 'Representation Engineering: A Top-Down Approach to AI Transparency', source_type: 'paper', authority_rank: 1, published_date: '2023-10-02' }
    ]
  },
  {
    slug: 'llm-as-a-judge',
    name: 'LLM-as-a-Judge Evaluation',
    abbreviation: 'LLM Judge',
    tldr: 'An evaluation methodology using powerful frontier language models to benchmark and score output quality, alignment, and correctness of smaller candidate models.',
    definition_technical: 'LLM-as-a-Judge replaces manual human evaluation with calibrated LLM scoring prompts (pairwise comparison or single-answer grading). Research shows strong agreement between frontier judge models (like GPT-4) and human expert preferences on benchmarks like MT-Bench.',
    definition_beginner: 'Using a top-tier AI (like GPT-4) to grade, critique, and score answers written by other AI models automatically.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Zheng et al. (LMSYS / UC Berkeley)',
    categories: ['Alignment', 'Prompting'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2306.05685', title: 'Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena', source_type: 'paper', authority_rank: 1, published_date: '2023-06-09' }
    ]
  }
]

const batch2Relationships = [
  { parent: 'prompt-engineering', child: 'skeleton-of-thought', type: 'extended', desc: 'SoT optimizes prompt execution by decoupling skeleton drafting from parallel point expansion', year: 2023 },
  { parent: 'prompt-engineering', child: 'chain-of-verification', type: 'extended', desc: 'CoVe uses verification question prompts to self-correct hallucinations', year: 2023 },
  { parent: 'lora', child: 'qlora', type: 'extended', desc: 'QLoRA applies 4-bit NormalFloat quantization to base weights before attaching LoRA adapters', year: 2023 },
  { parent: 'lora', child: 'dora', type: 'extended', desc: 'DoRA decouples weight magnitude and direction updates for improved LoRA performance', year: 2024 },
  { parent: 'direct-preference-optimization', child: 'kahneman-tversky-optimization', type: 'competes_with', desc: 'KTO replaces paired preference data with unpaired binary feedback grounded in prospect theory', year: 2024 },
  { parent: 'direct-preference-optimization', child: 'odds-ratio-preference-optimization', type: 'replaced', desc: 'ORPO merges SFT and preference alignment into a single loss without reference models', year: 2024 },
  { parent: 'retrieval-augmented-generation', child: 'hypothetical-document-embeddings', type: 'extended', desc: 'HyDE generates hypothetical target documents to bridge semantic domain gaps in RAG vector search', year: 2022 },
  { parent: 'dense-passage-retrieval', child: 'colbert-v2', type: 'extended', desc: 'ColBERT uses late interaction MaxSim token vectors to boost retrieval accuracy', year: 2021 },
  { parent: 'agentic-ai', child: 'toolformer', type: 'inspired_by', desc: 'Toolformer pioneered self-taught API execution in language models', year: 2023 },
  { parent: 'agentic-workflow-patterns', child: 'langgraph-stateful-orchestration', type: 'extended', desc: 'LangGraph provides stateful cyclic graphs for complex multi-agent workflows', year: 2024 },
  { parent: 'mechanistic-interpretability', child: 'representation-engineering', type: 'extended', desc: 'RepE steers high-level model concepts using population-level representation vectors', year: 2023 },
  { parent: 'synthetic-data-curation-pipelines', child: 'llm-as-a-judge', type: 'inspired_by', desc: 'LLM-as-a-Judge provides automated quality filtering in synthetic data pipelines', year: 2023 }
]

async function runSeed() {
  console.log(`Starting Batch 2 seed for ${batch2Concepts.length} concepts...`)

  const slugToIdMap = {}
  const { data: existing } = await db.from('concepts').select('id, slug')
  if (existing) {
    existing.forEach(c => slugToIdMap[c.slug] = c.id)
  }

  let added = 0
  let updated = 0

  for (const c of batch2Concepts) {
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

  console.log(`Batch 2 complete: ${added} new added, ${updated} updated.`)

  const rels = []
  for (const r of batch2Relationships) {
    const pId = slugToIdMap[r.parent]
    const cId = slugToIdMap[r.child]
    if (pId && cId) {
      rels.push({ parent_concept_id: pId, child_concept_id: cId, relationship_type: r.type, description: r.desc, year: r.year })
    }
  }

  if (rels.length > 0) {
    await db.from('concept_evolutions').upsert(rels, { onConflict: 'parent_concept_id,child_concept_id' })
    console.log(`Upserted ${rels.length} relationships in Batch 2.`)
  }
}

runSeed().catch(e => console.error(e))
