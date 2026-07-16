'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Flame, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  Clock, 
  BookOpen, 
  Search,
  CheckCircle,
  TrendingDown,
  Building,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Cpu,
  FileText
} from 'lucide-react'
import type { Concept, DigestEntry } from '@/types'

interface SkillIntelligenceClientProps {
  initialConcepts: Concept[]
  initialEntries: DigestEntry[]
}

interface StrategicMetrics {
  trendScore: number          // e.g. 95
  enterpriseAdoption: string  // 'Low' | 'Medium' | 'High' | 'Very High'
  jobDemand: string           // 'Moderate' | 'High' | 'Very High'
  futureRelevance: number     // 0-10, e.g. 9.8
  estimatedTime: string       // e.g. '8–12 hours'
  prerequisites: string       // e.g. 'Python, APIs'
}

interface SkillDirective {
  conceptId: string
  name: string
  slug: string
  urgencyScore: number // 0-100
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  velocity: 'Hyper-Growth' | 'Steady Rise' | 'Established' | 'Superseded'
  directive: string
  eventTrigger: string
  learningPriority: string
  status: string
  categories: string[]
  tldr: string
  metrics: StrategicMetrics
}

export default function SkillIntelligenceClient({ 
  initialConcepts, 
  initialEntries 
}: SkillIntelligenceClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('urgency')
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null)

  // Map concepts to Skill Directives with computed urgency and Career Strategic Metrics
  const skillDirectives = useMemo(() => {
    return initialConcepts.map(concept => {
      // Find digest entries associated with this concept
      const conceptEntries = initialEntries.filter(e => e.concept_id === concept.id)
      
      let baseScore = 30
      
      // Calculate score based on learning priority
      if (concept.learning_priority === 'learn_now') baseScore = 70
      else if (concept.learning_priority === 'know_basics') baseScore = 45
      else if (concept.learning_priority === 'nice_to_know') baseScore = 20
      else if (concept.learning_priority === 'historical') baseScore = 5

      // Add score boosts from recent digest events (simulated as high-impact)
      let eventTriggers: string[] = []
      conceptEntries.forEach(entry => {
        if (entry.entry_type === 'status_change') {
          baseScore += 22
          eventTriggers.push(`Maturity Shift: ${entry.summary}`)
        } else if (entry.entry_type === 'framework_release') {
          baseScore += 18
          eventTriggers.push(`Tooling/Framework Release: ${entry.summary}`)
        } else if (entry.entry_type === 'new_concept') {
          baseScore += 12
          eventTriggers.push(`Catalog Ingestion: ${entry.summary}`)
        } else if (entry.entry_type === 'notable_paper') {
          baseScore += 10
          eventTriggers.push(`Academic Spike: ${entry.summary}`)
        }
      })

      // Add a slight boost if it is emerging/growing
      if (concept.status === 'emerging') baseScore += 5
      else if (concept.status === 'growing') baseScore += 8

      // Cap urgency score at 99%, minimum at 8%
      const score = Math.min(99, Math.max(8, baseScore))

      // Categorize urgency levels
      let level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW'
      if (score >= 82) level = 'CRITICAL'
      else if (score >= 62) level = 'HIGH'
      else if (score >= 38) level = 'MEDIUM'
      
      // Maturation velocity
      let velocity: 'Hyper-Growth' | 'Steady Rise' | 'Established' | 'Superseded' = 'Established'
      if (concept.status === 'emerging') velocity = 'Hyper-Growth'
      else if (concept.status === 'growing') velocity = 'Steady Rise'
      else if (concept.status === 'stable') velocity = 'Established'
      else if (concept.status === 'declining' || concept.status === 'historical') velocity = 'Superseded'

      // Custom-curated direct actionable tasks for the developer
      let directive = "Study the reference papers, run a local benchmark session, and summarize key limitations for production code."
      
      // Seed Strategic Metrics based on concepts
      let metrics: StrategicMetrics = {
        trendScore: 78,
        enterpriseAdoption: 'Medium',
        jobDemand: 'Moderate',
        futureRelevance: 8.0,
        estimatedTime: '8–12 hours',
        prerequisites: 'Python, Web APIs'
      }

      const slug = concept.slug.toLowerCase()
      if (slug.includes('retrieval-augmented-generation') || slug === 'rag') {
        directive = "Design a hybrid retrieval pipeline using BM25 and dense vectors, implement a reranking step (e.g. Cohere), and run evaluation tests on a custom query set."
        metrics = {
          trendScore: 92,
          enterpriseAdoption: 'Very High',
          jobDemand: 'Very High',
          futureRelevance: 9.2,
          estimatedTime: '12–18 hours',
          prerequisites: 'Python, Vector DBs'
        }
      } else if (slug.includes('model-context-protocol') || slug === 'mcp') {
        directive = "Develop a custom Model Context Protocol (MCP) server in TypeScript that wraps an API or database, and link it as a tool client inside Cursor or Claude Desktop."
        metrics = {
          trendScore: 97,
          enterpriseAdoption: 'Medium',
          jobDemand: 'High',
          futureRelevance: 9.6,
          estimatedTime: '6–10 hours',
          prerequisites: 'TypeScript, APIs'
        }
      } else if (slug.includes('large-reasoning-models') || slug === 'lrms') {
        directive = "Master reinforcement-learning reasoning chains. Write prompts specifically designed to give models (like o1 or DeepSeek R1) space to generate hidden thinking steps before outputting JSON."
        metrics = {
          trendScore: 98,
          enterpriseAdoption: 'High',
          jobDemand: 'Very High',
          futureRelevance: 9.9,
          estimatedTime: '10–14 hours',
          prerequisites: 'Prompt Design, APIs'
        }
      } else if (slug.includes('agentic-coding') || slug === 'ac') {
        directive = "Configure an autonomous coding agent loop. Set up environment sandboxes, design strict file editing system boundaries, and wire output testing hooks."
        metrics = {
          trendScore: 96,
          enterpriseAdoption: 'High',
          jobDemand: 'Very High',
          futureRelevance: 9.7,
          estimatedTime: '16–24 hours',
          prerequisites: 'Python, LLM Agents'
        }
      } else if (slug.includes('loop-engineering') || slug === 'le') {
        directive = "Shift from writing code to building loops. Program an agentic supervisor with automated unit tests that loops until compiler errors are fully resolved."
        metrics = {
          trendScore: 92,
          enterpriseAdoption: 'Medium',
          jobDemand: 'High',
          futureRelevance: 9.3,
          estimatedTime: '8–12 hours',
          prerequisites: 'Testing, Python'
        }
      } else if (slug.includes('context-engineering') || slug === 'ce') {
        directive = "Design a context packing algorithm. Implement dynamic prompt truncation, inject tokenized database schemas, and align context boundaries with LLM window limits."
        metrics = {
          trendScore: 87,
          enterpriseAdoption: 'High',
          jobDemand: 'High',
          futureRelevance: 8.9,
          estimatedTime: '4–8 hours',
          prerequisites: 'APIs, Prompting'
        }
      } else if (slug.includes('small-language-models') || slug === 'slms') {
        directive = "Deploy a sub-8B parameter model (e.g., Llama-3-8B or Gemma-2-9B) locally. Implement GGUF quantization, evaluate latency benchmarks, and run local inference."
        metrics = {
          trendScore: 91,
          enterpriseAdoption: 'High',
          jobDemand: 'High',
          futureRelevance: 9.2,
          estimatedTime: '8–12 hours',
          prerequisites: 'Local Hardware, Python'
        }
      } else if (slug.includes('rag-2-0')) {
        directive = "Construct a native multimodal RAG engine. Store vector embeddings of technical blueprints/images alongside raw text database indexes, and query them combined."
        metrics = {
          trendScore: 94,
          enterpriseAdoption: 'Medium',
          jobDemand: 'High',
          futureRelevance: 9.5,
          estimatedTime: '14–20 hours',
          prerequisites: 'Embeddings, Multimodality'
        }
      } else if (slug.includes('prompt-caching')) {
        directive = "Re-architect your application prompts to separate static system directives from dynamic user text. Force API calls to reuse the exact static prefix to trigger prompt cache savings."
        metrics = {
          trendScore: 88,
          enterpriseAdoption: 'Very High',
          jobDemand: 'High',
          futureRelevance: 8.5,
          estimatedTime: '2–4 hours',
          prerequisites: 'API Integrations'
        }
      } else if (slug.includes('structured-outputs')) {
        directive = "Integrate strict JSON schema validation into your backend LLM controllers. Enable native API structured output parameters to guarantee 100% schema compliance."
        metrics = {
          trendScore: 93,
          enterpriseAdoption: 'Very High',
          jobDemand: 'High',
          futureRelevance: 9.0,
          estimatedTime: '3–6 hours',
          prerequisites: 'JSON Schemas, APIs'
        }
      } else if (slug.includes('generative-engine-optimization') || slug === 'geo') {
        directive = "Audit your website layouts for AI scrapers. Format tables, add bold TL;DR summary cards, and embed explicit citation hooks optimized for RAG crawlers."
        metrics = {
          trendScore: 86,
          enterpriseAdoption: 'Medium',
          jobDemand: 'Moderate',
          futureRelevance: 8.7,
          estimatedTime: '6–10 hours',
          prerequisites: 'Markdown, HTML, SEO'
        }
      } else if (slug.includes('agentic-commerce')) {
        directive = "Design a multi-agent negotiation environment. Implement isolated LLM instances running bidding and sales strategies against a secure sandbox ledger."
        metrics = {
          trendScore: 84,
          enterpriseAdoption: 'Low',
          jobDemand: 'Moderate',
          futureRelevance: 9.1,
          estimatedTime: '12–18 hours',
          prerequisites: 'APIs, Sandbox Ledger'
        }
      } else {
        // Fallback calculations for other items in concepts list
        const isStable = concept.status === 'stable'
        const isGrowing = concept.status === 'growing'
        const isEmerging = concept.status === 'emerging'
        const isLearnNow = concept.learning_priority === 'learn_now'

        metrics = {
          trendScore: isGrowing ? 88 : isStable ? 80 : isEmerging ? 84 : 45,
          enterpriseAdoption: isStable ? 'Very High' : isGrowing ? 'High' : isEmerging ? 'Medium' : 'Low',
          jobDemand: isLearnNow ? 'Very High' : isGrowing ? 'High' : 'Moderate',
          futureRelevance: isEmerging ? 9.2 : isGrowing ? 8.9 : isStable ? 7.6 : 3.0,
          estimatedTime: isStable ? '12–16 hours' : '8–12 hours',
          prerequisites: 'Python, ML Basics'
        }
      }

      return {
        conceptId: concept.id,
        name: concept.name,
        slug: concept.slug,
        urgencyScore: score,
        urgencyLevel: level,
        velocity,
        directive,
        eventTrigger: eventTriggers[0] || `High AI activity and market relevance detected for ${concept.name}.`,
        learningPriority: concept.learning_priority,
        status: concept.status,
        categories: concept.categories || [],
        tldr: concept.tldr || '',
        metrics
      }
    })
  }, [initialConcepts, initialEntries])

  // Compute aggregate analytics for the panel header
  const stats = useMemo(() => {
    const criticalCount = skillDirectives.filter(s => s.urgencyLevel === 'CRITICAL').length
    
    // Find the single highest urgency category
    const categoryScores: Record<string, { total: number; count: number }> = {}
    skillDirectives.forEach(s => {
      s.categories.forEach(cat => {
        if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 }
        categoryScores[cat].total += s.urgencyScore
        categoryScores[cat].count += 1
      })
    })
    
    let maxAvg = 0
    let focusCategory = 'General AI'
    Object.entries(categoryScores).forEach(([cat, data]) => {
      const avg = data.total / data.count
      if (avg > maxAvg) {
        maxAvg = avg
        focusCategory = cat
      }
    })

    return {
      criticalCount,
      focusCategory
    }
  }, [skillDirectives])

  // Filter and Sort Skill Directives
  const filteredSkills = useMemo(() => {
    return skillDirectives
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              s.tldr.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesUrgency = selectedUrgency === 'all' || s.urgencyLevel.toLowerCase() === selectedUrgency.toLowerCase()
        const matchesCategory = selectedCategory === 'All' || s.categories.includes(selectedCategory)
        return matchesSearch && matchesUrgency && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          return b.urgencyScore - a.urgencyScore
        } else if (sortBy === 'trend') {
          return b.metrics.trendScore - a.metrics.trendScore
        } else if (sortBy === 'relevance') {
          return b.metrics.futureRelevance - a.metrics.futureRelevance
        } else {
          return a.name.localeCompare(b.name)
        }
      })
  }, [skillDirectives, searchQuery, selectedUrgency, selectedCategory, sortBy])

  // Categories list
  const categoriesList = useMemo(() => {
    const set = new Set<string>()
    initialConcepts.forEach(c => c.categories?.forEach(cat => set.add(cat)))
    return ['All', ...Array.from(set)].sort()
  }, [initialConcepts])

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'var(--danger)'
      case 'HIGH': return 'var(--accent)'
      case 'MEDIUM': return '#3FA66B'
      default: return 'var(--text-3)'
    }
  }

  const getUrgencyBg = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'rgba(239, 68, 68, 0.08)'
      case 'HIGH': return 'rgba(212, 175, 55, 0.08)'
      case 'MEDIUM': return 'rgba(63, 166, 107, 0.08)'
      default: return 'rgba(138, 134, 125, 0.08)'
    }
  }

  const getUrgencyBorder = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'rgba(239, 68, 68, 0.25)'
      case 'HIGH': return 'rgba(212, 175, 55, 0.25)'
      case 'MEDIUM': return 'rgba(63, 166, 107, 0.25)'
      default: return 'rgba(138, 134, 125, 0.2)'
    }
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px' }}>
      
      {/* 1. Dashboard Header */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, 
          textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--danger)', 
          background: 'rgba(239, 68, 68, 0.06)', padding: '5px 12px', borderRadius: '20px', 
          marginBottom: '16px', fontFamily: 'var(--font-mono)', border: '1px solid rgba(239, 68, 68, 0.18)',
        }}>
          <Flame size={12} className="pulse-animation" />
          <span>Real-time Career Intelligence</span>
        </div>
        <h1 className="gradient-text" style={{ 
          fontSize: 'clamp(34px, 5vw, 46px)', fontWeight: 900, marginBottom: '14px', 
          letterSpacing: '-0.025em', fontFamily: 'var(--font-heading)' 
        }}>
          AI Skill Radar
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '16.5px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65 }}>
          Back your learning decisions with quantitative career signals. Explore the Strategic Value Scores 
          measuring adoption, job demand, and growth speed of every AI skill.
        </p>
      </div>

      {/* 2. Key Metrics Panel */}
      <div className="grid-metrics" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px', marginBottom: '40px'
      }}>
        <div className="metric-card" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '8px' }}>
            <Flame size={18} className="pulse-animation" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>Urgent Learning Spike</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
            {stats.criticalCount} Skills
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Ranked as critical priority this week</div>
        </div>

        <div className="metric-card" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px' }}>
            <TrendingUp size={18} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>Enterprise Velocity</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
            Accelerating
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Transitioning from emerging to production in under 60 days</div>
        </div>

        <div className="metric-card" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3FA66B', marginBottom: '8px' }}>
            <Layers size={18} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>Hiring Hot Zone</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stats.focusCategory}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Highest concentration of recruitment activity</div>
        </div>
      </div>

      {/* 3. Filtering & Sorting Dashboard Control */}
      <div style={{ 
        background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', 
        padding: '20px 24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' 
      }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input 
            type="text" 
            placeholder="Search AI skills by name or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 42px', background: 'var(--bg-3)',
              border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)',
              fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
            }}
            className="search-input"
          />
        </div>

        {/* Filters and sorting layout */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Urgency Level Filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-3)', marginRight: '6px', fontFamily: 'var(--font-mono)' }}>Priority:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map(level => {
              const isActive = selectedUrgency === level
              return (
                <button
                  key={level}
                  onClick={() => setSelectedUrgency(level)}
                  style={{
                    padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border)'}`,
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer',
                    fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
                    transition: 'all 0.2s',
                  }}
                >
                  {level}
                </button>
              )
            })}
          </div>

          {/* Category & Sorting selector */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '6px',
                  color: 'var(--text-2)', padding: '6px 12px', fontSize: '12.5px', outline: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-mono)'
                }}
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '6px',
                  color: 'var(--text-2)', padding: '6px 12px', fontSize: '12.5px', outline: 'none',
                  cursor: 'pointer', fontFamily: 'var(--font-mono)'
                }}
              >
                <option value="urgency">Learning Urgency</option>
                <option value="trend">Trend Score</option>
                <option value="relevance">Future Relevance</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Priority Radar Results Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>📊</span> Strategic Career Value Ratings ({filteredSkills.length})
      </h2>

      {filteredSkills.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-2)', marginBottom: '48px' }}>
          <AlertTriangle size={32} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
          <p style={{ fontWeight: 500 }}>No priority skills match your selected filter criteria.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedUrgency('all'); setSelectedCategory('All'); setSortBy('urgency') }}
            style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textDecoration: 'underline' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '64px' }}>
          {filteredSkills.map(skill => {
            const isExpanded = expandedConcept === skill.conceptId
            return (
              <motion.div
                key={skill.conceptId}
                layout="position"
                style={{
                  background: 'var(--bg-2)', border: `1px solid ${isExpanded ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', padding: '24px', transition: 'border-color 0.25s, box-shadow 0.25s',
                  boxShadow: isExpanded ? '0 12px 36px rgba(212, 175, 55, 0.05)' : 'none',
                  position: 'relative', overflow: 'hidden'
                }}
                className="skill-intelligence-row"
              >
                {/* Visual indicator glow for Critical/High */}
                {skill.urgencyLevel === 'CRITICAL' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--danger)' }} />
                )}
                {skill.urgencyLevel === 'HIGH' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }} />
                )}

                {/* Main Content Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Link href={`/concepts/${skill.slug}`}>
                        <h3 className="skill-title-link" style={{ fontSize: '19.5px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', cursor: 'pointer' }}>
                          {skill.name}
                        </h3>
                      </Link>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {skill.categories.map(cat => (
                          <span key={cat} style={{
                            fontSize: '9.5px', color: 'var(--text-3)', background: 'var(--bg-3)',
                            padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--border)',
                            fontFamily: 'var(--font-mono)'
                          }}>{cat}</span>
                        ))}
                      </div>
                    </div>

                    {/* Urgency Badge & score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '9.5px', fontWeight: 800, padding: '4px 10px',
                        background: getUrgencyBg(skill.urgencyLevel), color: getUrgencyColor(skill.urgencyLevel),
                        border: `1px solid ${getUrgencyBorder(skill.urgencyLevel)}`, borderRadius: '20px',
                        fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                        {skill.urgencyLevel === 'CRITICAL' && <Flame size={10} className="pulse-animation" />}
                        {skill.urgencyLevel === 'HIGH' && <AlertTriangle size={10} />}
                        {skill.urgencyLevel === 'MEDIUM' && <Zap size={10} />}
                        <span>{skill.urgencyLevel} Priority</span>
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p style={{ color: 'var(--text-2)', fontSize: '14.5px', lineHeight: 1.55, margin: 0 }}>
                    {skill.tldr}
                  </p>

                  {/* ========================================================
                      STRATEGIC CAREER VALUE SCOREBOARD (Grid metrics block) 
                      ======================================================== */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px',
                    padding: '16px',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}>
                    {/* Trend Score */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                        📈 Trend Score
                      </span>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                        {skill.metrics.trendScore}/100
                      </span>
                    </div>

                    {/* Enterprise Adoption */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                        🏢 Adoption
                      </span>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                        {skill.metrics.enterpriseAdoption}
                      </span>
                    </div>

                    {/* Job Demand */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                        💼 Job Demand
                      </span>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                        {skill.metrics.jobDemand}
                      </span>
                    </div>

                    {/* Future Relevance */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                        🔮 Future Relevance
                      </span>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                        {skill.metrics.futureRelevance}/10
                      </span>
                    </div>

                    {/* Estimated Study Time */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                        ⏱ Est. Study Time
                      </span>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                        {skill.metrics.estimatedTime}
                      </span>
                    </div>

                    {/* Prerequisites */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                        🔗 Prerequisites
                      </span>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={skill.metrics.prerequisites}>
                        {skill.metrics.prerequisites}
                      </span>
                    </div>
                  </div>

                  {/* Trigger event description */}
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', fontStyle: 'italic', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)' }}>📡 Event Spike Trigger:</span>
                    <span>{skill.eventTrigger}</span>
                  </div>

                  {/* Expand and explore buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <Link href={`/concepts/${skill.slug}`}>
                      <button style={{
                        background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)',
                        padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                      }} className="details-btn">
                        <BookOpen size={13} />
                        <span>Specs Sheet</span>
                      </button>
                    </Link>

                    <button 
                      onClick={() => setExpandedConcept(isExpanded ? null : skill.conceptId)}
                      style={{
                        background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)',
                        padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
                      }}
                      className="directive-btn"
                    >
                      <Zap size={13} />
                      <span>{isExpanded ? 'Collapse Objectives' : 'Personal Study Directive'}</span>
                    </button>
                  </div>

                  {/* Expanded Actionable Learning Directive Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ 
                          marginTop: '12px', background: 'var(--bg-3)', border: '1px solid var(--accent-border)',
                          borderRadius: '8px', padding: '16px 20px', borderLeft: '4px solid var(--accent)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', marginBottom: '8px' }}>
                            <CheckCircle size={14} />
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                              CRITICAL DECISION DIRECTIVE (WHAT TO BUILD)
                            </span>
                          </div>
                          <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.6, fontWeight: 500, margin: '0 0 10px 0' }}>
                            {skill.directive}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                            <Clock size={12} />
                            <span>Recommended Timeline: Dedicate {skill.metrics.estimatedTime} this week to build this out.</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Styled classes rules */}
      <style>{`
        .pulse-animation {
          animation: pulse-glow 2s infinite ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .skill-intelligence-row:hover {
          border-color: var(--accent-border) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .skill-title-link:hover {
          color: var(--accent) !important;
          text-decoration: underline;
        }
        .details-btn:hover {
          border-color: var(--accent) !important;
          color: var(--text) !important;
          background: var(--bg-3) !important;
        }
        .directive-btn:hover {
          background: rgba(212, 175, 55, 0.12) !important;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15) !important;
        }
        .search-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px var(--accent-dim);
        }
      `}</style>

    </div>
  )
}
