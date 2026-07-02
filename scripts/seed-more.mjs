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

const additionalConcepts = [
  {
    slug: 'transformers',
    name: 'Transformers',
    abbreviation: 'Transformer',
    tldr: 'The foundational neural network architecture behind almost all modern large language models, based on self-attention mechanisms.',
    definition_technical: 'Introduced in "Attention Is All You Need" (2017), the architecture eliminates recurrence in sequence modeling, relying entirely on self-attention to compute representations of input and output without alignment-based RNNs or convolution.',
    definition_beginner: 'Instead of reading a sentence word-by-word like a human, a transformer reads the whole page at once and learns which words are most important in relation to each other.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2017',
    popularized_by: 'Vaswani et al. (Google Brain)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'self-attention-mechanism',
    name: 'Self-Attention Mechanism',
    abbreviation: 'Self-Attention',
    tldr: 'A mechanism that allows a neural network to calculate the mathematical relationship and importance of different words in a sequence.',
    definition_technical: 'Computes dynamic weights for input sequence elements by projecting inputs into Query, Key, and Value vectors, computing the dot-product similarity between queries and keys, applying softmax, and weighting the values.',
    definition_beginner: 'When reading the word "bank" in a sentence, self-attention looks at nearby words like "river" or "money" to figure out which meaning of "bank" is correct.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2017',
    popularized_by: 'Vaswani et al. (Google Brain)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'direct-preference-optimization',
    name: 'Direct Preference Optimization',
    abbreviation: 'DPO',
    tldr: 'An algorithm that aligns LLMs to human preferences directly without training a separate reward model or using reinforcement learning.',
    definition_technical: 'DPO solves a constrained optimization problem by showing that the RLHF objective can be optimized closed-form using a simple binary cross-entropy loss directly on the preference data, skipping the PPO actor-critic loop.',
    definition_beginner: 'Instead of building a complex system to grade the AI\'s responses and train it like a dog, DPO simply shows the AI pairs of good and bad answers and tells it: "do more of the good one, less of the bad one."',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Rafailov et al. (Stanford University)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'lora',
    name: 'Low-Rank Adaptation',
    abbreviation: 'LoRA',
    tldr: 'An adapter-based training method that dramatically reduces the memory and compute required to fine-tune large models by training a tiny subset of weights.',
    definition_technical: 'LoRA parameterizes the weight updates of linear layers in a neural network by factoring the update matrix delta-W into two low-rank matrices A and B. During training, base model weights are frozen, and only A and B are updated.',
    definition_beginner: 'Instead of rewriting an entire 500-page textbook to add new information, you write a few post-it notes and stick them on the relevant pages. It\'s much faster and uses way less ink.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2021',
    popularized_by: 'Hu et al. (Microsoft)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'diffusion-models',
    name: 'Diffusion Models',
    abbreviation: 'Diffusion',
    tldr: 'A class of generative models that generate high-quality images, audio, or video by iteratively removing noise from a starting state.',
    definition_technical: 'Diffusion models work by training a neural network (typically a U-Net) to reverse a forward process that gradually adds Gaussian noise to an image. During generation, the network starts with pure noise and denoises it step-by-step.',
    definition_beginner: 'Imagine starting with a canvas completely covered in static like an old TV, and slowly wiping away the static layer by layer until a clear, beautiful picture appears.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2020',
    popularized_by: 'Ho et al. (UC Berkeley), Stability AI, Midjourney',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'quantization',
    name: 'Model Quantization',
    abbreviation: 'Quantization',
    tldr: 'The process of converting AI model weights from high-precision numbers to lower-precision representations to save memory and run faster.',
    definition_technical: 'Quantization maps continuous floating-point weights (usually FP32 or FP16) to discrete integer representations (like INT8 or INT4). Advanced algorithms like AWQ, GPTQ, and GGUF minimize the drop in accuracy.',
    definition_beginner: 'Instead of storing precise numbers like 3.14159265, you round them to 3.14. The AI loses a tiny bit of precision, but runs 4 times faster and fits on your phone.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2018',
    popularized_by: 'PyTorch, GGML/GGUF creator Georgi Gerganov',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'small-language-models',
    name: 'Small Language Models',
    abbreviation: 'SLMs',
    tldr: 'Highly optimized LLMs with fewer parameters (typically under 8B) designed to run efficiently on consumer hardware or mobile devices.',
    definition_technical: 'SLMs leverage advanced distillation, higher quality datasets (often synthetic), and architectural tricks to achieve reasoning scores close to giant models while fitting within small RAM budgets.',
    definition_beginner: 'A pocket-sized dictionary that contains just the most useful words and facts. It doesn\'t know everything, but it fits in your pocket and answers questions instantly without internet.',
    difficulty: 'beginner',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Microsoft (Phi series), Google (Gemma), Meta (Llama-3 8B)',
    categories: ['Infrastructure', 'Agents'],
    approved: true
  },
  {
    slug: 'in-context-learning',
    name: 'In-Context Learning',
    abbreviation: 'ICL',
    tldr: 'The capability of LLMs to learn tasks on the fly simply by observing examples provided in the input prompt, without updating any model weights.',
    definition_technical: 'ICL utilizes the transformer\'s attention mechanism to map relationships between the input examples and the query at inference time, effectively constructing a temporary model within the activations.',
    definition_beginner: 'Showing a student three examples of French-English translations right before asking them to translate a fourth word. They do it instantly without studying a whole grammar book first.',
    difficulty: 'beginner',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2020',
    popularized_by: 'GPT-3 paper (Brown et al., OpenAI)',
    categories: ['Prompting'],
    approved: true
  },
  {
    slug: 'parameter-efficient-fine-tuning',
    name: 'Parameter-Efficient Fine-Tuning',
    abbreviation: 'PEFT',
    tldr: 'An umbrella term for techniques that adapt large pre-trained models to specific tasks while modifying only a fraction of their parameters.',
    definition_technical: 'PEFT includes additive methods (like prompt tuning and prefix tuning), selective methods (freezing most layers), and reparameterization-based methods (like LoRA).',
    definition_beginner: 'Instead of rebuilding a car from scratch to make it track-ready, you just change the tires and upgrade the brakes. You keep the entire chassis frozen.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2021',
    popularized_by: 'Hugging Face, research community',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'speculative-decoding',
    name: 'Speculative Decoding',
    abbreviation: 'Speculative Decoding',
    tldr: 'An optimization technique that speeds up LLM inference by using a tiny draft model to guess tokens, which are then verified in parallel by a larger model.',
    definition_technical: 'Speculative decoding runs a small draft model autoregressively to generate a sequence of K candidate tokens. The large target model evaluates these K tokens in a single parallel forward pass, accepting or rejecting them using draft verification math.',
    definition_beginner: 'A fast student drafts an essay, and the teacher corrects it in one go. It\'s much faster than the teacher writing every single word themselves.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2022',
    popularized_by: 'Leviathan et al. (Google), Chen et al. (DeepMind)',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'agentic-rag',
    name: 'Agentic RAG',
    abbreviation: 'Agentic RAG',
    tldr: 'An advanced RAG architecture where an autonomous agent plans, self-corrects, and makes multiple loops to gather data, rather than performing a single search.',
    definition_technical: 'Unlike simple RAG which retrieves documents once, Agentic RAG uses an agent loop that evaluates retrieved documents, reformulates search queries if information is missing, and merges results from multiple sources.',
    definition_beginner: 'Instead of doing a single Google search and writing a report on whatever comes up, a researcher does a search, reads a page, realizes they need more detail, does another search, and refines their answer.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'LangChain, LlamaIndex, research community',
    categories: ['Retrieval', 'Agents'],
    approved: true
  },
  {
    slug: 'constitutional-ai',
    name: 'Constitutional AI',
    abbreviation: 'Constitutional AI',
    tldr: 'A method for training safe AI models using a set of rules (a \'constitution\') and automated feedback loops, minimizing human intervention.',
    definition_technical: 'Constitutional AI trains models via self-correction: the AI generates responses, criticizes its own output according to the constitution, refines it, and then fine-tunes itself on the corrected data.',
    definition_beginner: 'Instead of having parents tell a child what is good and bad every day, the child is given a written set of family rules and learns to correct their own behavior based on those rules.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2022',
    popularized_by: 'Anthropic',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'hallucination',
    name: 'AI Hallucination',
    abbreviation: 'Hallucination',
    tldr: 'A phenomenon where an LLM generates text that is grammatically correct and fluent, but factually incorrect or unsupported by its training.',
    definition_technical: 'Hallucinations arise due to the probabilistic nature of autoregressive next-token prediction, limitations in context window attention, noisy training data, and the model prioritizing plausibility over truth.',
    definition_beginner: 'An AI sounding extremely confident while telling you that the third president of the United States was a giraffe. It sounds correct, but it\'s completely made up.',
    difficulty: 'beginner',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2022',
    popularized_by: 'OpenAI, ChatGPT users',
    categories: ['Prompting', 'Training'],
    approved: true
  },
  {
    slug: 'tree-of-thoughts',
    name: 'Tree of Thoughts',
    abbreviation: 'ToT',
    tldr: 'A prompting framework that extends Chain-of-Thought by allowing LLMs to explore multiple reasoning paths in a tree structure and evaluate their progress.',
    definition_technical: 'ToT structures reasoning as a search tree where each node is a coherent language step (a "thought"). It uses search algorithms like BFS or DFS to generate, evaluate, and backtrack through thoughts to find optimal solutions.',
    definition_beginner: 'Instead of just walking down one road thinking step-by-step, the AI stops at crossroads, considers three different paths, tries one, and goes back to a different one if it hits a dead end.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Yao et al. (Princeton University)',
    categories: ['Prompting'],
    approved: true
  },
  {
    slug: 'guardrails',
    name: 'Guardrails',
    abbreviation: 'Guardrails',
    tldr: 'Software layers added to AI systems to filter out unsafe inputs, prevent toxic outputs, and force structural constraints on LLM completions.',
    definition_technical: 'Guardrails operate as wrapper libraries around LLM API calls. They run validation scripts, regex checks, semantic classification, or mini-classification models to intercept prompts and outputs.',
    definition_beginner: 'A digital filter that acts like a bouncer: it checks what you ask the AI to make sure it\'s safe, and checks the AI\'s answer to make sure it doesn\'t leak secrets or say something bad.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'NVIDIA (NeMo Guardrails), Guardrails AI',
    categories: ['Infrastructure', 'Agents'],
    approved: true
  },
  {
    slug: 'generative-engine-optimization',
    name: 'Generative Engine Optimization',
    abbreviation: 'GEO',
    tldr: 'The practice of optimizing content to appear in AI-generated summaries and responses, replacing traditional SEO as users increasingly rely on AI for search results.',
    definition_technical: 'GEO involves structuring website data and text specifically for Retrieval-Augmented Generation (RAG) and LLM search agents. Techniques include citations optimization, jargon alignment, authoritative tone adjustment, schema markup optimization, and formatting content to align with LLM embedding and tokenization models.',
    definition_beginner: 'Just like SEO helps websites rank higher on Google search, GEO helps websites get chosen and cited by AI tools like ChatGPT, Claude, or Perplexity when users ask them questions.',
    difficulty: 'intermediate',
    status: 'emerging',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Academic researchers, digital marketing agencies',
    categories: ['Retrieval', 'Prompting'],
    approved: true
  },
  {
    slug: 'rag-2-0',
    name: 'RAG 2.0',
    abbreviation: 'RAG 2.0',
    tldr: 'An evolution of Retrieval Augmented Generation that is native, end-to-end, and multimodal, retrieving information from diverse sources like technical drawings and audio logs, not just text.',
    definition_technical: 'RAG 2.0 transitions from pipeline-based architectures (separate retriever and generator models) to end-to-end trained multimodal retrieval-generation networks. It performs dense retrieval directly over heterogeneous formats (documents, CAD drawings, audio clips) using joint embedding spaces, feeding multimodal context into natively multimodal LLMs.',
    definition_beginner: 'While regular RAG can only search through text files, RAG 2.0 can search and read blueprints, listen to audio files, and watch videos to find the right answers to your questions.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Contextual AI, enterprise AI vendors',
    categories: ['Retrieval', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'large-reasoning-models',
    name: 'Large Reasoning Models',
    abbreviation: 'LRMs',
    tldr: 'Models specifically designed for complex, multi-step logical thinking, planning, and showing their work.',
    definition_technical: 'LRMs leverage reinforcement learning at scale (RL) to train the model to perform system 2 thinking (deliberate, slow reasoning). They use search algorithms (like Monte Carlo Tree Search) and generate internal hidden chains of thought to plan, backtrack, self-correct, and evaluate hypotheses before producing a response.',
    definition_beginner: 'Instead of blurting out the first word that comes to mind, these models take a few seconds to think, plan, and double-check their math internally before giving you the final answer.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'OpenAI (o1/o3 series), DeepSeek (R1 series)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'agentic-commerce',
    name: 'Agentic Commerce',
    abbreviation: 'Agentic Commerce',
    tldr: 'A B2B model where AI agents autonomously negotiate prices, compare products, and execute purchases between companies without human intervention.',
    definition_technical: 'Agentic Commerce uses multi-agent orchestration to conduct automated B2B procurement. Buyer and seller agents utilize game-theory negotiation protocols, access APIs for inventory checks, evaluate SLA terms via smart contracts, and execute secure automated transactions.',
    definition_beginner: 'Instead of employees spending days emailing suppliers to get quotes and place orders, a company\'s AI agent negotiates prices and buys products directly from a supplier\'s AI agent.',
    difficulty: 'intermediate',
    status: 'emerging',
    learning_priority: 'nice_to_know',
    first_appeared: '2025',
    popularized_by: 'B2B AI platforms, autonomous agent developers',
    categories: ['Agents'],
    approved: true
  }
]

async function seed() {
  console.log('Seeding additional concepts...')
  
  // 1. Insert/upsert concepts
  const { data: inserted, error: conceptError } = await db
    .from('concepts')
    .upsert(additionalConcepts, { onConflict: 'slug' })
    .select()

  if (conceptError) {
    console.error('Error inserting concepts:', conceptError)
    return
  }
  console.log(`Successfully seeded ${inserted.length} concepts.`)

  // Fetch all concept IDs to establish relations
  const { data: allConcepts, error: fetchError } = await db
    .from('concepts')
    .select('id, slug')

  if (fetchError) {
    console.error('Error fetching concepts:', fetchError)
    return
  }

  const slugMap = {}
  allConcepts.forEach(c => {
    slugMap[c.slug] = c.id
  })

  // 2. Define relationships
  const relationships = [
    { parent: 'transformers', child: 'self-attention-mechanism', type: 'extended', desc: 'Self-attention is the core component that enables transformer architecture', year: 2017 },
    { parent: 'transformers', child: 'mixture-of-experts', type: 'extended', desc: 'Mixture of Experts scales transformer capacity efficiently using sparse routing', year: 2017 },
    { parent: 'fine-tuning', child: 'lora', type: 'extended', desc: 'LoRA is a parameter-efficient method of performing fine-tuning', year: 2021 },
    { parent: 'lora', child: 'parameter-efficient-fine-tuning', type: 'inspired_by', desc: 'LoRA popularized parameter-efficient fine-tuning frameworks', year: 2021 },
    { parent: 'reinforcement-learning-from-human-feedback', child: 'direct-preference-optimization', type: 'replaced', desc: 'DPO replaces RLHF by optimizing for preferences without a separate reward model', year: 2023 },
    { parent: 'retrieval-augmented-generation', child: 'agentic-rag', type: 'extended', desc: 'Agentic RAG extends RAG with multi-step search loops and self-correction', year: 2024 },
    { parent: 'chain-of-thought-prompting', child: 'tree-of-thoughts', type: 'extended', desc: 'Tree of Thoughts expands CoT from a single line to a tree search of reasoning paths', year: 2023 },
    { parent: 'prompt-engineering', child: 'in-context-learning', type: 'inspired_by', desc: 'Prompt engineering techniques are built on top of the in-context learning capability of LLMs', year: 2020 },
    { parent: 'retrieval-augmented-generation', child: 'rag-2-0', type: 'extended', desc: 'RAG 2.0 upgrades RAG to be end-to-end trained and natively multimodal', year: 2024 },
    { parent: 'chain-of-thought-prompting', child: 'large-reasoning-models', type: 'extended', desc: 'LRMs build native step-by-step reasoning and hidden chains of thought directly into the model training loop', year: 2024 },
    { parent: 'loop-engineering', child: 'agentic-commerce', type: 'inspired_by', desc: 'Agentic commerce applies autonomous multi-step execution loops to business procurement and transactions', year: 2025 },
    { parent: 'retrieval-augmented-generation', child: 'generative-engine-optimization', type: 'extended', desc: 'GEO extends optimization strategies to retrieval-based AI search engines', year: 2024 },
    { parent: 'knowledge-distillation', child: 'small-language-models', type: 'extended', desc: 'Knowledge distillation enables small language models to inherit reasoning capabilities from large teacher models', year: 2023 },
    { parent: 'quantization', child: 'small-language-models', type: 'extended', desc: 'Model quantization allows small language models to fit and run efficiently on local/edge devices', year: 2023 }
  ]

  const evolutionsToInsert = []
  relationships.forEach(rel => {
    const parentId = slugMap[rel.parent]
    const childId = slugMap[rel.child]
    if (parentId && childId) {
      evolutionsToInsert.push({
        parent_concept_id: parentId,
        child_concept_id: childId,
        relationship_type: rel.type,
        description: rel.desc,
        year: rel.year
      })
    }
  })

  if (evolutionsToInsert.length > 0) {
    const { error: relError } = await db
      .from('concept_evolutions')
      .upsert(evolutionsToInsert, { onConflict: 'parent_concept_id,child_concept_id' })

    if (relError) {
      console.error('Error inserting relations:', relError)
    } else {
      console.log(`Successfully seeded ${evolutionsToInsert.length} relationships.`)
    }
  }

  console.log('Seeding complete! 🎉')
}

seed().catch(err => console.error(err))
