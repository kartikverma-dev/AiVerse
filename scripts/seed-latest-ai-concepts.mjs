import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read env variables from .env.local
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

const latestAIConcepts = [
  // --- 1. REASONING & TEST-TIME COMPUTE ---
  {
    slug: 'group-relative-policy-optimization',
    name: 'Group Relative Policy Optimization',
    abbreviation: 'GRPO',
    tldr: 'A memory-efficient reinforcement learning algorithm that normalizes rewards across a group of sampled responses, eliminating the need for a separate critic model.',
    definition_technical: 'GRPO samples a group of outputs for each prompt from the old policy, computes their rewards, and normalizes them across the group to calculate the advantage function. This avoids maintaining a separate value network (critic), dramatically reducing GPU memory usage during RL training.',
    definition_beginner: 'Instead of hiring a full-time critic to score every draft answer, GRPO asks the AI to write 4 different answers to the same problem, compares them against each other, and rewards the ones that performed best relative to the group.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'DeepSeek (Shao et al.)',
    categories: ['Reasoning', 'Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2402.03300', title: 'DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models', source_type: 'paper', authority_rank: 1, published_date: '2024-02-05' },
      { url: 'https://github.com/deepseek-ai/DeepSeek-R1', title: 'DeepSeek-R1 Technical Report', source_type: 'official_blog', authority_rank: 1, published_date: '2025-01-20' }
    ]
  },
  {
    slug: 'process-reward-models',
    name: 'Process Reward Models',
    abbreviation: 'PRM',
    tldr: 'Reward models trained to evaluate and score every intermediate step of a reasoning chain rather than just the final answer.',
    definition_technical: 'Unlike Outcome Reward Models (ORMs) which provide a single scalar reward for the final output, Process Reward Models evaluate each step in a chain-of-thought generation. PRMs are trained using active learning on human or compiler step annotations to detect reasoning errors early.',
    definition_beginner: 'Like a math teacher grading your exam step-by-step: even if your final answer is wrong, the teacher awards points for correct intermediate steps and flags exactly where you made your calculation error.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'OpenAI (Lightman et al.) & Math-Shepherd',
    categories: ['Reasoning', 'Alignment'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2305.20050', title: 'Let\'s Verify Step by Step', source_type: 'paper', authority_rank: 1, published_date: '2023-05-31' }
    ]
  },
  {
    slug: 'reinforcement-learning-with-verifiable-rewards',
    name: 'Reinforcement Learning with Verifiable Rewards',
    abbreviation: 'RLVR',
    tldr: 'RL training relying on deterministic verifiers like code compilers, math engines, or formal logic solvers instead of neural reward models.',
    definition_technical: 'RLVR leverages rule-based automated verifiers that return binary or exact scalar feedback (e.g., test case execution pass/fail, mathematical proof verification). This eliminates reward hacking and score drift common in neural reward models.',
    definition_beginner: 'Training AI by having it solve code puzzles or math problems where a computer program checks the answer with 100% certainty—no human grading needed.',
    difficulty: 'intermediate',
    status: 'emerging',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'DeepSeek, OpenAI, Anthropic',
    categories: ['Reasoning', 'Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2501.12948', title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning', source_type: 'paper', authority_rank: 1, published_date: '2025-01-22' }
    ]
  },
  {
    slug: 'extended-chain-of-thought',
    name: 'Extended Chain-of-Thought',
    abbreviation: 'Extended CoT',
    tldr: 'Inference-time reasoning where models generate thousands of internal thinking tokens to explore, verify, and revise solutions before producing a final answer.',
    definition_technical: 'Extended CoT enables models to perform test-time compute allocation. The model generates natural language rationale tokens inside special delimiter tags (<think>...</think>), self-correcting mistakes, testing hypotheses, and reframing complex problems prior to outputting user-facing text.',
    definition_beginner: 'Giving the AI a scratchpad to talk to itself, double-check its math, try alternative ideas, and fix its own mistakes before giving you its official response.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'OpenAI (o1/o3) & DeepSeek-R1',
    categories: ['Reasoning', 'Prompting'],
    approved: true,
    sources: [
      { url: 'https://openai.com/index/learning-to-reason-with-llms/', title: 'Learning to Reason with LLMs (OpenAI o1)', source_type: 'official_blog', authority_rank: 1, published_date: '2024-09-12' }
    ]
  },
  {
    slug: 'test-time-scaling-laws',
    name: 'Test-Time Scaling Laws',
    abbreviation: 'Test-Time Compute',
    tldr: 'Empirical scaling laws demonstrating that increasing computational expenditure during inference yields compute-optimal performance gains comparable to larger pretraining budgets.',
    definition_technical: 'Test-time compute scaling formulates inference scaling through search algorithms (MCTS, beam search), sampling diversity, and revision loops. Research shows spending more FLOPs during inference can enable a smaller model to outperform much larger models trained on massive pretraining budgets.',
    definition_beginner: 'Instead of building a bigger brain, you give a medium-sized brain more time to think through difficult problems.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Snell et al. (UC Berkeley / Google DeepMind)',
    categories: ['Reasoning', 'Architectures', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2408.03314', title: 'Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters', source_type: 'paper', authority_rank: 1, published_date: '2024-08-06' }
    ]
  },
  {
    slug: 'quiet-star',
    name: 'Quiet-STaR',
    abbreviation: 'Quiet-STaR',
    tldr: 'A method allowing language models to learn to generate unspoken thoughts at every token position during pretraining on web text.',
    definition_technical: 'Quiet-STaR generalizes Self-Taught Reasoner (STaR) by generating intermediate rationale tokens at every token location in text, evaluating how much those thoughts improve prediction of future tokens, and updating model parameters via REINFORCE with a mixing head.',
    definition_beginner: 'Teaching an AI to quietly think a thought before speaking every single word, making its speech far more coherent without requiring special prompt triggers.',
    difficulty: 'advanced',
    status: 'emerging',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'Zelikman et al. (Stanford University)',
    categories: ['Reasoning', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2403.09629', title: 'Quiet-STaR: Language Models Can Teach Themselves to Think Before Speaking', source_type: 'paper', authority_rank: 1, published_date: '2024-03-14' }
    ]
  },
  {
    slug: 'tree-of-thoughts',
    name: 'Tree-of-Thoughts',
    abbreviation: 'ToT',
    tldr: 'A problem-solving framework extending Chain-of-Thought by maintaining a tree of intermediate reasoning states and exploring them with BFS or DFS search.',
    definition_technical: 'ToT frames language model reasoning as search over a state space tree where each node represents a coherent text thought. The framework evaluates state promises using self-consistency prompting or heuristics, enabling systematic lookahead and backtracking.',
    definition_beginner: 'Instead of following one single line of thought, the AI creates a branching tree of possibilities, evaluates each path, and backtracks if a path hits a dead end.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Yao et al. (Princeton & Google DeepMind)',
    categories: ['Reasoning', 'Prompting'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2305.10601', title: 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models', source_type: 'paper', authority_rank: 1, published_date: '2023-05-17' }
    ]
  },

  // --- 2. AGENTIC AI & MULTI-AGENT PROTOCOLS ---
  {
    slug: 'computer-use-agents',
    name: 'Computer Use Agents',
    abbreviation: 'GUI Agents',
    tldr: 'AI agents capable of observing desktop screens via visual perception and taking actions using virtual mouse movements, clicks, and keyboard strokes.',
    definition_technical: 'Computer Use Agents process screen screenshots through Vision-Language Models (VLMs), outputting grounding pixel coordinates and system action commands (click, drag, type, shortcut) to control desktop OS environments via GUI automation APIs.',
    definition_beginner: 'An AI assistant that can look at your computer monitor, move the mouse cursor, click buttons, and type into software programs just like a human sitting at a desk.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Anthropic (Claude 3.5 Sonnet Computer Use)',
    categories: ['Agents', 'Multimodal'],
    approved: true,
    sources: [
      { url: 'https://www.anthropic.com/news/3-5-models-and-computer-use', title: 'Developing Computer Use Capabilities with Claude 3.5 Sonnet', source_type: 'official_blog', authority_rank: 1, published_date: '2024-10-22' }
    ]
  },
  {
    slug: 'browser-use-agents',
    name: 'Browser Use Agents',
    abbreviation: 'Web Agents',
    tldr: 'Autonomous web agents designed to navigate websites, interact with DOM elements, complete complex multi-page forms, and extract live web data.',
    definition_technical: 'Browser Use Agents interact with browser accessibility trees, HTML DOM nodes, and rendered screenshot frames. They utilize Playwright or Puppeteer automation engines to execute multi-step web workflows while managing session cookies and dynamically loading SPA pages.',
    definition_beginner: 'An AI robot that opens a real web browser, navigates travel booking sites, fills out search forms, handles popups, and finds the best flight prices for you.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Browser-Use Open Source & WebArena Benchmark',
    categories: ['Agents', 'Retrieval'],
    approved: true,
    sources: [
      { url: 'https://github.com/browser-use/browser-use', title: 'Browser-Use: Make websites accessible for AI agents', source_type: 'github', authority_rank: 2, published_date: '2024-11-01' }
    ]
  },
  {
    slug: 'agentic-memory-architectures',
    name: 'Agentic Memory Architectures',
    abbreviation: 'Agent Memory',
    tldr: 'Structured memory systems dividing agent state into working context, short-term conversational history, and long-term episodic/semantic stores.',
    definition_technical: 'Agentic Memory separates memory storage into context window buffers, episodic recall (vector databases indexed by time and context), and semantic knowledge banks (graph memory or structured JSON profiles). Systems use reflection loops to extract, summarize, and consolidate memories.',
    definition_beginner: 'Giving an AI agent both a notepad for immediate tasks and a long-term journal to remember past conversations, user preferences, and learned skills across months.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Packer et al. (MemGPT / UC Berkeley)',
    categories: ['Agents', 'Retrieval'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2310.08560', title: 'MemGPT: Towards LLMs as Operating Systems', source_type: 'paper', authority_rank: 1, published_date: '2023-10-12' }
    ]
  },
  {
    slug: 'agent-eval-benchmarks',
    name: 'Agentic Evaluation Benchmarks',
    abbreviation: 'Agent Evals',
    tldr: 'Standardized evaluation suites designed to measure autonomous agent goal fulfillment across code execution, web navigation, and OS task scenarios.',
    definition_technical: 'Unlike static Q&A benchmarks (e.g. MMLU), agent benchmarks evaluate multi-step action trajectories in sandboxed environments. Tasks evaluate task completion percentage, execution efficiency, error recovery, and safety across realistic repositories or web applications.',
    definition_beginner: 'Obstacle courses for AI agents that test whether they can actually fix a real software bug, resolve customer support tickets, or navigate complex websites autonomously.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'SWE-bench (Princeton), WebArena (CMU), GAIA (Meta)',
    categories: ['Agents', 'Alignment'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2310.06770', title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', source_type: 'paper', authority_rank: 1, published_date: '2023-10-10' }
    ]
  },

  // --- 3. ARCHITECTURE & EFFICIENT INFERENCE ---
  {
    slug: 'mamba-2',
    name: 'Mamba-2 & State Space Duality',
    abbreviation: 'Mamba-2 / SSD',
    tldr: 'An advanced sequence architecture introducing State Space Duality (SSD) to unify State Space Models and attention mechanisms with fast GPU matrix multiplication.',
    definition_technical: 'Mamba-2 establishes a mathematical equivalence between Selective State Space Models and structured masked attention mechanisms. By exploiting State Space Duality (SSD), Mamba-2 uses tensor core matrix multiplications (GEMMs), achieving 2-8x faster training than Mamba-1 while scaling linearly with sequence length.',
    definition_beginner: 'A massive architectural upgrade that lets AI process infinitely long documents at blazingly fast speeds without the heavy computational slowing down of traditional Transformers.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Dao & Gu (Carnegie Mellon & Princeton)',
    categories: ['Architectures', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2405.21060', title: 'Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality', source_type: 'paper', authority_rank: 1, published_date: '2024-05-31' }
    ]
  },
  {
    slug: 'hybrid-ssm-transformer',
    name: 'Hybrid SSM-Transformer Architectures',
    abbreviation: 'Hybrid SSM-Attention',
    tldr: 'Neural network architectures interleaving state-space layers (for linear sequence scaling) with self-attention layers (for high-fidelity memory retrieval).',
    definition_technical: 'Hybrid models interleave Mamba or Recurrent SSM blocks with multi-head attention layers (e.g. 1 attention layer every 4 SSM blocks). This design retains linear FLOP and memory complexity during long sequence prefill while matching pure Transformer accuracy on complex retrieval tasks.',
    definition_beginner: 'Combining the best of two worlds: using Mamba for super-fast reading of long texts and Transformer attention for sharp pinpoint recall.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'AI21 Labs (Jamba) & Together AI (Zamba)',
    categories: ['Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2403.19887', title: 'Jamba: A Hybrid Transformer-Mamba Architecture', source_type: 'paper', authority_rank: 1, published_date: '2024-03-28' }
    ]
  },
  {
    slug: 'chunked-prefill',
    name: 'Chunked Prefill',
    abbreviation: 'Chunked Prefill',
    tldr: 'An inference serving optimization that breaks long prompt context prefills into smaller chunks, interleaving them with token decoding steps to prevent latency spikes.',
    definition_technical: 'In LLM inference engines (e.g. vLLM, SGLang), prompt prefill causes execution stalls for ongoing decode requests. Chunked prefill chunks incoming prompt tokens into fixed batch sizes (e.g., 512 tokens), co-optimizing compute throughput and maintaining predictable decode time to first token (TTFT).',
    definition_beginner: 'Instead of pausing all ongoing chat conversations to read a giant 100-page document all at once, the server breaks the document into small pieces and reads them seamlessly in between generating words for active users.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Agrawal et al. (vLLM / UC Berkeley & Sarathi-Serve)',
    categories: ['Inference', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2403.02301', title: 'Taming Throughput-Latency Tradeoff in LLM Inference with Chunked-Prefill', source_type: 'paper', authority_rank: 1, published_date: '2024-03-04' }
    ]
  },
  {
    slug: 'kv-cache-compression',
    name: 'KV Cache Compression & Management',
    abbreviation: 'KV Cache Compression',
    tldr: 'A suit of techniques (paged allocation, quantization, pruning, and prefix sharing) to drastically reduce GPU memory consumed by key-value activation tokens during long inference.',
    definition_technical: 'KV Cache size grows linearly with sequence length and batch size, becoming the primary memory bottleneck in long-context serving. Compression techniques include PageAttention (virtual memory management), FP8/INT4 KV quantization, RadixAttention (prefix caching), and token eviction (SnapKV, StreamingLLM).',
    definition_beginner: 'Smart memory management tricks that compress and store the AI\'s recent memory in GPU RAM so it can handle 1-million-token conversations without running out of memory.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Kwon et al. (vLLM / PagedAttention) & SGLang',
    categories: ['Inference', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2309.06180', title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention', source_type: 'paper', authority_rank: 1, published_date: '2023-09-12' }
    ]
  },
  {
    slug: 'mixture-of-agents',
    name: 'Mixture of Agents',
    abbreviation: 'MoA',
    tldr: 'An architecture where multiple distinct LLM agents collaborate in layered tiers, feeding their outputs to each other to produce superior combined answers.',
    definition_technical: 'MoA structures multiple open LLMs into a multi-layer framework. Layer N agents generate response candidates based on prompt context, which are then passed as context inputs to Layer N+1 agents. This leverages model diversity and collaborative refinement to outperform single frontier models.',
    definition_beginner: 'A committee of different AI models where several models draft initial answers, pass them to a second tier of reviewer models, and synthesize a final response far better than any single model could produce alone.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Wang et al. (Together AI)',
    categories: ['Agents', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2406.04692', title: 'Mixture-of-Agents Enhances Large Language Model Capabilities', source_type: 'paper', authority_rank: 1, published_date: '2024-06-07' }
    ]
  },

  // --- 4. MULTIMODAL & REAL-TIME INTELLIGENCE ---
  {
    slug: 'omni-multimodal-tokenizers',
    name: 'Omni Multimodal Architecture',
    abbreviation: 'Omni Models',
    tldr: 'Native multimodal neural networks processing text, audio, and visual modalities end-to-end within a single unified model architecture.',
    definition_technical: 'Unlike cascaded pipelines (STT -> LLM -> TTS), native omni models tokenize continuous audio waveforms, video frames, and text tokens directly into a shared transformer encoder-decoder stream. This preserves emotional pitch, tone, non-verbal cues, and latency down to ~200ms.',
    definition_beginner: 'An AI built from the ground up to directly hear sounds, see live video, and speak words natively—without needing separate translation tools in the middle.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'OpenAI (GPT-4o) & Google (Gemini 1.5 Pro / Flash)',
    categories: ['Multimodal', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://openai.com/index/hello-gpt-4o/', title: 'Hello GPT-4o', source_type: 'official_blog', authority_rank: 1, published_date: '2024-05-13' }
    ]
  },
  {
    slug: 'visual-autoregressive-modeling',
    name: 'Visual Autoregressive Modeling',
    abbreviation: 'VAR',
    tldr: 'A image generation paradigm that redefines visual generation as coarse-to-fine multi-scale token prediction instead of traditional next-token raster scanning.',
    definition_technical: 'VAR replaces standard raster-scan next-token visual prediction with next-scale prediction. Starting from a low-resolution (e.g. 1x1) feature map, VAR autoregressively predicts higher-resolution token maps (2x2, 4x4, up to 64x64), matching diffusion model quality with 20x faster generation.',
    definition_beginner: 'Generating images like a painter filling in a canvas: starting with a blurry thumbnail draft and progressively refining high-resolution details across the entire image at once.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Tian et al. (Peking University & Bytedance)',
    categories: ['Multimodal', 'Architectures'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2404.02905', title: 'Visual Autoregressive Modeling: Scalable Image Generation via Next-Scale Prediction', source_type: 'paper', authority_rank: 1, published_date: '2024-04-03' }
    ]
  },
  {
    slug: 'spatial-intelligence',
    name: 'Spatial Intelligence & World Models',
    abbreviation: 'Spatial AI',
    tldr: 'The AI capability to perceive, reason about, and interact with 3D spatial environments, object physics, and physical geometry in real time.',
    definition_technical: 'Spatial intelligence integrates 3D point cloud representations, volumetric neural fields, and physical simulation engines into multimodal generative models. This allows AI systems to predict structural camera dynamics, object collisions, and physical world trajectories for robotics.',
    definition_beginner: 'Teaching AI to understand 3D space, depth, gravity, and how real objects move in the physical world, enabling robots and digital agents to interact safely with human environments.',
    difficulty: 'intermediate',
    status: 'emerging',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Fei-Fei Li (World Labs) & DeepMind',
    categories: ['Multimodal', 'Agents'],
    approved: true,
    sources: [
      { url: 'https://www.worldlabs.ai/', title: 'World Labs: Building Spatial Intelligence', source_type: 'official_blog', authority_rank: 1, published_date: '2024-09-20' }
    ]
  },

  // --- 5. ALIGNMENT, SAFETY & STEERING ---
  {
    slug: 'sparse-autoencoders-feature-steering',
    name: 'Sparse Autoencoders & Feature Steering',
    abbreviation: 'SAEs / Steering',
    tldr: 'Techniques in mechanistic interpretability that isolate monosemantic concepts in LLM activations and steer model output by clamping neural features.',
    definition_technical: 'Sparse Autoencoders (SAEs) decompose dense LLM residual stream activations into millions of sparse, interpretable monosemantic feature vectors. By clamping feature activation weights during inference, researchers can deterministically steer model behavior (e.g. enforcing truthfulness, altering tone, or suppressing bias).',
    definition_beginner: 'Using a high-tech microscope to find the exact "knobs" inside the AI\'s neural network for specific ideas (like honesty, humor, or safety) and turning those knobs up or down.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Anthropic (Templeton et al.) & OpenAI Alignment',
    categories: ['Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://www.anthropic.com/research/mapping-mind-claude', title: 'Mapping the Mind of a Large Language Model', source_type: 'official_blog', authority_rank: 1, published_date: '2024-05-21' }
    ]
  },
  {
    slug: 'rule-based-rewards',
    name: 'Rule-Based Rewards',
    abbreviation: 'RBR',
    tldr: 'An alignment technique combining explicit rule checklists with neural reward models to enforce exact safety and formatting constraints.',
    definition_technical: 'RBR supplements neural reward models by applying deterministic rule evaluators to candidate outputs. Rules verify explicit presence or absence of forbidden substrings, safety violations, or formatting requirements, outputting penalty vectors integrated into policy updates.',
    definition_beginner: 'Combining a human-like judge with a strict checklist: ensuring the AI doesn\'t break explicit safety rules regardless of how convincing its writing sounds.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'OpenAI (Mu et al.)',
    categories: ['Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://openai.com/index/rule-based-rewards/', title: 'Rule-Based Rewards for Model Alignment', source_type: 'official_blog', authority_rank: 1, published_date: '2024-09-05' }
    ]
  },
  {
    slug: 'indirect-prompt-injection',
    name: 'Indirect Prompt Injection',
    abbreviation: 'Indirect Injection',
    tldr: 'A security exploit where malicious instructions embedded inside retrieved third-party content (webpages, PDFs, emails) hijack an AI agent\'s actions.',
    definition_technical: 'Unlike direct prompt injection (where the user types hostile prompts), indirect injection occurs when an agent ingests untrusted data containing hidden adversarial instructions (e.g. white text on a webpage or hidden PDF metadata). The agent parses the data as system instructions, leading to unauthorized data exfiltration or tool misuse.',
    definition_beginner: 'A hidden trap on a website or in an email that tricks an reading AI agent into executing secret commands, like forwarding private files without your knowledge.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Greshake et al.',
    categories: ['Alignment', 'Agents'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2302.12173', title: 'Not what you\'ve signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection', source_type: 'paper', authority_rank: 1, published_date: '2023-02-23' }
    ]
  },

  // --- 6. POST-TRAINING & SYNTHETIC DATA ---
  {
    slug: 'synthetic-data-curation-pipelines',
    name: 'Synthetic Data Curation Pipelines',
    abbreviation: 'Synthetic Data Pipelines',
    tldr: 'Automated workflows leveraging teacher LLMs, quality filtering, and deduplication to generate high-fidelity training datasets at scale.',
    definition_technical: 'Synthetic data curation uses frontier LLMs to draft candidate pretraining text, code, or instruction pairs. Data passes through multi-stage validation: LLM-as-a-Judge scoring, execution verification (for code), n-gram deduplication, and embedding diversity clustering (e.g. Cosmopedia / Nemotron-4).',
    definition_beginner: 'Using advanced AI to author, fact-check, clean, and organize millions of textbook chapters and practice exercises to train smaller, super-smart AI models.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Hugging Face (Cosmopedia) & NVIDIA (Nemotron-4 340B)',
    categories: ['Training', 'Prompting'],
    approved: true,
    sources: [
      { url: 'https://huggingface.co/blog/cosmopedia', title: 'Cosmopedia: How to train a model on 30 billion tokens of synthetic data', source_type: 'official_blog', authority_rank: 1, published_date: '2024-02-20' },
      { url: 'https://arxiv.org/abs/2406.11704', title: 'Nemotron-4 340B Technical Report', source_type: 'paper', authority_rank: 1, published_date: '2024-06-17' }
    ]
  },
  {
    slug: 'self-rewarding-language-models',
    name: 'Self-Rewarding Language Models',
    abbreviation: 'Self-Rewarding Models',
    tldr: 'A self-alignment framework where a language model generates its own training data and evaluates its own response quality during iterative preference tuning.',
    definition_technical: 'Self-Rewarding models train a single LLM to perform both task generation and preference evaluation (acting as its own reward model via LLM-as-a-Judge prompting). During iterative alignment, the model updates both its generation capabilities and its internal judging accuracy.',
    definition_beginner: 'An AI student that writes its own homework questions, answers them, grades its own work accurately, and learns from its mistakes continuously.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2024',
    popularized_by: 'Yuan et al. (Meta AI & NYU)',
    categories: ['Alignment', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2401.10020', title: 'Self-Rewarding Language Models', source_type: 'paper', authority_rank: 1, published_date: '2024-01-18' }
    ]
  },
  {
    slug: 'distillation-from-reasoning-models',
    name: 'Distillation from Reasoning Models',
    abbreviation: 'Reasoning Distillation',
    tldr: 'Fine-tuning standard language models on millions of reasoning traces extracted from frontier reasoning models like DeepSeek-R1 or o1.',
    definition_technical: 'Reasoning distillation captures long chain-of-thought (<think>...</think>) trajectories generated by large RL-aligned reasoning models. By executing supervised fine-tuning (SFT) on these reasoning outputs, smaller base models (e.g. 1.5B - 14B) acquire advanced problem-solving capabilities without expensive RL training.',
    definition_beginner: 'Taking thousands of detailed solution sheets written by a world-class math genius and using them to teach high school students how to solve hard problems.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2025',
    popularized_by: 'DeepSeek (DeepSeek-R1-Distill-Qwen/Llama)',
    categories: ['Reasoning', 'Training'],
    approved: true,
    sources: [
      { url: 'https://arxiv.org/abs/2501.12948', title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning', source_type: 'paper', authority_rank: 1, published_date: '2025-01-22' }
    ]
  }
]

const conceptRelationships = [
  { parent: 'reinforcement-learning-from-human-feedback', child: 'group-relative-policy-optimization', type: 'replaced', desc: 'GRPO replaces traditional PPO critic models by normalizing rewards across sampled output groups', year: 2024 },
  { parent: 'reinforcement-learning-from-human-feedback', child: 'process-reward-models', type: 'extended', desc: 'PRMs extend traditional outcome reward models by scoring step-by-step reasoning steps', year: 2023 },
  { parent: 'process-reward-models', child: 'reinforcement-learning-with-verifiable-rewards', type: 'extended', desc: 'RLVR uses deterministic compilers and verifiers to replace neural process reward models', year: 2024 },
  { parent: 'chain-of-thought-prompting', child: 'extended-chain-of-thought', type: 'extended', desc: 'Extended CoT turns prompt-based chain of thought into deep inference-time test-time compute', year: 2024 },
  { parent: 'chain-of-thought-prompting', child: 'tree-of-thoughts', type: 'extended', desc: 'Tree-of-Thoughts enables deliberate search and backtracking over intermediate text thoughts', year: 2023 },
  { parent: 'test-time-compute', child: 'test-time-scaling-laws', type: 'extended', desc: 'Test-Time Scaling Laws quantify FLOP efficiency when allocating compute at inference versus training', year: 2024 },
  { parent: 'agentic-ai', child: 'computer-use-agents', type: 'extended', desc: 'Computer Use Agents extend agentic AI into desktop screen visual perception and OS control', year: 2024 },
  { parent: 'agentic-ai', child: 'browser-use-agents', type: 'extended', desc: 'Browser Use Agents operate autonomous browser engines to navigate live websites', year: 2024 },
  { parent: 'agentic-workflow-patterns', child: 'agentic-memory-architectures', type: 'inspired_by', desc: 'Agentic Memory provides long-term episodic memory storage for autonomous agent workflows', year: 2023 },
  { parent: 'state-space-models', child: 'mamba-2', type: 'extended', desc: 'Mamba-2 introduces State Space Duality (SSD) to dramatically accelerate state space execution', year: 2024 },
  { parent: 'mamba-2', child: 'hybrid-ssm-transformer', type: 'competes_with', desc: 'Hybrid SSM-Transformers combine Mamba state-space blocks with Transformer attention layers', year: 2024 },
  { parent: 'quantization', child: 'kv-cache-compression', type: 'extended', desc: 'KV Cache Compression uses PagedAttention and FP8 quantization to minimize context memory footprints', year: 2023 },
  { parent: 'multimodal-ai', child: 'omni-multimodal-tokenizers', type: 'extended', desc: 'Omni models process native audio, image, and text modalities in a single transformer stream', year: 2024 },
  { parent: 'direct-preference-optimization', child: 'self-rewarding-language-models', type: 'extended', desc: 'Self-Rewarding language models generate and evaluate their own preference data for alignment', year: 2024 },
  { parent: 'synthetic-data-generation', child: 'synthetic-data-curation-pipelines', type: 'extended', desc: 'Curation pipelines orchestrate multi-stage filtering and LLM judging to scale synthetic training data', year: 2024 },
  { parent: 'large-reasoning-models', child: 'distillation-from-reasoning-models', type: 'extended', desc: 'Distillation allows compact base models to inherit reasoning capabilities from DeepSeek-R1 and o1', year: 2025 }
]

async function seedLatestConcepts() {
  console.log(`Starting seed process for ${latestAIConcepts.length} latest AI concepts...`)

  const slugToIdMap = {}

  // 1. Fetch existing concept IDs to map slugs
  const { data: existingConcepts, error: fetchError } = await db
    .from('concepts')
    .select('id, slug')

  if (fetchError) {
    console.error('Error fetching existing concepts:', fetchError)
  } else if (existingConcepts) {
    existingConcepts.forEach(c => {
      slugToIdMap[c.slug] = c.id
    })
  }

  let insertedCount = 0
  let updatedCount = 0

  // 2. Upsert each concept
  for (const conceptData of latestAIConcepts) {
    const { sources, ...conceptFields } = conceptData

    const { data: upsertedConcept, error: conceptError } = await db
      .from('concepts')
      .upsert(conceptFields, { onConflict: 'slug' })
      .select('id, slug')
      .single()

    if (conceptError) {
      console.error(`Error upserting concept ${conceptData.slug}:`, conceptError.message)
      continue
    }

    if (upsertedConcept) {
      const isNew = !slugToIdMap[upsertedConcept.slug]
      slugToIdMap[upsertedConcept.slug] = upsertedConcept.id
      if (isNew) insertedCount++
      else updatedCount++

      // 3. Upsert sources if provided
      if (sources && sources.length > 0) {
        const sourcesToInsert = sources.map(s => ({
          concept_id: upsertedConcept.id,
          url: s.url,
          title: s.title,
          source_type: s.source_type,
          authority_rank: s.authority_rank,
          published_date: s.published_date
        }))

        // Delete existing sources for this concept to refresh cleanly
        await db.from('sources').delete().eq('concept_id', upsertedConcept.id)

        const { error: sourceError } = await db.from('sources').insert(sourcesToInsert)
        if (sourceError) {
          console.error(`Error inserting sources for ${conceptData.slug}:`, sourceError.message)
        }
      }
    }
  }

  console.log(`Concepts upserted successfully: ${insertedCount} new added, ${updatedCount} updated.`)

  // 4. Insert relationship evolutions
  const evolutionsToInsert = []
  for (const rel of conceptRelationships) {
    const parentId = slugToIdMap[rel.parent]
    const childId = slugToIdMap[rel.child]

    if (parentId && childId) {
      evolutionsToInsert.push({
        parent_concept_id: parentId,
        child_concept_id: childId,
        relationship_type: rel.type,
        description: rel.desc,
        year: rel.year
      })
    } else {
      console.warn(`Could not link relationship: parent=${rel.parent} (${!!parentId}), child=${rel.child} (${!!childId})`)
    }
  }

  if (evolutionsToInsert.length > 0) {
    const { error: relError } = await db
      .from('concept_evolutions')
      .upsert(evolutionsToInsert, { onConflict: 'parent_concept_id,child_concept_id' })

    if (relError) {
      console.error('Error inserting relationship evolutions:', relError.message)
    } else {
      console.log(`Successfully upserted ${evolutionsToInsert.length} concept relationship evolutions.`)
    }
  }

  console.log('Seeding process complete! 🎉')
}

seedLatestConcepts().catch(err => {
  console.error('Fatal error during seeding:', err)
  process.exit(1)
})
