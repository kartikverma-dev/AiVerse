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
  },
  {
    slug: 'state-space-models',
    name: 'State Space Models',
    abbreviation: 'SSMs',
    tldr: 'An alternative neural network architecture to Transformers that scales linearly with sequence length, offering high efficiency for long contexts.',
    definition_technical: 'State Space Models (like Mamba) map 1D input sequences to 1D outputs through an implicit latent state. Unlike Transformers which have quadratic complexity O(N^2) due to self-attention, SSMs utilize selective parameters and scan algorithms to achieve linear complexity O(N) while maintaining comparable modeling capabilities.',
    definition_beginner: 'Instead of comparing every word in a book to every other word (which takes a lot of time as the book gets longer), SSMs act like a very smart tape recorder that compresses what it hears step-by-step, making it super fast even for huge documents.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Albert Gu and Tri Dao (Mamba paper)',
    categories: ['Infrastructure', 'Training'],
    approved: true
  },
  {
    slug: 'liquid-neural-networks',
    name: 'Liquid Neural Networks',
    abbreviation: 'LNNs',
    tldr: 'A class of time-continuous neural networks that adapt dynamically to new incoming data streams, making them highly efficient for time-series and robotics.',
    definition_technical: 'LNNs are built on ordinary differential equations (ODEs) where the model\'s parameters and states change continuously over time based on the input signal. Unlike traditional neural networks with static weights, LNNs can adapt their behavior dynamically, using far fewer parameters to process sequential data.',
    definition_beginner: 'Imagine a computer brain made of liquid that can reshape itself on the fly depending on what it sees, rather than a solid piece of concrete that is fixed after it\'s built.',
    difficulty: 'advanced',
    status: 'emerging',
    learning_priority: 'nice_to_know',
    first_appeared: '2020',
    popularized_by: 'Ramin Hasani and Daniela Rus (MIT CSAIL / Liquid AI)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'test-time-compute',
    name: 'Test-Time Compute',
    abbreviation: 'TTC',
    tldr: 'Scaling the computation allocated during inference (rather than training) to allow models to search, verify, and reason longer before answering.',
    definition_technical: 'Inference-time scaling leverages reinforcement learning, search trees (like Monte Carlo Tree Search), and verification loops. Instead of generating a response in a single forward pass, the model allocates compute dynamically at test time to explore multiple solution pathways, evaluate intermediate steps, and backtrack.',
    definition_beginner: 'Instead of giving a split-second answer to a hard math question, the AI takes its time—writing scratchpads, checking its math, and thinking for 30 seconds before responding, resulting in much higher accuracy.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'OpenAI (o1/o3 series), DeepSeek (R1)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'flash-attention',
    name: 'FlashAttention',
    abbreviation: 'FlashAttention',
    tldr: 'An IO-aware exact self-attention algorithm that speeds up Transformer training and inference by optimizing memory reads/writes.',
    definition_technical: 'FlashAttention speeds up attention by tiling and computing softmax on blocks of inputs incrementally, avoiding the materialization of the giant N x N attention matrix in the slow GPU HBM (High Bandwidth Memory) and keeping intermediate activations in fast SRAM.',
    definition_beginner: 'Instead of writing down a giant, messy multiplication table on a blackboard (which takes a lot of time to write and erase), FlashAttention does the math in its head using a small scratchpad, making the AI run up to 4 times faster.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2022',
    popularized_by: 'Tri Dao et al.',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'kahneman-tversky-optimization',
    name: 'Kahneman-Tversky Optimization',
    abbreviation: 'KTO',
    tldr: 'An alignment algorithm that aligns LLMs directly using binary feedback (thumbs up/down) instead of pair preferences, based on human utility theory.',
    definition_technical: 'KTO aligns models based on prospect theory, maximizing the utility of generation outputs directly. It operates on single-point binary label datasets (good vs bad output) rather than pairwise preferences, making data collection cheaper and optimization more stable than DPO or RLHF.',
    definition_beginner: 'Instead of showing the AI two options and asking it to choose which is better, KTO just looks at single thumbs-up or thumbs-down ratings. It aligns the AI to be helpful based on how humans value gains and losses.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'Contextual AI researchers',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'sparse-autoencoders',
    name: 'Sparse Autoencoders',
    abbreviation: 'SAEs',
    tldr: 'A machine learning method used to deconstruct neural network representations into interpretable, human-understandable features.',
    definition_technical: 'SAEs are trained to reconstruct the intermediate activations of a model. By forcing the latent representations to be sparse, the autoencoder maps the dense, polysemantic activations of the model into thousands of monosemantic (single-concept) directions.',
    definition_beginner: 'Like taking a complicated, blended smoothie and perfectly separating it back into pure strawberries, bananas, and milk. It lets us look inside the AI\'s brain and see exactly which neurons represent specific ideas.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Anthropic, OpenAI Superalignment/Alignment teams',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'prompt-caching',
    name: 'Prompt Caching',
    abbreviation: 'Prompt Caching',
    tldr: 'An optimization that stores the computed state of a long prompt in memory so subsequent requests using the same prefix can reuse it, slashing costs and latency.',
    definition_technical: 'Prompt caching stores the KV Cache of common prefixes (such as system prompts, documents, or context history). When a new request shares the cached prefix, the model skips computing attention keys and values for that prefix, changing computational complexity for that segment to O(1) time.',
    definition_beginner: 'If you\'re asking an AI multiple questions about a 500-page book, prompt caching ensures it only reads the book once. For every question after that, it remembers the book and answers instantly, saving you time and money.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Anthropic, DeepSeek, OpenAI',
    categories: ['Infrastructure', 'Prompting'],
    approved: true
  },
  {
    slug: 'structured-outputs',
    name: 'Structured Outputs',
    abbreviation: 'Structured Outputs',
    tldr: 'A model capability where completions are guaranteed to match a specific schema (like JSON or database columns) by constraining token generation.',
    definition_technical: 'Structured output mechanisms constrain the logits at each decoding step. By mapping a JSON schema or Pydantic model to a context-free grammar (CFG), the inference engine only samples tokens that conform to the syntax rules, ensuring 100% compliance with the target schema.',
    definition_beginner: 'Forces the AI to write its answer in a pre-designed form (like a strict questionnaire) rather than writing free-form text. This makes it easy for other computer programs to read the AI\'s answers without errors.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'OpenAI, Outlines library, instructor library',
    categories: ['Prompting', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'model-merging',
    name: 'Model Merging',
    abbreviation: 'Model Merging',
    tldr: 'A technique that combines the weights of two or more separately trained LLMs into a single model without requiring additional training.',
    definition_technical: 'Model merging uses linear or spherical interpolation of parameter weights (such as SLERP, ties-merging, or DARE) to combine models fine-tuned on different tasks, creating a multi-task model that retains the strengths of all its parents.',
    definition_beginner: 'Taking a model that is great at writing poetry and another model that is great at writing code, and blending their brains together like paint to create a single model that is great at both, without spending money on training.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2023',
    popularized_by: 'Hugging Face community, Arcee.ai',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'graph-rag',
    name: 'Graph Retrieval-Augmented Generation',
    abbreviation: 'GraphRAG',
    tldr: 'An advanced RAG architecture that constructs a structured knowledge graph from raw text to retrieve information based on entity relationships, rather than simple vector proximity.',
    definition_technical: 'GraphRAG combines vector search with graph databases. It utilizes LLMs to parse unstructured documents into a graph of nodes (entities) and edges (relations), then groups them into community hierarchies. At query time, it retrieves information from relevant communities and walks the graph to answer global and multi-document synthesis queries.',
    definition_beginner: 'Instead of searching for random matching paragraphs, GraphRAG builds a mind map of everything in your files (who, what, and how they relate) and reads the mind map to answer questions, making it much better at connecting the dots.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Microsoft Research',
    categories: ['Retrieval', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'bitnet',
    name: 'BitNet (1.58-bit LLMs)',
    abbreviation: 'BitNet',
    tldr: 'An ultra-efficient neural network paradigm where model weights are represented using ternary values (-1, 0, 1), drastically reducing memory and compute costs.',
    definition_technical: 'BitNet binarizes or ternarizes weights into {-1, 0, 1} using a quantization-aware scaling factor. This replaces high-precision floating-point matrix multiplications (GEMM) with simple integer addition and subtraction, achieving comparable perplexity to FP16 models while running with orders of magnitude lower memory and energy consumption.',
    definition_beginner: 'Traditional AI uses complex decimal numbers for its thoughts. BitNet simplifies this to just three states: off (-1), neutral (0), or on (1). It makes the AI so lightweight that a powerful model can run on a basic smartphone chip without draining the battery.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Microsoft Research (BitNet b1.58)',
    categories: ['Infrastructure', 'Training'],
    approved: true
  },
  {
    slug: 'mixture-of-depths',
    name: 'Mixture of Depths',
    abbreviation: 'MoD',
    tldr: 'A compute-routing technique where a neural network dynamically decides how many layers of calculation to spend on each token, bypassing unnecessary compute.',
    definition_technical: 'MoD uses a router at each layer block to select a sparse subset of tokens that are allowed to undergo attention and feed-forward computations at that layer. The remaining tokens bypass the layer block via residual connections, maintaining a fixed computational footprint per forward pass while dynamically optimizing resource allocation.',
    definition_beginner: 'In regular AI, the model spends the exact same brain power on the word "the" as it does on a complex word like "quantum". Mixture of Depths lets the AI skip layers of thinking for simple words, saving its energy for the hardest words in the sentence.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'Google DeepMind',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'ring-attention',
    name: 'Ring Attention',
    abbreviation: 'Ring Attention',
    tldr: 'A distributed attention mechanism that partitions context sequences across a ring of GPUs, enabling models to handle near-infinite context windows.',
    definition_technical: 'Ring Attention divides the self-attention key-value matrix calculations across a ring-shaped network of GPUs. It overlaps the communication of key-value blocks between adjacent GPUs with the local dot-product computations, avoiding the memory limits of a single host and scaling context length linearly with the number of devices.',
    definition_beginner: 'If you have a book so long that one computer runs out of memory trying to read it, Ring Attention passes pages of the book in a circle among a dozen computers. They do the math together, allowing the AI to read millions of words at once.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Hao Liu, Tri Dao, Pieter Abbeel (UC Berkeley)',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'world-models',
    name: 'World Models',
    abbreviation: 'World Models',
    tldr: 'AI models designed to build a spatial, physical, and causal understanding of environments, allowing agents to simulate future states.',
    definition_technical: 'World Models parameterize the dynamics of a physical environment by learning to predict the next visual or state representation given a history of observations and actions. Typically structured with an encoder (visual), a recurrent/transformer state model (dynamics), and a decoder, they allow agents to plan in a latent "dream" space.',
    definition_beginner: 'Instead of just guessing the next word, a World Model builds a virtual 3D simulator of reality in its head. It knows that if it pushes a cup off a table, the cup will fall and break, letting the AI plan its actions by simulating the future.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2018',
    popularized_by: 'Ha and Schmidhuber (2018), Yann LeCun (JEPA/V-JEPA), World Labs',
    categories: ['Training', 'Agents'],
    approved: true
  },
  {
    slug: 'direct-nash-optimization',
    name: 'Direct Nash Optimization',
    abbreviation: 'DNO',
    tldr: 'An iterative alignment algorithm that trains LLMs using game-theoretic self-play to converge on a Nash equilibrium of human preferences.',
    definition_technical: 'DNO models preference alignment as a zero-sum game between two generation policies. Rather than training a reward model to output static scalar scores (like RLHF), DNO uses direct preference feedback to optimize the model toward a Nash equilibrium policy that cannot be easily defeated or exploited by any competitor policy.',
    definition_beginner: 'Instead of grading the AI with a simple points system, DNO has the AI play a game of "better answer" against itself over and over. By competing with itself, the AI learns to write answers that are incredibly balanced and hard to find flaws in.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'Microsoft Research',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'corrective-rag',
    name: 'Corrective RAG',
    abbreviation: 'CRAG',
    tldr: 'A retrieval paradigm that evaluates the quality of retrieved documents and dynamically triggers web searches or filtering to correct poor context.',
    definition_technical: 'CRAG integrates a lightweight retrieval evaluator that grades the confidence score of retrieved documents as Correct, Incorrect, or Ambiguous. If incorrect, the system ignores the documents and queries external search APIs; if ambiguous, it combines local search results with web-retrieved summaries.',
    definition_beginner: 'Normal RAG blindly believes whatever document it finds. Corrective RAG checks the documents first: if it realizes the documents are useless or outdated, it stops and performs a live Google search to get the right answer.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Research community, LangChain / LlamaIndex integrations',
    categories: ['Retrieval', 'Agents'],
    approved: true
  },
  {
    slug: 'mechanistic-interpretability',
    name: 'Mechanistic Interpretability',
    abbreviation: 'MechInt',
    tldr: 'The subfield of AI safety focused on reverse-engineering neural networks into understandable algorithms and circuit diagrams.',
    definition_technical: 'Mechanistic Interpretability seeks to demystify neural network activations by identifying "circuits"—subnetworks of attention heads and MLP layers that perform specific algorithm-like tasks (e.g. induction heads, indirect object identification). It heavily utilizes tools like Sparse Autoencoders (SAEs) to discover monosemantic directions.',
    definition_beginner: 'Instead of treating the AI like an mysterious black box, mechanistic interpretability is like taking a magnifying glass to the AI\'s transistors to trace how a specific thought travels from input to output, letting us understand exactly why it thinks the way it does.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2022',
    popularized_by: 'Anthropic, Chris Olah, Neel Nanda',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'diffusion-forcing',
    name: 'Diffusion Forcing',
    abbreviation: 'Diffusion Forcing',
    tldr: 'A training and generation paradigm that trains diffusion models to run on sequential representations, combining language-like autoregression with diffusion.',
    definition_technical: 'Diffusion Forcing allows a diffusion model to generate sequences by denoising tokens or latent variables autoregressively. Rather than denoising the entire sequence at once, it applies a sliding window diffusion process, enabling stable generation of infinite-length sequences (e.g. video, actions) without accumulation of drift.',
    definition_beginner: 'Instead of painting a whole movie scene-by-scene from start to finish, Diffusion Forcing draws the first few seconds, starts blurring and drawing the next few seconds while keeping the past in memory, ensuring the video remains smooth and never drifts off-topic.',
    difficulty: 'advanced',
    status: 'emerging',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'MIT and Harvard researchers',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'flow-engineering',
    name: 'Flow Engineering',
    abbreviation: 'Flow Engineering',
    tldr: 'A design pattern for building LLM applications where reasoning is structured as a deterministic, graph-based flow of specialized prompts and checks rather than a single chat prompt.',
    definition_technical: 'Flow engineering structures LLM application logic as a Directed Acyclic Graph (DAG) or state machine (e.g., using frameworks like LangGraph). Each node executes a specialized prompt (e.g., generator, tester, parser) and passes structured data along edges, enabling deterministic control over multi-step thinking and self-correction.',
    definition_beginner: 'Instead of asking the AI to write a whole app in one go, you build an assembly line: one AI drafts the code, the next AI tests it, a third AI reviews the errors, and they loop back until it\'s perfect.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Cognition, LangChain, AlphaCodium',
    categories: ['Agents', 'Coding', 'Retrieval'],
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
    { parent: 'quantization', child: 'small-language-models', type: 'extended', desc: 'Model quantization allows small language models to fit and run efficiently on local/edge devices', year: 2023 },
    { parent: 'transformers', child: 'state-space-models', type: 'competes_with', desc: 'State Space Models like Mamba compete with Transformer architecture by achieving linear O(N) complexity for long sequences', year: 2023 },
    { parent: 'transformers', child: 'flash-attention', type: 'extended', desc: 'FlashAttention accelerates self-attention computation inside standard Transformer architectures', year: 2022 },
    { parent: 'large-reasoning-models', child: 'test-time-compute', type: 'inspired_by', desc: 'Test-Time Compute scaling is the primary architectural driver behind modern Large Reasoning Models like OpenAI o1', year: 2024 },
    { parent: 'direct-preference-optimization', child: 'kahneman-tversky-optimization', type: 'extended', desc: 'KTO extends preference optimization to binary feedback, avoiding pairwise preference requirements', year: 2024 },
    { parent: 'context-engineering', child: 'prompt-caching', type: 'extended', desc: 'Prompt caching is a crucial infrastructure optimization for efficient context engineering', year: 2024 },
    { parent: 'function-calling', child: 'structured-outputs', type: 'extended', desc: 'Structured outputs provide mathematical guarantees for JSON schemas used in function calling', year: 2023 },
    { parent: 'knowledge-distillation', child: 'sparse-autoencoders', type: 'inspired_by', desc: 'Sparse Autoencoders extract monosemantic features, which can aid in analyzing and optimizing knowledge distillation pathways', year: 2023 },
    { parent: 'fine-tuning', child: 'model-merging', type: 'extended', desc: 'Model merging blends different fine-tuned checkpoints into a single multi-task model', year: 2023 },
    { parent: 'retrieval-augmented-generation', child: 'graph-rag', type: 'extended', desc: 'GraphRAG extends standard RAG by constructing a structured knowledge graph to map relationships across documents', year: 2024 },
    { parent: 'quantization', child: 'bitnet', type: 'extended', desc: 'BitNet represents the ultimate extension of quantization, compressing weights down to 1.58 bits', year: 2023 },
    { parent: 'mixture-of-experts', child: 'mixture-of-depths', type: 'inspired_by', desc: 'Mixture of Depths is inspired by Mixture of Experts, applying routing to layer blocks instead of feed-forward expert networks', year: 2024 },
    { parent: 'transformers', child: 'ring-attention', type: 'extended', desc: 'Ring Attention extends Transformers to process near-infinite contexts by distributing attention calculations in a ring network', year: 2023 },
    { parent: 'multimodal-ai', child: 'world-models', type: 'extended', desc: 'World Models extend multimodal inputs to predict physical visual dynamics and state transitions', year: 2018 },
    { parent: 'direct-preference-optimization', child: 'direct-nash-optimization', type: 'extended', desc: 'DNO builds on preference optimization by framing alignment as a game-theoretic self-play equilibrium', year: 2024 },
    { parent: 'agentic-rag', child: 'corrective-rag', type: 'extended', desc: 'Corrective RAG serves as a key pattern in agentic retrieval, dynamically evaluating and correcting retrieved facts', year: 2024 },
    { parent: 'sparse-autoencoders', child: 'mechanistic-interpretability', type: 'inspired_by', desc: 'Sparse Autoencoders are a key tool that enables mechanistic interpretability of model circuits', year: 2023 },
    { parent: 'diffusion-models', child: 'diffusion-forcing', type: 'extended', desc: 'Diffusion Forcing extends diffusion model training to support sequence autoregression and drift-free video generation', year: 2024 },
    { parent: 'loop-engineering', child: 'flow-engineering', type: 'extended', desc: 'Flow Engineering translates loop execution patterns into structured, deterministic state graphs', year: 2024 }
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
