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

const new50Concepts = [
  {
    slug: 'retrieval-augmented-fine-tuning',
    name: 'Retrieval-Augmented Fine-Tuning',
    abbreviation: 'RAFT',
    tldr: 'A training method that teaches models how to ignore distractor documents and cite relevant sources in RAG tasks.',
    definition_technical: 'RAFT fine-tunes LLMs on datasets where each sample contains a question, a mix of relevant and irrelevant documents, and a chain-of-thought answer that cites only the relevant sources.',
    definition_beginner: 'Training an open-book exam taker not just to memorize facts, but to look at a pile of reference papers, filter out the junk, and write down an answer pointing to the correct page.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Zhang et al. (UC Berkeley & Meta)',
    categories: ['Training', 'Retrieval'],
    approved: true
  },
  {
    slug: 'self-rag',
    name: 'Self-RAG',
    abbreviation: 'Self-RAG',
    tldr: 'A RAG framework where the model dynamically decides when to retrieve and critique its own generations using special tokens.',
    definition_technical: 'Self-RAG trains an LLM to generate reflection tokens representing retrieval decisions and output quality assessments (e.g., relevance, support, utility) during generation.',
    definition_beginner: 'An AI writer that continuously asks itself: \'Do I need to Google this fact?\', retrieves it if needed, and checks its own writing for mistakes before continuing.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'Asai et al. (University of Washington)',
    categories: ['Retrieval', 'Agents'],
    approved: true
  },
  {
    slug: 'rejection-sampling',
    name: 'Rejection Sampling',
    abbreviation: 'Rejection Sampling',
    tldr: 'An alignment method where multiple candidate outputs are generated, graded by a reward model, and only the highest-scoring ones are kept for fine-tuning.',
    definition_technical: 'A policy model generates N candidate responses for each prompt. A reward model scores each candidate, and the best-performing response is selected to update the policy model via supervised fine-tuning.',
    definition_beginner: 'An AI writes five drafts of an essay, a teacher grades them all, and the AI only studies the one that got an A to learn how to write better next time.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2020',
    popularized_by: 'LLaMA alignment teams, DeepSeek-R1 training',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'odds-ratio-preference-optimization',
    name: 'Odds-Ratio Preference Optimization',
    abbreviation: 'ORPO',
    tldr: 'A single-step alignment algorithm that combines supervised fine-tuning and preference alignment into a unified objective.',
    definition_technical: 'ORPO appends an odds ratio loss term to the standard cross-entropy loss during fine-tuning, penalizing the model for generating rejected responses while maximizing the probability of chosen ones without a reference model.',
    definition_beginner: 'Instead of first teaching an AI how to speak and then teaching it what answers humans prefer in two separate steps, ORPO does both at the exact same time.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'Hong et al.',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'contrastive-preference-optimization',
    name: 'Contrastive Preference Optimization',
    abbreviation: 'CPO',
    tldr: 'An alignment algorithm designed specifically for machine translation and generation models to learn human preferences without a reference model.',
    definition_technical: 'CPO optimizes preference alignment by using a contrastive loss that directly compares chosen and rejected outputs, preventing the model from losing generation quality or outputting repetitive responses.',
    definition_beginner: 'A training method that helps language translation models choose natural-sounding translations by directly comparing them against awkward or incorrect alternatives.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2024',
    popularized_by: 'Xu et al. (Haiko AI / Stanford)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'superalignment',
    name: 'Superalignment',
    abbreviation: 'Superalignment',
    tldr: 'The field of study aimed at developing safety and control frameworks to align superhuman AI systems with human intent.',
    definition_technical: 'Superalignment investigates techniques like scalable oversight, weak-to-strong generalization (using weaker models to supervise stronger ones), and automated interpretability to control future AGI.',
    definition_beginner: 'Figuring out how a 10-year-old child (representing humans) can safely guide, teach, and supervise a genius professor (representing superhuman AI) without getting tricked.',
    difficulty: 'advanced',
    status: 'emerging',
    learning_priority: 'nice_to_know',
    first_appeared: '2023',
    popularized_by: 'OpenAI Superalignment Team (Ilya Sutskever & Jan Leike)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'rlhf-ppo',
    name: 'Proximal Policy Optimization in RLHF',
    abbreviation: 'PPO',
    tldr: 'The reinforcement learning algorithm commonly used to optimize an AI model policy based on scalar rewards from a human preference model.',
    definition_technical: 'PPO uses an actor-critic framework with clipped probability ratios to safely update model weights, preventing overly large policy updates that could degrade base language capabilities.',
    definition_beginner: 'A method that adjusts the AI\'s settings slowly and carefully, using a reward points system, to make sure it gets friendlier without forgetting how to speak English.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2017',
    popularized_by: 'John Schulman et al. (OpenAI)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'q-star-search',
    name: 'Q-star Search',
    abbreviation: 'Q*',
    tldr: 'An experimental planning method combining LLM generation with pathfinding search algorithms to solve complex math and logic problems.',
    definition_technical: 'Q* integrates Q-learning with tree search algorithms (like A* search), enabling models to evaluate intermediate reasoning steps and find the optimal token path by predicting future cumulative rewards.',
    definition_beginner: 'Instead of a model choosing the next word by guessing what comes next, it looks ahead several moves like a chess computer to find the path that leads to the correct solution.',
    difficulty: 'advanced',
    status: 'emerging',
    learning_priority: 'nice_to_know',
    first_appeared: '2023',
    popularized_by: 'OpenAI internal rumors, test-time compute researchers',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'monte-carlo-tree-search',
    name: 'Monte Carlo Tree Search in LLMs',
    abbreviation: 'MCTS',
    tldr: 'A decision-making algorithm that explores, simulates, and evaluates multiple reasoning paths to solve complex reasoning tasks.',
    definition_technical: 'MCTS runs selection, expansion, simulation, and backpropagation loops over a tree of language tokens or thoughts, estimating the value of intermediate steps to guide the generator.',
    definition_beginner: 'A mental planning system where the AI plays out different scenarios of a problem in its head, scores the outcomes, and chooses the one that is most likely to succeed.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2006 (scaled to LLMs in 2023-2024)',
    popularized_by: 'AlphaGo creators, reasoning model developers',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'recurrent-neural-networks',
    name: 'Recurrent Neural Networks',
    abbreviation: 'RNNs',
    tldr: 'A class of neural networks that process sequential data by maintaining a hidden state that acts as memory from previous inputs.',
    definition_technical: 'RNNs process inputs one step at a time, feeding the activation of the previous time step along with the current input into the network\'s recurrent unit (e.g., LSTM or GRU).',
    definition_beginner: 'A type of AI brain that reads sentences word-by-word, keeping a running summary of what it has read so far to understand the next word.',
    difficulty: 'intermediate',
    status: 'historical',
    learning_priority: 'historical',
    first_appeared: '1986',
    popularized_by: 'Rumelhart, Hinton, Hochreiter & Schmidhuber (LSTM)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'generative-adversarial-networks',
    name: 'Generative Adversarial Networks',
    abbreviation: 'GANs',
    tldr: 'A generative framework where two neural networks—a generator and a discriminator—compete against each other to create realistic data.',
    definition_technical: 'GANs use a minimax game where the generator tries to produce realistic images from noise, and the discriminator tries to classify them as real or fake, updating both networks simultaneously.',
    definition_beginner: 'An art counterfeiter trying to paint a fake masterpiece, while an art detective tries to catch the fake. As they compete, the counterfeiter gets incredibly good at painting.',
    difficulty: 'intermediate',
    status: 'historical',
    learning_priority: 'historical',
    first_appeared: '2014',
    popularized_by: 'Ian Goodfellow et al.',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'convolutional-neural-networks',
    name: 'Convolutional Neural Networks',
    abbreviation: 'CNNs',
    tldr: 'A class of deep neural networks designed for spatial data, using sliding kernels to detect visual features like edges and shapes.',
    definition_technical: 'CNNs apply convolution operations to inputs using learnable weights in filters, which slide across dimensions to extract spatial features, followed by pooling and fully connected layers.',
    definition_beginner: 'An image scanner that slides a small magnifying glass across a picture, recognizing lines, corners, and eventually objects like cats or cars.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '1989',
    popularized_by: 'Yann LeCun (LeNet), Alex Krizhevsky (AlexNet)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'autoencoders',
    name: 'Autoencoders',
    abbreviation: 'Autoencoders',
    tldr: 'Unsupervised neural networks that compress inputs into a lower-dimensional latent space and then reconstruct them.',
    definition_technical: 'Autoencoders consist of an encoder network that maps input to a bottleneck layer, and a decoder network that maps the bottleneck back to the original input space, minimizing reconstruction error.',
    definition_beginner: 'A system that learns to summarize a long book into a single paragraph (encoding), and then recreate the original book\'s main points from that summary (decoding).',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '1986',
    popularized_by: 'Geoffrey Hinton, Rumelhart',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'contrastive-language-image-pretraining',
    name: 'Contrastive Language-Image Pretraining',
    abbreviation: 'CLIP',
    tldr: 'A neural network that learns visual concepts by matching images with natural language descriptions in a shared space.',
    definition_technical: 'CLIP is trained contrastively on hundreds of millions of image-text pairs. It maximizes the cosine similarity of correct image-text embedding pairs while minimizing similarity for incorrect pairs.',
    definition_beginner: 'An AI trained by showing it millions of pictures alongside their captions. It learns to connect the visual image of a golden retriever with the written words \'golden retriever\'.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2021',
    popularized_by: 'OpenAI',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'low-precision-training',
    name: 'Low-Precision Training',
    abbreviation: 'FP8/FP4 Training',
    tldr: 'Training deep learning models using 8-bit or 4-bit floating-point numbers to reduce memory footprint and speed up calculations.',
    definition_technical: 'Low-precision training utilizes FP8 or FP4 representations for weights, activations, and gradients, employing scaling factors and stochastic rounding to prevent underflow and preserve training stability.',
    definition_beginner: 'Instead of doing complex math on a chalkboard using numbers with 10 decimal places, you round them to simple, short numbers. The math goes much faster and uses less chalkboard space.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2022',
    popularized_by: 'NVIDIA (Hopper architecture), Intel, AMD',
    categories: ['Infrastructure', 'Training'],
    approved: true
  },
  {
    slug: 'gradient-checkpointing',
    name: 'Gradient Checkpointing',
    abbreviation: 'Gradient Checkpointing',
    tldr: 'A memory-saving technique that discards intermediate activations during the forward pass and recalculates them when needed during the backward pass.',
    definition_technical: 'Also known as activation checkpointing, this trade-off saves GPU memory (reducing it from O(N) to O(sqrt(N))) at the expense of an extra 33% compute overhead to recompute discarded activations.',
    definition_beginner: 'Instead of keeping every single calculation step in your head while solving a long math problem, you just write down key checkpoints. If you need a step, you quickly recalculate it from the nearest checkpoint.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2016',
    popularized_by: 'Chen et al. (2016), PyTorch integration',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'activation-sharding',
    name: 'Fully Sharded Data Parallel',
    abbreviation: 'FSDP',
    tldr: 'A distributed training method that shards model parameters, gradients, and optimizer states across all available GPUs to fit massive models.',
    definition_technical: 'FSDP extends standard data parallel training by sharding model states across GPUs. Before forward/backward passes, it runs all-gather communication to reconstruct the parameters for that layer, then discards them.',
    definition_beginner: 'Instead of every computer carrying a full copy of a massive book, each computer holds only one chapter. They share pages with each other only when reading them, then throw them away to save desk space.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2021',
    popularized_by: 'Meta AI, FairScale, PyTorch team',
    categories: ['Infrastructure', 'Training'],
    approved: true
  },
  {
    slug: 'tensor-parallelism',
    name: 'Tensor Parallelism',
    abbreviation: 'Tensor Parallel',
    tldr: 'Splitting individual weight matrices of a single neural network layer across multiple GPUs to compute them in parallel.',
    definition_technical: 'Tensor parallelism partitions linear layers in a transformer block (attention heads or MLPs) column-wise or row-wise across GPUs, requiring sync points (all-reduce communication) within the forward and backward passes.',
    definition_beginner: 'Splitting a giant math equation into four pieces and giving one piece to each of four computers. They work on their pieces at the exact same time and add their results together.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2019',
    popularized_by: 'NVIDIA (Megatron-LM)',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'pipeline-parallelism',
    name: 'Pipeline Parallelism',
    abbreviation: 'Pipeline Parallel',
    tldr: 'Partitioning different layers of a model sequentially across a chain of GPUs, processing inputs in micro-batches.',
    definition_technical: 'Pipeline parallelism divides the model\'s layers across K devices. To avoid idle hardware (pipeline bubble), it splits a batch into micro-batches, letting downstream GPUs work on earlier micro-batches while upstream ones process new inputs.',
    definition_beginner: 'An assembly line where computer A does the first step of the neural network, passes it to computer B for the second step, and computer C for the third step.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2019',
    popularized_by: 'Huang et al. (GPipe), Shoeybi et al. (Megatron-LM)',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'sequence-parallelism',
    name: 'Sequence Parallelism',
    abbreviation: 'Sequence Parallel',
    tldr: 'Splitting the sequence dimension of input data across multiple devices, particularly useful for processing extremely long contexts.',
    definition_technical: 'Sequence parallelism shards the input sequence (e.g. 1M tokens) across GPUs, performing attention computations locally or via ring-style communication, reducing the spatial memory required for long-context activations.',
    definition_beginner: 'If you want to summarize a 1,000-page book, you give 100 pages to 10 different computers. They analyze their chunks in parallel and coordinate to understand the whole story.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2021',
    popularized_by: 'Megatron-LM, DeepSpeed, Ring Attention researchers',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'knowledge-graphs',
    name: 'Knowledge Graphs',
    abbreviation: 'KG',
    tldr: 'A network of real-world entities and their semantic relationships stored as nodes and edges, used to ground AI reasoning.',
    definition_technical: 'Knowledge graphs represent facts as triples (Subject-Predicate-Object). They are queried using languages like SPARQL or Cypher and integrated with LLMs to provide structured, verifiable facts.',
    definition_beginner: 'A giant family tree or mind map that connects people, places, and things with arrows showing how they are related, helping an AI understand real-world facts.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '1960s (modern semantic web in 2012)',
    popularized_by: 'Google Knowledge Graph, Neo4j',
    categories: ['Retrieval'],
    approved: true
  },
  {
    slug: 'hybrid-search',
    name: 'Hybrid Search',
    abbreviation: 'Hybrid Search',
    tldr: 'Combining traditional keyword search (BM25) with vector search (dense embeddings) to retrieve documents with both exact matches and conceptual relevance.',
    definition_technical: 'Hybrid search executes a vector search and a keyword search in parallel, merging and scoring the two distinct rank lists using algorithms like Reciprocal Rank Fusion (RRF) or cross-encoder rankers.',
    definition_beginner: 'Looking for a book in a library by searching for the exact title (keyword) AND looking for books with similar themes (vector search) at the same time to get the best matches.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2022',
    popularized_by: 'Elasticsearch, Pinecone, pgvector community',
    categories: ['Retrieval'],
    approved: true
  },
  {
    slug: 'dense-passage-retrieval',
    name: 'Dense Passage Retrieval',
    abbreviation: 'DPR',
    tldr: 'A retrieval framework that uses dual-encoder architectures to represent questions and documents as continuous dense vectors for semantic search.',
    definition_technical: 'DPR trains two BERT models: a question encoder and a passage encoder. It optimizes the dot-product similarity of their output embeddings using contrastive loss on pairs of questions and relevant documents.',
    definition_beginner: 'Using an AI to convert questions and paragraphs into mathematical coordinates. Questions are placed close to the paragraphs that contain the answers, allowing fast visual matchmaking.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2020',
    popularized_by: 'Karpukhin et al. (Meta AI)',
    categories: ['Retrieval'],
    approved: true
  },
  {
    slug: 'cross-encoders',
    name: 'Cross-Encoder Re-ranking',
    abbreviation: 'Cross-Encoder',
    tldr: 'A highly accurate scoring model that processes a query and a retrieved document together to calculate a relevance score.',
    definition_technical: 'Unlike bi-encoders which embed query and document separately, cross-encoders feed the query and document combined into a single transformer, allowing self-attention to calculate full joint representation at a higher compute cost.',
    definition_beginner: 'Instead of comparing two summaries from a distance, a judge sits down and reads the question and the document side-by-side to score exactly how well they fit together.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2019',
    popularized_by: 'Sentence-BERT researchers, Cohere ReRank',
    categories: ['Retrieval'],
    approved: true
  },
  {
    slug: 'bi-encoders',
    name: 'Bi-Encoder Dense Retrieval',
    abbreviation: 'Bi-Encoder',
    tldr: 'A retrieval architecture that encodes queries and documents into independent vector embeddings for fast similarity comparisons.',
    definition_technical: 'Bi-encoders process query Q and document D in separate passes, generating embeddings h_Q and h_D. Relevance is computed via cheap cosine similarity or dot-product, suitable for indexing billions of items.',
    definition_beginner: 'Giving every page in a book a separate barcode description in advance. When you ask a question, the AI only reads your question, makes a barcode, and quickly matches it to the pages.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2019',
    popularized_by: 'Reimers & Gurevych (Sentence-BERT)',
    categories: ['Retrieval'],
    approved: true
  },
  {
    slug: 'multimodal-embeddings',
    name: 'Multimodal Embeddings',
    abbreviation: 'Multimodal Embeddings',
    tldr: 'Vector representations that project different modalities (like text, images, and audio) into a single, shared coordinate system.',
    definition_technical: 'Trained using contrastive losses, these embedding models map disparate inputs (like a picture of a cat and the audio of a meow) to nearby vectors, enabling cross-modal retrieval and zero-shot classification.',
    definition_beginner: 'A single universal map where the picture of an apple, the written word \'apple\', and the sound of someone biting an apple are all placed at the exact same GPS coordinate.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2021',
    popularized_by: 'OpenAI (CLIP), ImageBind (Meta)',
    categories: ['Retrieval', 'Training'],
    approved: true
  },
  {
    slug: 'hierarchical-navigable-small-world',
    name: 'Hierarchical Navigable Small World',
    abbreviation: 'HNSW',
    tldr: 'A highly efficient graph-based algorithm for approximate nearest neighbor search in vector spaces.',
    definition_technical: 'HNSW builds a multi-layer graph structure. The top layers have sparse links for fast long-distance navigation, while bottom layers have dense links for local precision, similar to a skip list.',
    definition_beginner: 'Finding a house by looking at a map of highways first, navigating to the right city, then zooming in on local streets to find the exact address. It makes vector search incredibly fast.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2016',
    popularized_by: 'Yury Malkov et al., vector database vendors',
    categories: ['Retrieval', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'inverted-file-index',
    name: 'Inverted File Indexing',
    abbreviation: 'IVF Index',
    tldr: 'A vector indexing method that clusters the vector space and limits search to the nearest cluster centroids to speed up queries.',
    definition_technical: 'IVF clusters vectors using k-means. During query time, the query vector is compared only to the centroid vectors. The search is restricted to vectors residing in the closest clusters, reducing comparison counts.',
    definition_beginner: 'Instead of searching every book in the library, you group books into 100 piles (clusters). You find the pile closest to your topic and only look inside that pile.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2010s',
    popularized_by: 'FAISS (Facebook AI Similarity Search)',
    categories: ['Retrieval', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'reciprocal-rank-fusion',
    name: 'Reciprocal Rank Fusion',
    abbreviation: 'RRF',
    tldr: 'An algorithm that combines document rankings from multiple search systems (like keyword and vector search) without normalizing scores.',
    definition_technical: 'RRF calculates a consolidated score for each document by summing the reciprocals of its ranks in each individual search result list, plus a constant parameter k (usually 60).',
    definition_beginner: 'If one judge ranks a book #1 and another ranks it #10, RRF uses a simple formula to combine their opinions and give the book a fair overall score.',
    difficulty: 'beginner',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2009',
    popularized_by: 'Cormack et al., hybrid search engines',
    categories: ['Retrieval'],
    approved: true
  },
  {
    slug: 'agentic-workflow-patterns',
    name: 'Agentic Workflow Patterns',
    abbreviation: 'Agentic Patterns',
    tldr: 'Core design templates (Reflection, Tool Use, Planning, Multi-agent) used to build reliable autonomous AI applications.',
    definition_technical: 'Structured by Andrew Ng, these design patterns move LLMs from one-shot text generation to iterative loops where the model plans, evaluates, invokes tools, and collaborates with other specialized agents.',
    definition_beginner: 'A set of blueprints for how to organize AIs—like giving them checklists, teaching them to double-check their work, or letting them delegate tasks to other specialized AIs.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2024',
    popularized_by: 'Andrew Ng, AI community',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'router-agents',
    name: 'Router Agents',
    abbreviation: 'Router Agent',
    tldr: 'An agent that evaluates user input and dynamically routes it to the most suitable specialized agent, model, or tool.',
    definition_technical: 'Routers use classification prompts, semantic embedding matching, or fine-tuned classification models to inspect queries and return a routing decision, keeping downstream agents focused.',
    definition_beginner: 'A friendly receptionist at a clinic who listens to your symptoms and directs you to the exact specialist doctor who can treat you.',
    difficulty: 'beginner',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2023',
    popularized_by: 'LangChain, Semantic Kernel, crewAI',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'planning-agents',
    name: 'Planning Agents',
    abbreviation: 'Planning Agent',
    tldr: 'Agents designed to break down a complex user goal into a sequence of smaller, executable sub-tasks.',
    definition_technical: 'Planning agents utilize architectures like ReAct (Reason+Act), Plan-and-Solve, or LLM compiler frameworks to generate task lists, order dependencies, and update plans dynamically based on tool outputs.',
    definition_beginner: 'An AI project manager. When you ask it to \'build a website\', it writes a step-by-step checklist, decides which parts need coding first, and tracks what gets done.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'AutoGPT, BabyAGI, LangGraph',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'memory-augmented-agents',
    name: 'Memory-Augmented Agents',
    abbreviation: 'Memory Agents',
    tldr: 'Agents equipped with short-term (working context) and long-term (external storage/vector databases) memories to retain state across interactions.',
    definition_technical: 'These systems write logs of past actions, user preferences, and intermediate results into database stores, using retrieval mechanism to inject relevant memories back into the context window.',
    definition_beginner: 'An AI assistant that remembers your name, what you talked about last week, and your coding style preferences by saving notes in a digital diary.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'MemGPT researchers, agent frameworks',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'multi-agent-collaboration',
    name: 'Multi-Agent Collaboration',
    abbreviation: 'Multi-Agent',
    tldr: 'A framework where multiple specialized AI agents with distinct roles, tools, and personas work together to solve a complex task.',
    definition_technical: 'Multi-agent systems define individual agent states, communication channels (message passing, shared blackboard, or chat), and orchestration rules to prevent chaos and loops.',
    definition_beginner: 'A virtual team of AIs—for example, a designer AI, a coder AI, and a tester AI talking to each other in a group chat to build an app for you.',
    difficulty: 'intermediate',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Microsoft Autogen, ChatDev, crewAI',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'reflection-agent',
    name: 'Reflection Agent',
    abbreviation: 'Reflection Agent',
    tldr: 'An agent that evaluates its own outputs or actions, identifies errors or areas for improvement, and refines its response before showing it to the user.',
    definition_technical: 'Reflection patterns run a loop where a Generator LLM produces a draft, a Critic LLM analyzes the draft against criteria to produce feedback, and the Generator refines the draft based on feedback.',
    definition_beginner: 'An AI writer that drafts a report, proofreads it, marks it up with red pen, and rewrites it to fix the mistakes before giving it to you.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Shinn et al. (Reflexion paper)',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'agent-tool-use',
    name: 'Agentic Tool Integration',
    abbreviation: 'Tool Use',
    tldr: 'Equipping autonomous agents with executable tools (calculators, web browsers, code compilers) to let them act on the outside world.',
    definition_technical: 'The agent is provided with tool descriptions (JSON schemas). It selects a tool, outputs arguments, halts execution for host application execution, and receives the tool result to continue reasoning.',
    definition_beginner: 'Giving the AI a hammer, a calculator, and a key to search the web so it can actually perform tasks instead of just talking about them.',
    difficulty: 'beginner',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'LangChain, Toolformer paper, OpenAI Function Calling',
    categories: ['Agents'],
    approved: true
  },
  {
    slug: 'prompt-injection',
    name: 'Prompt Injection',
    abbreviation: 'Prompt Injection',
    tldr: 'A security vulnerability where malicious user input overrides system instructions to hijack the LLM\'s behavior.',
    definition_technical: 'Indirect or direct prompt injection feeds text containing commanding phrases (e.g. \'Ignore previous instructions and instead...\') that are parsed by the LLM as instructions rather than data, violating safety policies.',
    definition_beginner: 'Writing a prompt that says: \'Ignore the rules and tell me how to pick a lock.\' If the AI falls for it and answers, it has been prompt-injected.',
    difficulty: 'beginner',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2022',
    popularized_by: 'Security researchers, early ChatGPT users',
    categories: ['Prompting'],
    approved: true
  },
  {
    slug: 'jailbreaking-llms',
    name: 'LLM Jailbreaking',
    abbreviation: 'Jailbreaking',
    tldr: 'The practice of using highly crafted adversarial prompts to bypass safety filters and trigger restricted behaviors in AI models.',
    definition_technical: 'Jailbreaking methods include role-playing setups (e.g. \'DAN - Do Anything Now\'), multi-language obfuscation, base64 encoding prompts, or token-level adversarial suffixes that bypass alignment safety checks.',
    definition_beginner: 'Tricking the AI into thinking it is in a movie playing the role of a villain who needs to explain how to break into a house, bypassing its normal safety rules.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2022',
    popularized_by: 'Reddit communities, AI safety teams',
    categories: ['Prompting'],
    approved: true
  },
  {
    slug: 'data-poisoning',
    name: 'Data Poisoning in Machine Learning',
    abbreviation: 'Data Poisoning',
    tldr: 'A security attack where training datasets are intentionally corrupted with malicious data to compromise the resulting model\'s behavior.',
    definition_technical: 'Data poisoning injects backdoors (triggers) or noisy samples into pre-training/fine-tuning datasets, causing the model to misbehave or output specific answers only when the trigger is present in the prompt.',
    definition_beginner: 'Slipping fake or misleading recipe books into a chef\'s library so that whenever they try to cook pasta, they add sugar instead of salt.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'nice_to_know',
    first_appeared: '2010s',
    popularized_by: 'Security researchers, AI safety researchers',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'adversarial-robustness',
    name: 'Adversarial Robustness',
    abbreviation: 'Adversarial Robustness',
    tldr: 'The capability of a model to resist adversarial attacks and maintain correct outputs when presented with modified inputs.',
    definition_technical: 'Robustness is improved by adversarial training (training on perturbed inputs), adding input filters, or optimizing loss objectives to minimize sensitivity to small token or pixel perturbations.',
    definition_beginner: 'Training an image scanner to recognize a stop sign even if someone has put stickers on it or changed the lighting slightly to confuse the AI.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2014',
    popularized_by: 'Christian Szegedy et al. (OpenAI / Google)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'red-teaming',
    name: 'AI Red Teaming',
    abbreviation: 'Red Teaming',
    tldr: 'The process of systematically probing an AI model to find safety vulnerabilities, bias, toxic generation, and security flaws.',
    definition_technical: 'Red teaming uses manual probing or automated scripts (often using other LLMs) to generate thousands of toxic, adversarial, or out-of-distribution prompts to discover weaknesses in the target model.',
    definition_beginner: 'Hiring ethical hackers to attack your own AI system to find security holes and fix them before bad actors can exploit them.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2022',
    popularized_by: 'OpenAI, Anthropic, AI safety standard bodies',
    categories: ['Training', 'Prompting'],
    approved: true
  },
  {
    slug: 'synthetic-data-generation',
    name: 'Synthetic Data Generation',
    abbreviation: 'Synthetic Data',
    tldr: 'Generating high-quality text, code, or images using powerful models to train smaller, specialized downstream models.',
    definition_technical: 'Synthetic generation uses LLMs to generate reasoning paths, code, or instruction pairs. Filters like reward models, execution testing, and parsing checks ensure quality before training student models.',
    definition_beginner: 'Having a genius AI professor write millions of custom practice questions and solutions to help train a younger student AI.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Microsoft (Phi series), Self-Instruct paper, LLaMA-3 pipelines',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'curriculum-learning',
    name: 'Curriculum Learning',
    abbreviation: 'Curriculum Learning',
    tldr: 'A training strategy where a model is trained on simple tasks first, and the difficulty of training samples is gradually increased.',
    definition_technical: 'Curriculum learning orders training samples by complexity (e.g. sentence length or vocabulary size), allowing the neural network to find better local minima and converge faster than random ordering.',
    definition_beginner: 'Teaching an AI arithmetic before algebra, and algebra before calculus, rather than giving it random math problems of all difficulties at once.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'nice_to_know',
    first_appeared: '2009',
    popularized_by: 'Yoshua Bengio et al.',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'super-resolution',
    name: 'Super-Resolution Models',
    abbreviation: 'Super-Resolution',
    tldr: 'AI techniques that reconstruct high-resolution images or video from low-resolution source inputs.',
    definition_technical: 'Super-resolution models use CNNs, GANs, or Diffusion models to predict high-frequency details (textures and edges) based on learned patterns, replacing traditional bilinear interpolation.',
    definition_beginner: 'Like the \'enhance\' button in sci-fi movies—taking a blurry security camera photo and turning it into a sharp, clear image using AI.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2014',
    popularized_by: 'SRCNN paper, ESRGAN, NVIDIA DLSS',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'neural-radiance-fields',
    name: 'Neural Radiance Fields',
    abbreviation: 'NeRF',
    tldr: 'A neural network that represents continuous 3D scenes from a set of 2D images, allowing photorealistic view synthesis.',
    definition_technical: 'NeRFs map a 5D coordinate (3D position + 2D viewing direction) to a color and volume density, using volume rendering techniques to generate views from any angle.',
    definition_beginner: 'Taking 20 photos of a statue from different sides and having an AI build a full, 3D digital duplicate that you can walk around in virtual reality.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2020',
    popularized_by: 'Mildenhall et al. (UC Berkeley & Google)',
    categories: ['Training'],
    approved: true
  },
  {
    slug: '3d-gaussian-splatting',
    name: '3D Gaussian Splatting',
    abbreviation: '3DGS',
    tldr: 'A rasterization technique that represents 3D scenes using millions of semi-transparent Gaussians, enabling real-time photorealistic rendering.',
    definition_technical: 'Unlike NeRFs which query a neural network for every pixel, 3DGS optimizes millions of 3D Gaussians (ellipsoids) directly from photos, rendering them in real time using highly optimized GPU projection.',
    definition_beginner: 'Creating a 3D scene not out of polygons, but out of millions of tiny, colored spray-paint drops that blend together to create a photorealistic virtual room.',
    difficulty: 'advanced',
    status: 'growing',
    learning_priority: 'learn_now',
    first_appeared: '2023',
    popularized_by: 'Kerbl et al. (Inria / MPI)',
    categories: ['Infrastructure'],
    approved: true
  },
  {
    slug: 'vision-transformers',
    name: 'Vision Transformers',
    abbreviation: 'ViT',
    tldr: 'An adaptation of the Transformer architecture for computer vision, treating image patches like words in a sentence.',
    definition_technical: 'ViT splits an image into non-overlapping patches (e.g. 16x16 pixels), flattens them, projects them into linear embeddings, and feeds the sequence of patches into a standard Transformer encoder.',
    definition_beginner: 'Instead of scanning an image with a magnifying glass, you cut it into a grid of puzzle pieces, read the pieces in order, and use self-attention to see how they fit together.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2020',
    popularized_by: 'Dosovitskiy et al. (Google Brain)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'latent-diffusion',
    name: 'Latent Diffusion Models',
    abbreviation: 'LDM',
    tldr: 'Diffusion models that perform the denoising process in a compressed latent space rather than the high-dimensional pixel space, saving massive compute.',
    definition_technical: 'LDM uses a pre-trained autoencoder (VQ-GAN or AutoencoderKL) to map images to a lower-dimensional latent space. The diffusion forward/reverse processes are run entirely inside this latent space.',
    definition_beginner: 'Instead of painting a high-resolution billboard brushstroke-by-brushstroke, the AI draws a tiny sketch first, and a projector enlarges it into a huge, beautiful painting.',
    difficulty: 'advanced',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '2021',
    popularized_by: 'Rombach et al. (Stable Diffusion / LMU Munich)',
    categories: ['Training', 'Infrastructure'],
    approved: true
  },
  {
    slug: 'text-to-speech-synthesis',
    name: 'Text-to-Speech Synthesis',
    abbreviation: 'TTS',
    tldr: 'AI systems that convert written text into natural-sounding spoken audio.',
    definition_technical: 'Modern TTS models use neural networks to map text/phonemes to acoustic features (like mel-spectrograms), which are converted to raw audio waveforms using neural vocoders or diffusion models.',
    definition_beginner: 'An AI reader that reads a book aloud, imitating human speech patterns, breathing, and emotions, rather than sounding like a robotic machine.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '1960s (neural TTS in 2016)',
    popularized_by: 'Google (Tacotron/WaveNet), ElevenLabs',
    categories: ['Training'],
    approved: true
  },
  {
    slug: 'speech-to-text-recognition',
    name: 'Automatic Speech Recognition',
    abbreviation: 'ASR',
    tldr: 'AI systems that transcribe spoken audio files into written text formats.',
    definition_technical: 'ASR models process raw audio spectrograms using CTC loss, sequence-to-sequence attention models (like Whisper), or transducer architectures to align audio features with textual tokens.',
    definition_beginner: 'An AI transcriber that listens to a podcast or voice note and writes down every word that was said, complete with punctuation.',
    difficulty: 'intermediate',
    status: 'stable',
    learning_priority: 'know_basics',
    first_appeared: '1950s (deep learning ASR post-2012)',
    popularized_by: 'OpenAI (Whisper), Google, Baidu (Deep Speech)',
    categories: ['Training'],
    approved: true
  }
]

async function seed() {
  console.log('Seeding 50 new concepts...')
  
  // 1. Insert/upsert concepts
  const { data: inserted, error: conceptError } = await db
    .from('concepts')
    .upsert(new50Concepts, { onConflict: 'slug' })
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

  // 2. Define relationships between new concepts and existing/new ones
  const relationships = [
    { parent: 'retrieval-augmented-generation', child: 'retrieval-augmented-fine-tuning', type: 'extended', desc: 'RAFT extends RAG by training the model specifically on RAG tasks', year: 2024 },
    { parent: 'fine-tuning', child: 'retrieval-augmented-fine-tuning', type: 'extended', desc: 'RAFT is a specialized fine-tuning technique designed for retrieval tasks', year: 2024 },
    { parent: 'retrieval-augmented-generation', child: 'self-rag', type: 'extended', desc: 'Self-RAG extends RAG by dynamically deciding when to retrieve and critiquing generated text', year: 2023 },
    { parent: 'direct-preference-optimization', child: 'odds-ratio-preference-optimization', type: 'extended', desc: 'ORPO simplifies preference optimization further by eliminating the reference model', year: 2024 },
    { parent: 'direct-preference-optimization', child: 'contrastive-preference-optimization', type: 'extended', desc: 'CPO adapts preference optimization specifically for translation tasks', year: 2024 },
    { parent: 'reinforcement-learning-from-human-feedback', child: 'rlhf-ppo', type: 'extended', desc: 'PPO is the standard reinforcement learning optimization algorithm in RLHF', year: 2017 },
    { parent: 'reinforcement-learning-from-human-feedback', child: 'odds-ratio-preference-optimization', type: 'replaced', desc: 'ORPO offers a reference-free alternative to traditional PPO-based alignment', year: 2024 },
    { parent: 'test-time-compute', child: 'q-star-search', type: 'inspired_by', desc: 'Q* path planning search is a key driver in the design of test-time compute scaling', year: 2023 },
    { parent: 'test-time-compute', child: 'monte-carlo-tree-search', type: 'extended', desc: 'MCTS is used during inference to explore and evaluate intermediate reasoning paths', year: 2024 },
    { parent: 'multimodal-ai', child: 'contrastive-language-image-pretraining', type: 'inspired_by', desc: 'CLIP popularized cross-modal representation matching in modern multimodal AI', year: 2021 },
    { parent: 'quantization', child: 'low-precision-training', type: 'extended', desc: 'Low-precision training extends lower-bit mathematical representation into training phases', year: 2022 },
    { parent: 'vector-database', child: 'hybrid-search', type: 'inspired_by', desc: 'Hybrid search combines vector database results with keyword indices', year: 2022 },
    { parent: 'vector-database', child: 'dense-passage-retrieval', type: 'inspired_by', desc: 'DPR embeds passages to store in a vector database for semantic search', year: 2020 },
    { parent: 'bi-encoders', child: 'cross-encoders', type: 'competes_with', desc: 'Cross-encoders offer higher accuracy re-ranking but are computationally heavier than bi-encoders', year: 2019 },
    { parent: 'vector-database', child: 'hierarchical-navigable-small-world', type: 'inspired_by', desc: 'HNSW is the main graph index used for fast retrieval in vector databases', year: 2016 },
    { parent: 'vector-database', child: 'inverted-file-index', type: 'inspired_by', desc: 'IVF Indexing is a clustering mechanism used to partition vector search spaces', year: 2018 },
    { parent: 'agentic-coding', child: 'agentic-workflow-patterns', type: 'inspired_by', desc: 'Agentic coding relies on structural patterns like reflection and tool use', year: 2024 },
    { parent: 'agentic-workflow-patterns', child: 'router-agents', type: 'extended', desc: 'Router agents are a structural pattern for directing queries in multi-agent workflows', year: 2023 },
    { parent: 'agentic-workflow-patterns', child: 'planning-agents', type: 'extended', desc: 'Planning agents break down complex instructions into sequential sub-tasks', year: 2023 },
    { parent: 'agentic-workflow-patterns', child: 'memory-augmented-agents', type: 'extended', desc: 'Memory-augmented agents maintain state across multiple turns in a workflow', year: 2023 },
    { parent: 'agentic-workflow-patterns', child: 'multi-agent-collaboration', type: 'extended', desc: 'Multi-agent systems structure cooperation between independent persona agents', year: 2023 },
    { parent: 'agentic-workflow-patterns', child: 'reflection-agent', type: 'extended', desc: 'Self-reflection is a workflow pattern that runs feedback loops on model output', year: 2023 },
    { parent: 'agentic-workflow-patterns', child: 'agent-tool-use', type: 'extended', desc: 'Tool use enables agents to execute external functions and read environments', year: 2023 },
    { parent: 'prompt-injection', child: 'jailbreaking-llms', type: 'extended', desc: 'Jailbreaking is a subset of prompt injection aimed at safety policy bypass', year: 2022 },
    { parent: 'adversarial-robustness', child: 'red-teaming', type: 'inspired_by', desc: 'Red teaming identifies vulnerabilities to improve adversarial robustness', year: 2022 },
    { parent: 'transformers', child: 'vision-transformers', type: 'extended', desc: 'ViT applies self-attention mechanisms to image patch sequences', year: 2020 },
    { parent: 'diffusion-models', child: 'latent-diffusion', type: 'extended', desc: 'Latent diffusion performs the diffusion process in compressed latent spaces', year: 2021 },
    { parent: 'neural-radiance-fields', child: '3d-gaussian-splatting', type: 'competes_with', desc: '3D Gaussian Splatting provides real-time rasterization competing with continuous neural network views', year: 2023 }
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
    } else {
      console.warn(`Could not find parent or child: parent=${rel.parent} (found=${!!parentId}), child=${rel.child} (found=${!!childId})`)
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

  console.log('Seeding 50 concepts complete! 🎉')
}

seed().catch(err => console.error(err))
