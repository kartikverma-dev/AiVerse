-- Run this in your Supabase SQL editor to set up the full schema

-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Core concept table
CREATE TABLE IF NOT EXISTS concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  abbreviation text,
  tldr text,
  definition_technical text,
  definition_beginner text,
  difficulty text DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  status text DEFAULT 'emerging' CHECK (status IN ('emerging', 'growing', 'stable', 'declining', 'historical')),
  learning_priority text DEFAULT 'know_basics' CHECK (learning_priority IN ('learn_now', 'know_basics', 'nice_to_know', 'historical')),
  first_appeared text,
  popularized_by text,
  categories text[] DEFAULT '{}',
  approved boolean DEFAULT false,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Evolution relationships between concepts
CREATE TABLE IF NOT EXISTS concept_evolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  child_concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  relationship_type text DEFAULT 'extended' CHECK (relationship_type IN ('replaced', 'extended', 'inspired_by', 'competes_with')),
  description text,
  year int,
  UNIQUE(parent_concept_id, child_concept_id)
);

-- Trusted source citations
CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  source_type text CHECK (source_type IN ('official_blog', 'paper', 'github', 'researcher', 'community')),
  authority_rank int DEFAULT 3 CHECK (authority_rank BETWEEN 1 AND 6),
  published_date date
);

-- Real-world usage examples
CREATE TABLE IF NOT EXISTS examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  industry text
);

-- Weekly digest entries
CREATE TABLE IF NOT EXISTS digest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of date NOT NULL,
  entry_type text CHECK (entry_type IN ('new_concept', 'status_change', 'notable_paper', 'framework_release')),
  concept_id uuid REFERENCES concepts(id) ON DELETE SET NULL,
  summary text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Trend tracking (weekly snapshots)
CREATE TABLE IF NOT EXISTS trend_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid REFERENCES concepts(id) ON DELETE CASCADE,
  week_of date NOT NULL,
  github_stars int DEFAULT 0,
  paper_mentions int DEFAULT 0,
  community_volume int DEFAULT 0,
  UNIQUE(concept_id, week_of)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_concepts_status ON concepts(status);
CREATE INDEX IF NOT EXISTS idx_concepts_approved ON concepts(approved);
CREATE INDEX IF NOT EXISTS idx_concepts_slug ON concepts(slug);
CREATE INDEX IF NOT EXISTS idx_evolutions_parent ON concept_evolutions(parent_concept_id);
CREATE INDEX IF NOT EXISTS idx_evolutions_child ON concept_evolutions(child_concept_id);
CREATE INDEX IF NOT EXISTS idx_digest_week ON digest_entries(week_of);
CREATE INDEX IF NOT EXISTS idx_trends_concept ON trend_snapshots(concept_id);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_concepts_fts ON concepts USING gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(tldr,'') || ' ' || coalesce(definition_technical,'')));

-- RLS policies (enable row-level security)
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read access for approved concepts
CREATE POLICY "Public read approved concepts" ON concepts FOR SELECT USING (approved = true);
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Public read examples" ON examples FOR SELECT USING (true);
CREATE POLICY "Public read evolutions" ON concept_evolutions FOR SELECT USING (true);
CREATE POLICY "Public read digest" ON digest_entries FOR SELECT USING (true);
CREATE POLICY "Public read trends" ON trend_snapshots FOR SELECT USING (true);

-- Service role has full access (used by admin API routes)
CREATE POLICY "Service full access concepts" ON concepts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access sources" ON sources FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access examples" ON examples FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access evolutions" ON concept_evolutions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access digest" ON digest_entries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service full access trends" ON trend_snapshots FOR ALL USING (auth.role() = 'service_role');

-- Seed: 15 core AI concepts to start
INSERT INTO concepts (slug, name, abbreviation, tldr, definition_technical, definition_beginner, difficulty, status, learning_priority, first_appeared, popularized_by, categories, approved) VALUES

('retrieval-augmented-generation', 'Retrieval-Augmented Generation', 'RAG', 'A technique that enhances LLM responses by retrieving relevant documents from an external knowledge base before generating an answer.', 'RAG combines a dense retrieval system (typically a vector database queried via embedding similarity) with a generative LLM. At inference time, the query is embedded, top-k documents are retrieved, and injected into the prompt context before generation.', 'Imagine asking a question and before answering, the AI quickly searches a library of documents and reads the relevant pages — then gives you an answer based on actual sources rather than just its training memory.', 'intermediate', 'stable', 'learn_now', '2020', 'Lewis et al. (Meta AI, 2020)', ARRAY['Retrieval','Agents','Infrastructure'], true),

('prompt-engineering', 'Prompt Engineering', 'PE', 'The practice of crafting and optimizing input text to get better outputs from language models.', 'Prompt engineering involves systematic design of input sequences to elicit desired behaviors from LLMs, including techniques like few-shot examples, role assignment, output format specification, and constraint definition.', 'Think of it like learning how to give instructions to a very literal genie — the better and clearer your wish, the better the result.', 'beginner', 'historical', 'historical', '2021', 'OpenAI researchers, community', ARRAY['Prompting'], true),

('chain-of-thought-prompting', 'Chain-of-Thought Prompting', 'CoT', 'A technique that improves LLM reasoning by asking the model to show its intermediate reasoning steps before giving a final answer.', 'CoT prompting elicits step-by-step reasoning from LLMs by including worked examples with reasoning traces in the prompt, or by appending "Let''s think step by step" to trigger zero-shot reasoning chains.', 'Instead of just asking for the answer, you ask the AI to "show its work" like in math class — and this actually makes the final answer much more accurate.', 'intermediate', 'stable', 'know_basics', '2022', 'Wei et al. (Google Brain, 2022)', ARRAY['Prompting','Training'], true),

('agentic-coding', 'Agentic Coding', 'AC', 'A software development approach where AI agents autonomously write, test, debug, and iterate on code with minimal human intervention.', 'Agentic coding systems use LLMs as autonomous agents equipped with tools (code execution, file system access, web search, terminal) to complete multi-step programming tasks. The agent plans, generates code, runs tests, observes results, and self-corrects across multiple iterations.', 'Instead of you typing every line of code, an AI agent takes your description of what you want and builds it — running the code, fixing errors, and iterating until it works.', 'advanced', 'growing', 'learn_now', 'mid-2025', 'Cursor, Devin, various AI coding tool builders', ARRAY['Agents','Coding'], true),

('loop-engineering', 'Loop Engineering', 'LE', 'A practice where developers define goals and constraints for autonomous AI coding agents, then oversee iterative execution loops rather than writing code directly.', 'Loop engineering shifts the developer''s role from code author to loop orchestrator. The developer specifies objectives, acceptance criteria, tool permissions, and evaluation criteria. An autonomous LLM agent executes code-test-observe loops until criteria are met or human review is requested.', 'Think of it like being a film director instead of an actor. You describe the scene and outcomes you want, watch what the AI produces across multiple takes, and guide it toward your vision without writing every line yourself.', 'advanced', 'emerging', 'learn_now', 'late 2025', 'Karpathy (2025), agentic tool community', ARRAY['Agents','Coding'], true),

('context-engineering', 'Context Engineering', 'CE', 'The discipline of deliberately constructing and managing everything in an LLM''s context window to maximize output quality.', 'Context engineering goes beyond prompt design to encompass the full architecture of what enters the context window: system instructions, retrieved documents, tool outputs, conversation history, structured data, and output format specifications — and how these are prioritized, compressed, and sequenced.', 'If prompt engineering is writing a good question, context engineering is setting up the entire room — the background information, the tools on the table, the rules on the wall — so the AI can do its best work.', 'intermediate', 'growing', 'learn_now', '2025', 'Karpathy (2025), LangChain community', ARRAY['Prompting','Agents'], true),

('mixture-of-experts', 'Mixture of Experts', 'MoE', 'A model architecture where only a subset of the network''s parameters are activated for each input, enabling much larger models at lower computational cost.', 'In MoE architectures, a gating network routes each input token to a sparse subset of specialized "expert" feed-forward networks. Only k of N experts activate per token, keeping compute proportional to the sparse subset while total model capacity scales with N.', 'Imagine a company with 100 specialists — instead of asking all 100 for every question, a smart coordinator routes each question to the 2-3 most relevant experts. You get the knowledge of all 100 at the cost of consulting only a few.', 'advanced', 'growing', 'know_basics', '2017', 'Shazeer et al. (Google, 2017), popularized by Mistral/DeepSeek 2023-24', ARRAY['Training','Infrastructure'], true),

('vibe-coding', 'Vibe Coding', null, 'A casual, intuition-driven approach to programming where developers describe what they want in natural language and accept AI-generated code with minimal review.', 'Vibe coding describes a workflow where the programmer provides natural language intent descriptions and accepts LLM-generated code without deep comprehension of the implementation. It prioritizes speed and flow over code mastery, relying on the AI''s technical correctness.', 'It''s like humming a tune and having the AI fill in all the notes — you have the feeling of what you want, and you let the AI handle the specifics without sweating the details.', 'beginner', 'stable', 'know_basics', 'early 2025', 'Karpathy (Feb 2025, X/Twitter post)', ARRAY['Coding','Prompting'], true),

('fine-tuning', 'Fine-Tuning', 'FT', 'Further training a pre-trained model on a smaller, task-specific dataset to adapt it for specialized tasks or domains.', 'Fine-tuning continues training a pre-trained foundation model on a curated dataset using supervised learning, updating some or all parameters via gradient descent. Techniques include full fine-tuning, LoRA (low-rank adaptation), and QLoRA for memory efficiency.', 'Think of it like sending a well-educated generalist to a specialized bootcamp — they already know how to learn, you just focus that knowledge on your specific domain.', 'intermediate', 'stable', 'know_basics', '2018', 'ULMFiT (Howard & Ruder, 2018), widely adopted post-GPT', ARRAY['Training'], true),

('vector-database', 'Vector Database', 'VectorDB', 'A database optimized for storing and querying high-dimensional vector embeddings, enabling fast semantic similarity search.', 'Vector databases index embedding vectors using approximate nearest-neighbor (ANN) algorithms (HNSW, IVF, LSH) to enable sub-linear time similarity search over millions to billions of vectors. Core to RAG, semantic search, and recommendation systems.', 'While normal databases find exact matches (find the row where name = "cat"), vector databases find semantic matches — "find me everything similar in meaning to this sentence" — making them essential for AI apps.', 'intermediate', 'stable', 'learn_now', '2021', 'Pinecone, Weaviate, Chroma, pgvector', ARRAY['Retrieval','Infrastructure'], true),

('reinforcement-learning-from-human-feedback', 'Reinforcement Learning from Human Feedback', 'RLHF', 'A training technique that uses human preference judgments to align LLM outputs with human values and intentions.', 'RLHF involves three stages: supervised fine-tuning on demonstrations, training a reward model on human preference comparisons, and optimizing the policy LLM using PPO (proximal policy optimization) against the reward model signal.', 'Imagine training a dog — instead of just showing it what to do, you have many trainers rate which behaviors they prefer, and the dog learns to optimize for those ratings. RLHF does the same for AI.', 'advanced', 'stable', 'know_basics', '2017', 'Christiano et al. (OpenAI, 2017), scaled for LLMs by InstructGPT (2022)', ARRAY['Training'], true),

('model-context-protocol', 'Model Context Protocol', 'MCP', 'An open standard that enables LLMs to connect with external tools, data sources, and services through a unified interface.', 'MCP defines a client-server protocol where LLM applications (hosts) connect to MCP servers that expose tools, resources, and prompts. It standardizes how models request external capabilities, replacing ad-hoc tool integrations with a composable, interoperable layer.', 'MCP is like USB for AI — before USB, every device needed its own connector. MCP gives AI models one standard way to plug into any tool, database, or service.', 'intermediate', 'growing', 'learn_now', '2024', 'Anthropic (Nov 2024)', ARRAY['Agents','Infrastructure'], true),

('function-calling', 'Function Calling', null, 'A capability that allows LLMs to request the execution of predefined functions and use their outputs within a conversation.', 'Function calling (tool use) enables LLMs to generate structured JSON describing a function invocation. The host application executes the function and returns results to the model, which incorporates them into its response. Enables reliable structured output extraction and tool integration.', 'Instead of the AI just describing how to look something up, it can actually ask your app to look it up and tell it the answer — like giving the AI a set of buttons it can press to get real information.', 'intermediate', 'stable', 'learn_now', '2023', 'OpenAI (June 2023), adopted across all major providers', ARRAY['Agents','Prompting'], true),

('knowledge-distillation', 'Knowledge Distillation', 'KD', 'A model compression technique where a smaller student model is trained to mimic the behavior of a larger teacher model.', 'Knowledge distillation trains a compact student model to match the soft probability distributions (logits) of a larger teacher model, rather than just hard labels. The student learns richer representations than training on ground truth alone, achieving better performance than its size would suggest.', 'Think of it like having a master expert write a textbook for students — the textbook captures not just answers but the expert''s reasoning and uncertainty, helping students learn far more efficiently than from raw data alone.', 'advanced', 'stable', 'nice_to_know', '2015', 'Hinton et al. (Google, 2015)', ARRAY['Training'], true),

('multimodal-ai', 'Multimodal AI', null, 'AI systems that can understand and generate across multiple data types — text, images, audio, and video — within a single model.', 'Multimodal models process heterogeneous input modalities through separate encoders that project each modality into a shared embedding space, enabling cross-modal reasoning. Output can span modalities via specialized decoders. Examples: GPT-4o, Gemini, Claude.', 'Earlier AI was like a specialist who only spoke one language. Multimodal AI is like a polyglot who can read a document, look at a photo, listen to audio, and respond in any of those formats — all in one conversation.', 'intermediate', 'growing', 'know_basics', '2021', 'CLIP (OpenAI, 2021), scaled through GPT-4V and Gemini', ARRAY['Training','Infrastructure'], true),

('generative-engine-optimization', 'Generative Engine Optimization', 'GEO', 'The practice of optimizing content to appear in AI-generated summaries and responses, replacing traditional SEO as users increasingly rely on AI for search results.', 'GEO involves structuring website data and text specifically for Retrieval-Augmented Generation (RAG) and LLM search agents. Techniques include citations optimization, jargon alignment, authoritative tone adjustment, schema markup optimization, and formatting content to align with LLM embedding and tokenization models.', 'Just like SEO helps websites rank higher on Google search, GEO helps websites get chosen and cited by AI tools like ChatGPT, Claude, or Perplexity when users ask them questions.', 'intermediate', 'emerging', 'learn_now', '2024', 'Academic researchers, digital marketing agencies', ARRAY['Retrieval','Prompting'], true),

('small-language-models', 'Small Language Models', 'SLMs', 'Compact, efficient models designed for local deployment on devices like laptops, offering privacy and speed advantages over massive cloud-based models.', 'SLMs leverage advanced distillation, higher quality datasets (often synthetic), and architectural tricks to achieve reasoning scores close to giant models while fitting within small RAM budgets.', 'A pocket-sized dictionary that contains just the most useful words and facts. It doesn''t know everything, but it fits in your pocket and answers questions instantly without internet.', 'beginner', 'growing', 'learn_now', '2023', 'Microsoft (Phi series), Google (Gemma), Meta (Llama-3 8B)', ARRAY['Infrastructure','Agents'], true),

('rag-2-0', 'RAG 2.0', 'RAG 2.0', 'An evolution of Retrieval Augmented Generation that is native, end-to-end, and multimodal, retrieving information from diverse sources like technical drawings and audio logs, not just text.', 'RAG 2.0 transitions from pipeline-based architectures (separate retriever and generator models) to end-to-end trained multimodal retrieval-generation networks. It performs dense retrieval directly over heterogeneous formats (documents, CAD drawings, audio clips) using joint embedding spaces, feeding multimodal context into natively multimodal LLMs.', 'While regular RAG can only search through text files, RAG 2.0 can search and read blueprints, listen to audio files, and watch videos to find the right answers to your questions.', 'advanced', 'growing', 'learn_now', '2024', 'Contextual AI, enterprise AI vendors', ARRAY['Retrieval','Infrastructure'], true),

('large-reasoning-models', 'Large Reasoning Models', 'LRMs', 'Models specifically designed for complex, multi-step logical thinking, planning, and showing their work.', 'LRMs leverage reinforcement learning at scale (RL) to train the model to perform system 2 thinking (deliberate, slow reasoning). They use search algorithms (like Monte Carlo Tree Search) and generate internal hidden chains of thought to plan, backtrack, self-correct, and evaluate hypotheses before producing a response.', 'Instead of blurting out the first word that comes to mind, these models take a few seconds to think, plan, and double-check their math internally before giving you the final answer.', 'advanced', 'growing', 'learn_now', '2024', 'OpenAI (o1/o3 series), DeepSeek (R1 series)', ARRAY['Training','Infrastructure'], true),

('agentic-commerce', 'Agentic Commerce', 'Agentic Commerce', 'A B2B model where AI agents autonomously negotiate prices, compare products, and execute purchases between companies without human intervention.', 'Agentic Commerce uses multi-agent orchestration to conduct automated B2B procurement. Buyer and seller agents utilize game-theory negotiation protocols, access APIs for inventory checks, evaluate SLA terms via smart contracts, and execute secure automated transactions.', 'Instead of employees spending days emailing suppliers to get quotes and place orders, a company''s AI agent negotiates prices and buys products directly from a supplier''s AI agent.', 'intermediate', 'emerging', 'nice_to_know', '2025', 'B2B AI platforms, autonomous agent developers', ARRAY['Agents'], true)

ON CONFLICT (slug) DO NOTHING;

-- Seed evolution relationships
INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'Chain-of-thought extended basic prompting with explicit reasoning traces', 2022
FROM concepts p, concepts c WHERE p.slug = 'prompt-engineering' AND c.slug = 'chain-of-thought-prompting'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'Context engineering extends prompt engineering to the full context window architecture', 2025
FROM concepts p, concepts c WHERE p.slug = 'prompt-engineering' AND c.slug = 'context-engineering'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'Agentic coding evolved from vibe coding with autonomous multi-step execution', 2025
FROM concepts p, concepts c WHERE p.slug = 'vibe-coding' AND c.slug = 'agentic-coding'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'replaced', 'Loop engineering replaces agentic coding as the mental model for AI-driven development', 2025
FROM concepts p, concepts c WHERE p.slug = 'agentic-coding' AND c.slug = 'loop-engineering'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'inspired_by', 'RAG uses vector databases as its retrieval backbone', 2021
FROM concepts p, concepts c WHERE p.slug = 'vector-database' AND c.slug = 'retrieval-augmented-generation'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'RAG 2.0 upgrades RAG to be end-to-end trained and natively multimodal', 2024
FROM concepts p, concepts c WHERE p.slug = 'retrieval-augmented-generation' AND c.slug = 'rag-2-0'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'LRMs build native step-by-step reasoning and hidden chains of thought directly into the model training loop', 2024
FROM concepts p, concepts c WHERE p.slug = 'chain-of-thought-prompting' AND c.slug = 'large-reasoning-models'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'inspired_by', 'Agentic commerce applies autonomous multi-step execution loops to business procurement and transactions', 2025
FROM concepts p, concepts c WHERE p.slug = 'loop-engineering' AND c.slug = 'agentic-commerce'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'GEO extends optimization strategies to retrieval-based AI search engines', 2024
FROM concepts p, concepts c WHERE p.slug = 'retrieval-augmented-generation' AND c.slug = 'generative-engine-optimization'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'Knowledge distillation enables small language models to inherit reasoning capabilities from large teacher models', 2023
FROM concepts p, concepts c WHERE p.slug = 'knowledge-distillation' AND c.slug = 'small-language-models'
ON CONFLICT DO NOTHING;

INSERT INTO concept_evolutions (parent_concept_id, child_concept_id, relationship_type, description, year)
SELECT p.id, c.id, 'extended', 'Model quantization allows small language models to fit and run efficiently on local/edge devices', 2023
FROM concepts p, concepts c WHERE p.slug = 'quantization' AND c.slug = 'small-language-models'
ON CONFLICT DO NOTHING;

-- Seed some digest entries
INSERT INTO digest_entries (week_of, entry_type, summary) VALUES
('2026-06-23', 'new_concept', 'Loop Engineering added to the library — the emerging practice of directing autonomous AI coding agents through iterative execution loops.'),
('2026-06-23', 'status_change', 'RAG updated to Stable status after sustained mainstream adoption across enterprise deployments throughout 2025-2026.'),
('2026-06-23', 'notable_paper', 'New arXiv survey of 47 teams using AI coding agents in production finds loop-based approaches outperform one-shot generation in 89% of complex tasks.'),
('2026-06-16', 'new_concept', 'Context Engineering added — the discipline of architecting the full LLM context window, not just the prompt.'),
('2026-06-16', 'framework_release', 'MCP (Model Context Protocol) ecosystem reaches 500+ community-built servers, cementing its role as the standard agent-tool interface.'),
('2026-06-29', 'new_concept', 'Generative Engine Optimization (GEO) added to track how creators optimize content to appear in AI-generated summaries and responses.'),
('2026-06-22', 'new_concept', 'RAG 2.0 introduced, showing a shift from text-only pipelines to native, end-to-end multimodal retrieval architectures.'),
('2026-06-29', 'status_change', 'Large Reasoning Models (LRMs) status updated to Growing with the emergence of reinforcement learning scaled models that show their work.'),
('2026-06-29', 'new_concept', 'Agentic Commerce enters early deployment stages, enabling autonomous AI agents to negotiate and execute B2B transactions.')
ON CONFLICT DO NOTHING;
