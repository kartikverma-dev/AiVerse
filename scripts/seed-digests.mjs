import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read env variables from .env.local if present
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
  console.log('No .env.local file found or failed to load:', e.message)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment!')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function seedDigests() {
  console.log('Fetching existing concepts to map digests...')
  const { data: concepts, error: fetchError } = await db
    .from('concepts')
    .select('id, slug, name')

  if (fetchError) {
    console.error('Error fetching concepts:', fetchError)
    return
  }

  const slugMap = {}
  concepts.forEach(c => {
    slugMap[c.slug] = c.id
  })

  // Clear existing digests to avoid duplicate clutter and start fresh
  console.log('Clearing existing digest entries...')
  const { error: clearError } = await db.from('digest_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (clearError) {
    console.error('Error clearing digests:', clearError)
  }

  const digestsToSeed = [
    // Week of 2026-06-29
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'generative-engine-optimization',
      summary: 'Generative Engine Optimization (GEO) gains traction as search behaviors shift. Content creators are optimizing formatting and technical markup for RAG engines instead of standard SEO.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'status_change',
      concept_slug: 'large-reasoning-models',
      summary: 'Large Reasoning Models (LRMs) status updated to Growing with the emergence of reinforcement learning scaled models that show their work.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'agentic-commerce',
      summary: 'Agentic Commerce enters early deployment stages, enabling autonomous AI agents to negotiate and execute B2B transactions.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'agentic-rag',
      summary: 'Agentic RAG has emerged as a dominant design pattern for complex enterprise retrieval. By leveraging autonomous agent loops that perform iterative, multi-step search queries and self-correction, it bypasses the limitations of single-shot retrieval pipelines.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'status_change',
      concept_slug: 'speculative-decoding',
      summary: 'Speculative Decoding adoption surges as high-throughput inference demands grow. Leading platforms are pairing small draft models (like Llama-3-Draft) with larger instruct models to achieve up to a 2.5x speedup at inference time.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'notable_paper',
      concept_slug: 'direct-preference-optimization',
      summary: 'A new study evaluates DPO vs. PPO across a range of math and reasoning benchmarks, finding that DPO maintains equivalent alignment quality while reducing the training hardware footprint by 40%.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'state-space-models',
      summary: 'State Space Models (like Mamba) are seeing increased adoption as researchers look for sub-quadratic alternatives to self-attention for processing extremely long contexts.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'test-time-compute',
      summary: 'Test-Time Compute emerges as the key paradigm shift in reasoning models, with frameworks prioritizing search and verification at inference time over massive pre-training runs.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'graph-rag',
      summary: 'GraphRAG reaches prominence as a framework for building highly accurate knowledge retrieval engines by combining vector databases with structured knowledge graphs.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'mixture-of-depths',
      summary: 'Mixture of Depths (MoD) is introduced by researchers, showing that language models can dynamically bypass layer calculations for simple tokens to optimize compute budgets.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'world-models',
      summary: 'World Models gain attention as physical simulators for autonomous systems, moving beyond basic prediction to model visual dynamics and causal state transitions.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'direct-nash-optimization',
      summary: 'Direct Nash Optimization (DNO) emerges as a game-theoretic reinforcement learning alignment algorithm, proving highly competitive against RLHF and DPO.'
    },
    {
      week_of: '2026-06-29',
      entry_type: 'new_concept',
      concept_slug: 'corrective-rag',
      summary: 'Corrective RAG (CRAG) is adopted to enhance retrieval reliability by evaluating document accuracy and dynamically triggering corrective live web searches.'
    },
    // Week of 2026-06-22
    {
      week_of: '2026-06-22',
      entry_type: 'new_concept',
      concept_slug: 'rag-2-0',
      summary: 'RAG 2.0 introduced, showing a shift from text-only pipelines to native, end-to-end multimodal retrieval architectures.'
    },
    {
      week_of: '2026-06-22',
      entry_type: 'framework_release',
      concept_slug: 'quantization',
      summary: 'The llama.cpp community has officially released GGUF v3, bringing native support for mixed-precision matrix multiplication. This allows consumer-grade GPUs to run highly quantized 70B models with negligible perplexity loss.'
    },
    {
      week_of: '2026-06-22',
      entry_type: 'new_concept',
      concept_slug: 'guardrails',
      summary: 'Guardrails enter mainstream adoption with the release of NVIDIA NeMo Guardrails 2.0. The update provides zero-latency interceptors to screen toxic outputs and enforce strict structured JSON schema formats on LLM APIs.'
    },
    {
      week_of: '2026-06-22',
      entry_type: 'framework_release',
      concept_slug: 'prompt-caching',
      summary: 'Major API providers introduce Prompt Caching, allowing developers to cache long contexts (like system instructions or documentation) and achieve up to a 90% reduction in latency and costs.'
    },
    {
      week_of: '2026-06-22',
      entry_type: 'new_concept',
      concept_slug: 'bitnet',
      summary: 'BitNet b1.58 (1-bit LLMs) gets widely discussed for its capacity to run large language models using integer addition and subtraction, eliminating expensive floating-point multiplications.'
    },
    {
      week_of: '2026-06-22',
      entry_type: 'framework_release',
      concept_slug: 'ring-attention',
      summary: 'Ring Attention implementation goes main-stream, allowing context windows to scale to millions of tokens by distributing key-value attention matrices across ring-connected GPUs.'
    },
    {
      week_of: '2026-06-22',
      entry_type: 'new_concept',
      concept_slug: 'diffusion-forcing',
      summary: 'Diffusion Forcing is introduced as a novel generation paradigm, combining seq2seq autoregression with stable, drift-free diffusion modeling.'
    },
    // Week of 2026-06-15
    {
      week_of: '2026-06-15',
      entry_type: 'status_change',
      concept_slug: 'small-language-models',
      summary: 'Small Language Models (SLMs) have reached stable maturity. Deployments of Microsoft Phi-3 and Llama-3-8B on edge devices have proven that sub-10B parameter models can handle complex local reasoning tasks reliably.'
    },
    {
      week_of: '2026-06-15',
      entry_type: 'framework_release',
      concept_slug: 'structured-outputs',
      summary: 'Structured Outputs become natively supported across major models, guaranteeing 100% adherence to specified JSON schemas by constraining token sampling logits.'
    },
    {
      week_of: '2026-06-15',
      entry_type: 'status_change',
      concept_slug: 'mechanistic-interpretability',
      summary: 'Mechanistic Interpretability transitions from theoretical research to debugging tool, with engineers using attribution graphs to trace how models plan and reason.'
    },
    {
      week_of: '2026-06-15',
      entry_type: 'new_concept',
      concept_slug: 'flow-engineering',
      summary: 'Flow Engineering is defined as the practice of structuring agentic workflows as deterministic state graphs rather than simple chat loops.'
    },
    {
      week_of: '2026-06-15',
      entry_type: 'notable_paper',
      concept_slug: 'tree-of-thoughts',
      summary: 'Researchers publish a detailed audit of Tree of Thoughts prompting applied to mathematical theorem proving, demonstrating a 3x increase in success rate compared to simple Chain-of-Thought prompting.'
    },
    // Week of 2026-06-08
    {
      week_of: '2026-06-08',
      entry_type: 'new_concept',
      concept_slug: 'constitutional-ai',
      summary: 'Constitutional AI enters active development for corporate alignment datasets. By training models using a rule-based "constitution" rather than thousands of manual human labels, organizations can scale safe AI systems with minimal human overhead.'
    },
    {
      week_of: '2026-06-08',
      entry_type: 'framework_release',
      concept_slug: 'lora',
      summary: 'Hugging Face updates PEFT with multi-LoRA routing, enabling developers to serve hundreds of fine-tuned task-specific adapters concurrently on a single base model instance.'
    },
    // Week of 2026-06-01
    {
      week_of: '2026-06-01',
      entry_type: 'status_change',
      concept_slug: 'hallucination',
      summary: 'Hallucination mitigation reaches a new milestone. Real-time guardrail architectures combined with structured outputs have reduced random generation errors in commercial conversational interfaces by 75%.'
    },
    {
      week_of: '2026-06-01',
      entry_type: 'notable_paper',
      concept_slug: 'transformers',
      summary: 'A retrospective paper reviews Vaswani\'s 2017 transformer paper, mapping the architectural modifications (like RoPE and RMSNorm) that have enabled modern context windows to scale to millions of tokens.'
    }
  ]

  const recordsToInsert = []
  digestsToSeed.forEach(d => {
    const conceptId = slugMap[d.concept_slug]
    if (conceptId) {
      recordsToInsert.push({
        week_of: d.week_of,
        entry_type: d.entry_type,
        concept_id: conceptId,
        summary: d.summary
      })
    } else {
      console.warn(`Could not find concept with slug: ${d.concept_slug}`)
    }
  })

  if (recordsToInsert.length > 0) {
    console.log(`Inserting ${recordsToInsert.length} digest entries...`)
    const { error: insertError } = await db.from('digest_entries').insert(recordsToInsert)
    if (insertError) {
      console.error('Error inserting digests:', insertError)
    } else {
      console.log('Successfully seeded all weekly digest entries! 🎉')
    }
  } else {
    console.error('No digest records to insert.')
  }
}

seedDigests().catch(err => console.error(err))
