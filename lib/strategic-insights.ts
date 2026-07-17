export interface StrategicInsights {
  strategicImpact: 'disruptive' | 'core' | 'supporting'
  complexity: 'Low' | 'Medium' | 'High'
  readiness: 'R&D' | 'Pilot' | 'Production'
  cost: 'Low API' | 'Mid-Tier' | 'High Compute'
  timeToValue: 'Days' | 'Weeks' | 'Months'
  roiHorizon: 'Immediate' | 'Medium Term' | 'Long Term'
  risks: string
  recommendation: string
  bulletin: string
  
  // New features
  maturityScore: number          // e.g. 92
  maturityFactors: {
    academic: number             // 0-100 (Research papers, theory)
    production: number           // 0-100 (Enterprise systems, SLA reliability)
    tooling: number              // 0-100 (SDKs, developer experience)
    community: number            // 0-100 (GitHub stars, Discord, developer adoption)
  }
  enterpriseImplications: {
    infrastructure: string
    training: string
    businessValue: string
  }
  governanceRelevance: {
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    complianceImpact: string
    oversightGuideline: string
  }
}

const tailoredInsights: Record<string, Partial<StrategicInsights>> = {
  'retrieval-augmented-generation': {
    strategicImpact: 'core',
    complexity: 'Medium',
    readiness: 'Production',
    cost: 'Mid-Tier',
    timeToValue: 'Weeks',
    roiHorizon: 'Immediate',
    risks: 'Vector database scaling, hallucinated sources, chunk fragmentation, and context drift.',
    recommendation: 'Adopt immediately. Standardize on hybrid search, semantic reranking, and automated regression testing.',
    bulletin: 'Standard RAG stack is mature. Implement strict regression testing on search outputs.',
    maturityScore: 94,
    maturityFactors: { academic: 96, production: 98, tooling: 95, community: 90 },
    enterpriseImplications: {
      infrastructure: 'Requires vector database instances, embedding models, and caching proxy layers. Low-to-medium compute overhead.',
      training: 'Developers need to learn chunking strategies, hybrid search indexing, and evaluation frameworks (e.g., Ragas).',
      businessValue: 'Immediate value (1-3 weeks). Highly effective for internal knowledge management, customer service bots, and context enrichment.'
    },
    governanceRelevance: {
      riskLevel: 'MEDIUM',
      complianceImpact: 'Ensures data residency compliance but is vulnerable to document leakages if ACLs are not replicated in vector store.',
      oversightGuideline: 'Establish strict access control mapping between source document management systems and the vector database index.'
    }
  },
  'large-reasoning-models': {
    strategicImpact: 'disruptive',
    complexity: 'High',
    readiness: 'Pilot',
    cost: 'High Compute',
    timeToValue: 'Weeks',
    roiHorizon: 'Medium Term',
    risks: 'Unstable latency, higher token overhead, reasoning loop lock-ups.',
    recommendation: 'Deploy reasoning pilots in multi-step workflows. Avoid using for low-latency consumer chat.',
    bulletin: 'Replace custom multi-step prompt loops with native reasoning model APIs to reduce pipeline complexity.',
    maturityScore: 78,
    maturityFactors: { academic: 85, production: 70, tooling: 75, community: 82 },
    enterpriseImplications: {
      infrastructure: 'High API cost or custom model execution servers. Substantial token consumption due to internal thinking loops.',
      training: 'Prompters must adapt to system-2 thinking prompts (giving space to think) and avoid strict JSON validation constraints without thinking buffers.',
      businessValue: 'Medium-term value (1-2 months). Ideal for complex planning, multi-step agent actions, code analysis, and high-difficulty reasoning.'
    },
    governanceRelevance: {
      riskLevel: 'HIGH',
      complianceImpact: 'Non-deterministic thinking paths make auditable trails complex. Latency spikes can breach service SLAs.',
      oversightGuideline: 'Implement guardrails to sanitize output before displaying to users, and track token usage logs systematically.'
    }
  },
  'model-context-protocol': {
    strategicImpact: 'core',
    complexity: 'Medium',
    readiness: 'Pilot',
    cost: 'Low API',
    timeToValue: 'Days',
    roiHorizon: 'Immediate',
    risks: 'Server exposure, custom client injection, protocol version drift, and data scraping.',
    recommendation: 'Adopt for internal development toolbars. Establish secure transport channels for any production MCP servers.',
    bulletin: 'Standardize tool integrations on MCP. Replace ad-hoc REST/GraphQL tool calls with compliant MCP hosts.',
    maturityScore: 85,
    maturityFactors: { academic: 60, production: 88, tooling: 92, community: 90 },
    enterpriseImplications: {
      infrastructure: 'Lightweight JSON-RPC servers. Exposes database schemas or endpoints directly to host client models.',
      training: 'Developers must standardize tool schemas and TypeScript/TypeScript server code templates.',
      businessValue: 'Immediate value. Standardizes client-to-tool connections, eliminating custom API wrapper codes.'
    },
    governanceRelevance: {
      riskLevel: 'CRITICAL',
      complianceImpact: 'Direct database tool execution might bypass traditional backend access validation layers.',
      oversightGuideline: 'Enforce read-only permissions on MCP database tools, run MCP servers in sandboxed VPCs, and audit tool invocations.'
    }
  },
  'agentic-coding': {
    strategicImpact: 'disruptive',
    complexity: 'High',
    readiness: 'Pilot',
    cost: 'Mid-Tier',
    timeToValue: 'Weeks',
    roiHorizon: 'Immediate',
    risks: 'Syntax issues, context pollution, dependency corruption, and unbounded executions.',
    recommendation: 'Integrate into IDE developer toolbelts. Establish secure sandboxes for any autonomous pipeline agents.',
    bulletin: 'Integrate coding agents in localized developer workflows. Do not expose auto-commit code triggers directly to prod.',
    maturityScore: 75,
    maturityFactors: { academic: 80, production: 65, tooling: 85, community: 70 },
    enterpriseImplications: {
      infrastructure: 'Requires isolated code sandboxes, automated testing servers, and multiple agent execution contexts.',
      training: 'Developers transition to loop orchestration, reviewing changes rather than writing code.',
      businessValue: 'Immediate. Boosts coding efficiency by 30-50% for standard tasks, but has higher model token cost.'
    },
    governanceRelevance: {
      riskLevel: 'CRITICAL',
      complianceImpact: 'Autonomous code generation could introduce logic bugs, security vulnerabilities (OWASP top 10), or license contamination (GPL copying).',
      oversightGuideline: 'Automate code scanning (SAST/DAST) on agent pull requests, require human approvals for merge steps, and scan dependencies.'
    }
  },
  'loop-engineering': {
    strategicImpact: 'disruptive',
    complexity: 'High',
    readiness: 'Pilot',
    cost: 'High Compute',
    timeToValue: 'Weeks',
    roiHorizon: 'Medium Term',
    risks: 'Infinite loops, high cost accumulation, unverified test coverage.',
    recommendation: 'Train lead engineers in loop design. Define strict timeout guidelines and token boundaries.',
    bulletin: 'Create containerized sandboxes for automated compilation-and-testing loops to prevent system compromises.',
    maturityScore: 68,
    maturityFactors: { academic: 55, production: 60, tooling: 78, community: 75 },
    enterpriseImplications: {
      infrastructure: 'Multi-container sandboxes with automated compiler/testing loops.',
      training: 'Architects must learn loop constraint modeling and telemetry visualization.',
      businessValue: 'Medium term. Replaces ad-hoc AI interactions with systematic goal-directed execution.'
    },
    governanceRelevance: {
      riskLevel: 'HIGH',
      complianceImpact: 'Infinite looping causes run-away API token costs. Undetected loop lock-ups.',
      oversightGuideline: 'Define strict timeout/max-tokens budgets for every agent execution loop and monitor cost telemetry.'
    }
  },
  'agentic-commerce': {
    strategicImpact: 'disruptive',
    complexity: 'High',
    readiness: 'R&D',
    cost: 'Mid-Tier',
    timeToValue: 'Months',
    roiHorizon: 'Long Term',
    risks: 'Spend leakage, game-theoretic exploitation, legal liability shifts.',
    recommendation: 'Conduct R&D simulations. Run bidding agents in isolated environments with token limits.',
    bulletin: 'Establish strict financial transaction sandboxes for autonomous agent wallets.',
    maturityScore: 52,
    maturityFactors: { academic: 40, production: 45, tooling: 50, community: 60 },
    enterpriseImplications: {
      infrastructure: 'Transactional sandboxes, cryptographic ledgers, and secure API wallets.',
      training: 'Procurement teams must configure SLA parameters and negotiation templates.',
      businessValue: 'Long term. Automates supplier bidding and micro-purchasing.'
    },
    governanceRelevance: {
      riskLevel: 'CRITICAL',
      complianceImpact: 'Legally binding contracts executed by autonomous agents. Bidding collusion risks.',
      oversightGuideline: 'Enforce strict financial spending limits per transaction, implement human-in-the-loop approvals for contracts, and audit bidding logs.'
    }
  },
  'small-language-models': {
    strategicImpact: 'supporting',
    complexity: 'Low',
    readiness: 'Production',
    cost: 'Low API',
    timeToValue: 'Weeks',
    roiHorizon: 'Immediate',
    risks: 'Quantization loss, reduced broad knowledge, semantic compression anomalies.',
    recommendation: 'Deploy locally for single-task classifiers, PII scrubbers, and offline summarizations.',
    bulletin: 'Leverage quantized SLMs (e.g. Llama 8B, Gemma 9B) on edge devices for latency and data privacy.',
    maturityScore: 91,
    maturityFactors: { academic: 88, production: 92, tooling: 94, community: 90 },
    enterpriseImplications: {
      infrastructure: 'Local consumer GPUs or client-side CPU inference. Eliminates ongoing cloud hosting and external API fees.',
      training: 'Developers must learn ONNX runtime compilation, GGUF quantization, and model caching.',
      businessValue: 'Immediate value. Unlocks zero-latency, private offline intelligence for edge and desktop apps.'
    },
    governanceRelevance: {
      riskLevel: 'LOW',
      complianceImpact: 'Reduces PII leakage risk by processing sensitive data entirely within corporate boundary zones.',
      oversightGuideline: 'Validate quantized model accuracies periodically against a gold standard dataset to monitor drift.'
    }
  },
  'rag-2-0': {
    strategicImpact: 'core',
    complexity: 'High',
    readiness: 'Pilot',
    cost: 'High Compute',
    timeToValue: 'Months',
    roiHorizon: 'Medium Term',
    risks: 'Multimodal index synchronization, high document parsing costs, dense retrieval alignment.',
    recommendation: 'Evaluate end-to-end models for document search across blueprints, schemas, and media files.',
    bulletin: 'Evaluate joint embedding models to replace pipeline-based retrievers with end-to-end trained setups.',
    maturityScore: 82,
    maturityFactors: { academic: 90, production: 75, tooling: 80, community: 84 },
    enterpriseImplications: {
      infrastructure: 'Natively multimodal vector databases, image parsing infrastructure, and dense indexing.',
      training: 'Data engineers need training in joint embedding spaces and cross-modal retrieval assessment.',
      businessValue: 'Medium term. Drastically increases search capabilities across mixed schemas like CAD charts, transcripts, and maps.'
    },
    governanceRelevance: {
      riskLevel: 'HIGH',
      complianceImpact: 'Requires screening input blueprints/media for hidden watermarks, copyright items, and restricted formats.',
      oversightGuideline: 'Maintain an auditable log of file ingestion sources and implement multimodal filters on generation outputs.'
    }
  },
  'prompt-caching': {
    strategicImpact: 'supporting',
    complexity: 'Low',
    readiness: 'Production',
    cost: 'Low API',
    timeToValue: 'Days',
    roiHorizon: 'Immediate',
    risks: 'Cache keys expiration, provider-locked configurations, static prefix alignment.',
    recommendation: 'Configure prompt templates to keep static directives at the beginning of API requests.',
    bulletin: 'Standardize prompt structures to place static definitions first, triggering auto-cache savings.',
    maturityScore: 96,
    maturityFactors: { academic: 75, production: 99, tooling: 98, community: 92 },
    enterpriseImplications: {
      infrastructure: 'Requires updating system prompts and standardizing formatting to maximize cache hits. No extra infrastructure.',
      training: 'Minimal. Developers need to order instructions so static variables precede dynamic input blocks.',
      businessValue: 'Immediate (Hours). Instantly reduces API token costs by 30% to 80% on long conversations and large contexts.'
    },
    governanceRelevance: {
      riskLevel: 'LOW',
      complianceImpact: 'No direct compliance changes; token optimization lowers operational operational expenses.',
      oversightGuideline: 'Audit prompt cache hit ratios weekly in telemetry logs to track ROI metrics.'
    }
  },
  'structured-outputs': {
    strategicImpact: 'core',
    complexity: 'Low',
    readiness: 'Production',
    cost: 'Low API',
    timeToValue: 'Days',
    roiHorizon: 'Immediate',
    risks: 'Strict format validation failures, parsing lag, schema migration constraints.',
    recommendation: 'Enforce JSON schema configurations natively in API calls for all integration pipelines.',
    bulletin: 'Migrate standard string parsing code to strict schema APIs (e.g. OpenAI JSON schemas, Pydantic/Zod wrappers).',
    maturityScore: 98,
    maturityFactors: { academic: 80, production: 99, tooling: 99, community: 95 },
    enterpriseImplications: {
      infrastructure: 'Integration with schema validation layers (Zod, Pydantic). Native API schema compilation.',
      training: 'Developers must learn schema formatting and handle API-level parsing errors.',
      businessValue: 'Immediate. Guarantees 100% schema compliance, completely eliminating application crashes from malformed responses.'
    },
    governanceRelevance: {
      riskLevel: 'LOW',
      complianceImpact: 'Ensures structured data pipelines remain predictable, secure, and auditable against backend validations.',
      oversightGuideline: 'Implement fallback handler loops to capture schema mismatch flags in error telemetry logs.'
    }
  },
  'generative-engine-optimization': {
    strategicImpact: 'supporting',
    complexity: 'Medium',
    readiness: 'R&D',
    cost: 'Low API',
    timeToValue: 'Weeks',
    roiHorizon: 'Medium Term',
    risks: 'Scraper updates, formatting shifts, citation tracking volatility.',
    recommendation: 'Re-align content structure for RAG indexers. Add clear summaries, structured tables, and bold specs cards.',
    bulletin: 'Incorporate citation anchors and structural summaries in public web templates to maximize RAG indexing eligibility.',
    maturityScore: 64,
    maturityFactors: { academic: 72, production: 50, tooling: 55, community: 68 },
    enterpriseImplications: {
      infrastructure: 'Web CMS templates and semantic markup optimization. Requires search engine index tracking tools.',
      training: 'Marketing and SEO teams must transition to LLM ranking metrics and citation tracking systems.',
      businessValue: 'Medium term. Protects organic web traffic as search behaviour shifts from keyword engines to AI copilots.'
    },
    governanceRelevance: {
      riskLevel: 'MEDIUM',
      complianceImpact: 'Brand reputation risks if AI summary engines misinterpret text or generate inaccurate summaries.',
      oversightGuideline: 'Audit how public models summarize site content monthly using custom query sets.'
    }
  }
}

export function getStrategicInsights(slug: string, status: string, difficulty: string): StrategicInsights {
  const normalizedSlug = slug.toLowerCase()
  const custom = tailoredInsights[normalizedSlug] || {}
  
  // Fallback heuristic determinations
  const isStable = status === 'stable'
  const isGrowing = status === 'growing'
  const isEmerging = status === 'emerging'
  const isDeclining = status === 'declining' || status === 'historical'
  
  const strategicImpactFallback: 'disruptive' | 'core' | 'supporting' = 
    isEmerging ? 'disruptive' : isGrowing ? 'core' : 'supporting'
  const complexityFallback: 'Low' | 'Medium' | 'High' = 
    difficulty === 'beginner' ? 'Low' : difficulty === 'intermediate' ? 'Medium' : 'High'
  const readinessFallback: 'R&D' | 'Pilot' | 'Production' = 
    isEmerging ? 'R&D' : isGrowing ? 'Pilot' : 'Production'
  const costFallback: 'Low API' | 'Mid-Tier' | 'High Compute' = 
    difficulty === 'advanced' ? 'High Compute' : difficulty === 'intermediate' ? 'Mid-Tier' : 'Low API'
  const timeToValueFallback: 'Days' | 'Weeks' | 'Months' = 
    difficulty === 'beginner' ? 'Days' : difficulty === 'intermediate' ? 'Weeks' : 'Months'
  const roiHorizonFallback: 'Immediate' | 'Medium Term' | 'Long Term' = 
    isStable ? 'Immediate' : isGrowing ? 'Medium Term' : 'Long Term'

  const maturityScoreFallback = isStable ? 90 : isGrowing ? 75 : isEmerging ? 45 : 30
  const academicFallback = isEmerging ? 85 : isGrowing ? 70 : isStable ? 65 : 40
  const productionFallback = isStable ? 92 : isGrowing ? 65 : isEmerging ? 30 : 20
  const toolingFallback = isStable ? 88 : isGrowing ? 75 : isEmerging ? 45 : 30
  const communityFallback = isGrowing ? 85 : isStable ? 80 : isEmerging ? 50 : 30

  // Combine customized insights and general fallback values
  const defaultInsights: StrategicInsights = {
    strategicImpact: custom.strategicImpact || strategicImpactFallback,
    complexity: custom.complexity || complexityFallback,
    readiness: custom.readiness || readinessFallback,
    cost: custom.cost || costFallback,
    timeToValue: custom.timeToValue || timeToValueFallback,
    roiHorizon: custom.roiHorizon || roiHorizonFallback,
    risks: custom.risks || 'Latency variance, dependency security vulnerabilities, and vendor lock-in concerns.',
    recommendation: custom.recommendation || `Pilot with small scope. Standardize integrations before moving to scale production.`,
    bulletin: custom.bulletin || `Audit execution patterns for ${slug} to track compute usage overheads.`,
    maturityScore: custom.maturityScore || maturityScoreFallback,
    maturityFactors: custom.maturityFactors || {
      academic: academicFallback,
      production: productionFallback,
      tooling: toolingFallback,
      community: communityFallback
    },
    enterpriseImplications: custom.enterpriseImplications || {
      infrastructure: `Standard model runtime compute. Can be deployed via SaaS API wrapper gateways.`,
      training: `Developers should read foundational API documentation. Minimal training required.`,
      businessValue: `Drives incremental productivity. Pay-off aligns with ${roiHorizonFallback.toLowerCase()} goals.`
    },
    governanceRelevance: {
      riskLevel: custom.governanceRelevance?.riskLevel || (isEmerging || difficulty === 'advanced' ? 'HIGH' : 'MEDIUM'),
      complianceImpact: custom.governanceRelevance?.complianceImpact || 'Unchecked model outputs can lead to hallucinated statements in user views.',
      oversightGuideline: custom.governanceRelevance?.oversightGuideline || 'Deploy basic output checkers and trace user query records to audit responses.'
    }
  }

  return defaultInsights
}
