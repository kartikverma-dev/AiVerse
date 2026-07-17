'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Briefcase,
  ShieldAlert,
  DollarSign,
  Layers,
  Activity,
  Compass,
  Zap,
  Check,
  Plus,
  Trash,
  ArrowRight,
  Sparkles,
  Cpu,
  BookOpen,
  TrendingUp,
  X,
  TrendingDown,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import type { Concept, DigestEntry } from '@/types'
import { getStrategicInsights } from '@/lib/strategic-insights'

interface StrategyBoardClientProps {
  initialConcepts: Concept[]
  initialEntries?: DigestEntry[]
}

interface StrategicData {
  strategicImpact: 'disruptive' | 'core' | 'supporting'
  maturity: 'emerging' | 'growing' | 'stable' | 'historical'
  complexity: 'Low' | 'Medium' | 'High'
  readiness: 'R&D' | 'Pilot' | 'Production'
  cost: 'Low API' | 'Mid-Tier' | 'High Compute'
  timeToValue: 'Days' | 'Weeks' | 'Months'
  roiHorizon: 'Immediate' | 'Medium Term' | 'Long Term'
  risks: string
  recommendation: string
  bulletin: string
  
  // GRC & Maturity fields
  maturityScore: number
  maturityFactors: {
    academic: number
    production: number
    tooling: number
    community: number
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

// Extends Concept with computed Strategic properties
type StrategicConcept = Concept & {
  strategy: StrategicData
}

export default function StrategyBoardClient({ initialConcepts, initialEntries = [] }: StrategyBoardClientProps) {
  const [selectedFocus, setSelectedFocus] = useState<'all' | 'cost' | 'innovation' | 'operations'>('all')
  const [selectedCompare, setSelectedCompare] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'matrix' | 'compare' | 'roadmap' | 'signals'>('matrix')
  const [expandedConcept, setExpandedConcept] = useState<StrategicConcept | null>(null)

  // Roadmap Form State
  const [industry, setIndustry] = useState<string>('saas')
  const [readiness, setReadiness] = useState<string>('walk')
  const [goal, setGoal] = useState<string>('velocity')
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any | null>(null)
  const [wizardStep, setWizardStep] = useState<number>(1)

  // Enrich concepts with executive/strategic metrics using shared helper
  const concepts: StrategicConcept[] = useMemo(() => {
    return initialConcepts.map(c => {
      const insights = getStrategicInsights(c.slug, c.status, c.difficulty)
      return {
        ...c,
        strategy: {
          ...insights,
          maturity: c.status as any
        }
      }
    })
  }, [initialConcepts])

  // Filtered concepts based on CTO Focus Area selection
  const filteredConcepts = useMemo(() => {
    return concepts.filter(c => {
      const slug = c.slug.toLowerCase()
      if (selectedFocus === 'cost') {
        return (
          slug.includes('prompt-caching') ||
          slug.includes('structured-outputs') ||
          slug.includes('small-language-models') ||
          slug.includes('mixture-of-experts') ||
          slug.includes('knowledge-distillation')
        )
      }
      if (selectedFocus === 'innovation') {
        return (
          slug.includes('large-reasoning-models') ||
          slug.includes('multimodal-ai') ||
          slug.includes('agentic-coding') ||
          slug.includes('rag-2-0')
        )
      }
      if (selectedFocus === 'operations') {
        return (
          slug.includes('loop-engineering') ||
          slug.includes('model-context-protocol') ||
          slug.includes('agentic-commerce') ||
          slug.includes('function-calling')
        )
      }
      return true
    })
  }, [concepts, selectedFocus])

  // Aggregate executive metrics
  const ctoBulletins = useMemo(() => {
    return concepts.filter(c => c.strategy.bulletin).slice(0, 4)
  }, [concepts])

  // Handle Add/Remove comparison
  const toggleCompare = (id: string) => {
    if (selectedCompare.includes(id)) {
      setSelectedCompare(selectedCompare.filter(x => x !== id))
    } else {
      if (selectedCompare.length >= 3) return
      setSelectedCompare([...selectedCompare, id])
    }
  }

  const comparisonItems = useMemo(() => {
    return concepts.filter(c => selectedCompare.includes(c.id))
  }, [concepts, selectedCompare])

  // Generate Custom Roadmap
  const handleGenerateRoadmap = () => {
    // Custom recommendation logic based on form selection
    let phase1: StrategicConcept[] = []
    let phase2: StrategicConcept[] = []
    let phase3: StrategicConcept[] = []
    let justification = ''

    const getConcept = (slugPart: string) => concepts.find(c => c.slug.toLowerCase().includes(slugPart))

    if (goal === 'velocity') {
      phase1 = [getConcept('prompt-caching'), getConcept('structured-outputs')].filter(Boolean) as any
      phase2 = [getConcept('model-context-protocol'), getConcept('small-language-models')].filter(Boolean) as any
      phase3 = [getConcept('agentic-coding'), getConcept('loop-engineering')].filter(Boolean) as any
      justification = 'Your focus is developer velocity. We recommend immediate automation of repetitive code syntax and standardized interface tools, followed by autonomous agent sandboxes.'
    } else if (goal === 'operations') {
      phase1 = [getConcept('function-calling'), getConcept('vector-database')].filter(Boolean) as any
      phase2 = [getConcept('retrieval-augmented-generation'), getConcept('model-context-protocol')].filter(Boolean) as any
      phase3 = [getConcept('agentic-commerce'), getConcept('loop-engineering')].filter(Boolean) as any
      justification = 'Your focus is business automation. Setting up robust API tool parameters and retrieval backbones will unlock seamless B2B transactions and agent supervision loops.'
    } else if (goal === 'customer') {
      phase1 = [getConcept('structured-outputs'), getConcept('vector-database')].filter(Boolean) as any
      phase2 = [getConcept('retrieval-augmented-generation'), getConcept('multimodal-ai')].filter(Boolean) as any
      phase3 = [getConcept('large-reasoning-models'), getConcept('rag-2-0')].filter(Boolean) as any
      justification = 'Your focus is customer success. Transitioning from basic text vector search to native multimodal models and reasoned thinking guarantees highly accurate and safe customer resolutions.'
    } else {
      // search
      phase1 = [getConcept('vector-database'), getConcept('prompt-caching')].filter(Boolean) as any
      phase2 = [getConcept('retrieval-augmented-generation'), getConcept('generative-engine-optimization')].filter(Boolean) as any
      phase3 = [getConcept('rag-2-0'), getConcept('large-reasoning-models')].filter(Boolean) as any
      justification = 'Your focus is unified knowledge search. Optimize infrastructure indexes and cost margins first, then optimize web layout crawls, followed by end-to-end multimodal search.'
    }

    // Customize based on readiness
    if (readiness === 'crawl') {
      justification += ' Given your early stage of AI readiness, we recommend starting with managed, serverless endpoints (e.g. OpenAI/Anthropic SaaS) before attempting localized SLM hosting.'
    } else if (readiness === 'run') {
      justification += ' With your advanced AI capabilities, consider hosting distilled open-weights SLMs locally and customizing reinforcement-learning chains for reasoning models in Phase 2.'
    }

    setGeneratedRoadmap({
      industry: industry.toUpperCase(),
      goalText: goal === 'velocity' ? 'Developer Velocity' : goal === 'operations' ? 'Operations Automation' : goal === 'customer' ? 'Cognitive Customer Success' : 'Unified Knowledge Search',
      justification,
      phases: [
        {
          title: 'Phase 1: Foundational Framework (0–3 Months)',
          objective: 'Eliminate structural latency, validate data parsing, and control API token consumption boundaries.',
          concepts: phase1,
          cta: 'Action Item: Conduct architecture review of current system prompts and enforce strict schema validations.'
        },
        {
          title: 'Phase 2: Cognitive Integrations (3–6 Months)',
          objective: 'Standardize APIs on open-source routing protocols and wire retrieval repositories.',
          concepts: phase2,
          cta: 'Action Item: Deploy a pilot RAG instance using open vector standards; align context size limits.'
        },
        {
          title: 'Phase 3: Autonomous Orchestration (6–12 Months)',
          objective: 'Empower agentic execution loops and B2B pricing algorithms within strict sandbox security gates.',
          concepts: phase3,
          cta: 'Action Item: Establish sandboxed container registries for agent runs and configure spend limiters.'
        }
      ]
    })
    setWizardStep(2)
  }

  // Strategic Grid Cells (3x3 Matrix Coordinates)
  // X axis: Maturity (emerging, growing, stable)
  // Y axis: Impact (disruptive, core, supporting)
  const matrixCells = [
    { y: 'disruptive', x: 'emerging', label: 'Proactive R&D / Sandboxing', color: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)', badge: '🔬 Explore' },
    { y: 'disruptive', x: 'growing', label: 'Pilot Adoption', color: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.15)', badge: '🧪 Pilot' },
    { y: 'disruptive', x: 'stable', label: 'Mainstream Disruption', color: 'rgba(63,166,107,0.04)', borderColor: 'rgba(63,166,107,0.15)', badge: '🔥 Leverage' },
    
    { y: 'core', x: 'emerging', label: 'Monitor & Evaluate', color: 'rgba(138,134,125,0.04)', borderColor: 'rgba(138,134,125,0.1)', badge: '👁️ Observe' },
    { y: 'core', x: 'growing', label: 'Deploy & Optimize', color: 'rgba(212,175,55,0.04)', borderColor: 'rgba(212,175,55,0.15)', badge: '🚀 Integrate' },
    { y: 'core', x: 'stable', label: 'Core Infrastructure', color: 'rgba(63,166,107,0.04)', borderColor: 'rgba(63,166,107,0.15)', badge: '🏛️ Core' },
    
    { y: 'supporting', x: 'emerging', label: 'Long-term Tracking', color: 'rgba(138,134,125,0.02)', borderColor: 'rgba(138,134,125,0.05)', badge: '🕒 Track' },
    { y: 'supporting', x: 'growing', label: 'Build Competencies', color: 'rgba(138,134,125,0.04)', borderColor: 'rgba(138,134,125,0.1)', badge: '📚 Study' },
    { y: 'supporting', x: 'stable', label: 'Commoditized Utilities', color: 'rgba(63,166,107,0.04)', borderColor: 'rgba(63,166,107,0.15)', badge: '⚙️ Adopt' },
  ]

  const getCellConcepts = (y: string, x: string) => {
    return filteredConcepts.filter(c => c.strategy.strategicImpact === y && c.strategy.maturity === x)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      
      {/* 1. Header Banner */}
      <div style={{ marginBottom: '48px', position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, 
          textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', 
          background: 'var(--accent-dim)', padding: '5px 12px', borderRadius: '20px', 
          marginBottom: '16px', fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-border)',
        }}>
          <Cpu size={12} />
          <span>CTO Executive Suite</span>
        </div>
        <h1 className="gradient-text" style={{ 
          fontSize: 'clamp(34px, 5vw, 48px)', fontWeight: 900, marginBottom: '14px', 
          letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' 
        }}>
          CTO AI Strategy Board
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '17px', maxWidth: '720px', lineHeight: 1.65 }}>
          Cut through the machine learning noise. Evaluate the enterprise readiness, financial overhead, and integration complexities of AI paradigms. Design an evidence-backed adoption strategy.
        </p>
      </div>

      {/* 2. Executive Bulletins (Quick architecture insights) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px', marginBottom: '40px'
      }}>
        {ctoBulletins.map(bulletin => (
          <div key={bulletin.id} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', transition: 'border-color 0.2s',
          }} className="bulletin-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                  Architectural Directive
                </span>
                <span style={{
                  fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
                  background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)'
                }}>{bulletin.abbreviation || 'SPEC'}</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{bulletin.name}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>{bulletin.strategy.bulletin}</p>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <span 
                onClick={() => setExpandedConcept(bulletin)}
                style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              >
                <span>Review Specs</span>
                <ChevronRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{ 
        display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '32px', 
        gap: '16px', overflowX: 'auto', paddingBottom: '1px'
      }}>
        <button
          onClick={() => setActiveTab('matrix')}
          style={{
            background: 'none', border: 'none', padding: '12px 16px',
            color: activeTab === 'matrix' ? 'var(--text)' : 'var(--text-3)',
            borderBottom: `2px solid ${activeTab === 'matrix' ? 'var(--accent)' : 'transparent'}`,
            fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Layers size={16} />
          <span>Strategic AI Portfolio Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          style={{
            background: 'none', border: 'none', padding: '12px 16px',
            color: activeTab === 'compare' ? 'var(--text)' : 'var(--text-3)',
            borderBottom: `2px solid ${activeTab === 'compare' ? 'var(--accent)' : 'transparent'}`,
            fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Activity size={16} />
          <span>Executive Tech Comparison ({selectedCompare.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('signals')}
          style={{
            background: 'none', border: 'none', padding: '12px 16px',
            color: activeTab === 'signals' ? 'var(--text)' : 'var(--text-3)',
            borderBottom: `2px solid ${activeTab === 'signals' ? 'var(--accent)' : 'transparent'}`,
            fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>Research & Industry Signals</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          style={{
            background: 'none', border: 'none', padding: '12px 16px',
            color: activeTab === 'roadmap' ? 'var(--text)' : 'var(--text-3)',
            borderBottom: `2px solid ${activeTab === 'roadmap' ? 'var(--accent)' : 'transparent'}`,
            fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Compass size={16} />
          <span>Interactive Roadmap Wizard</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      <div style={{ minHeight: '400px' }}>
        
        {/* ==================== 1. MATRIX TAB ==================== */}
        {activeTab === 'matrix' && (
          <div>
            {/* Matrix Filters */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
              alignItems: 'center', gap: '16px', background: 'var(--bg-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              padding: '16px 24px', marginBottom: '32px'
            }}>
              <div>
                <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text)' }}>Toggle Strategy Focus View</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Isolate critical concepts serving specific organizational objectives.</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Concepts', icon: '🌐' },
                  { id: 'cost', label: 'Cost Efficiency & ROI', icon: '💸' },
                  { id: 'innovation', label: 'Product Innovation', icon: '🚀' },
                  { id: 'operations', label: 'Operations Automation', icon: '⚙️' }
                ].map(focus => (
                  <button
                    key={focus.id}
                    onClick={() => setSelectedFocus(focus.id as any)}
                    style={{
                      padding: '8px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600,
                      border: `1px solid ${selectedFocus === focus.id ? 'var(--accent-border)' : 'var(--border)'}`,
                      background: selectedFocus === focus.id ? 'var(--accent-dim)' : 'var(--bg-3)',
                      color: selectedFocus === focus.id ? 'var(--accent)' : 'var(--text-2)',
                      cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <span>{focus.icon}</span>
                    <span>{focus.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* The 3x3 Grid Matrix Layout */}
            <div className="matrix-wrapper" style={{ position: 'relative', overflowX: 'auto' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr',
                gap: '12px', minWidth: '900px', marginBottom: '24px'
              }}>
                {/* Column Headers */}
                <div></div>
                <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '2px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--emerging)' }}>Emerging</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Early R&D / Dynamic shifts</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '2px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--growing)' }}>Growing</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Production rise / Proven efficacy</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0', borderBottom: '2px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--stable)' }}>Stable / Mature</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Mainstream utility / Commodity</div>
                </div>

                {/* Grid Rows */}
                {/* Row 1: Disruptive */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid var(--border)', paddingRight: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--danger)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>
                    Disruptive
                  </span>
                </div>
                {/* Disruptive + Emerging */}
                <MatrixCell cell={matrixCells[0]} items={getCellConcepts('disruptive', 'emerging')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
                {/* Disruptive + Growing */}
                <MatrixCell cell={matrixCells[1]} items={getCellConcepts('disruptive', 'growing')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
                {/* Disruptive + Stable */}
                <MatrixCell cell={matrixCells[2]} items={getCellConcepts('disruptive', 'stable')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />

                {/* Row 2: Core */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid var(--border)', paddingRight: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--accent)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>
                    Core / High-Value
                  </span>
                </div>
                {/* Core + Emerging */}
                <MatrixCell cell={matrixCells[3]} items={getCellConcepts('core', 'emerging')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
                {/* Core + Growing */}
                <MatrixCell cell={matrixCells[4]} items={getCellConcepts('core', 'growing')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
                {/* Core + Stable */}
                <MatrixCell cell={matrixCells[5]} items={getCellConcepts('core', 'stable')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />

                {/* Row 3: Supporting */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid var(--border)', paddingRight: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', textAlign: 'center' }}>
                    Supporting
                  </span>
                </div>
                {/* Supporting + Emerging */}
                <MatrixCell cell={matrixCells[6]} items={getCellConcepts('supporting', 'emerging')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
                {/* Supporting + Growing */}
                <MatrixCell cell={matrixCells[7]} items={getCellConcepts('supporting', 'growing')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
                {/* Supporting + Stable */}
                <MatrixCell cell={matrixCells[8]} items={getCellConcepts('supporting', 'stable')} onSelect={setExpandedConcept} onCompare={toggleCompare} selectedCompare={selectedCompare} />
              </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '13px', fontStyle: 'italic', marginTop: '16px' }}>
              * Click the specs sheet icon on any concept card to view executive analysis or the plus (+) icon to add it to the Comparison list.
            </div>
          </div>
        )}

        {/* ==================== 2. COMPARE TAB ==================== */}
        {activeTab === 'compare' && (
          <div>
            {/* Quick Helper if less than 2 items are selected */}
            {selectedCompare.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '64px 24px', background: 'var(--bg-2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-2)'
              }}>
                <Activity size={40} style={{ color: 'var(--text-3)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>No technologies selected for comparison</h3>
                <p style={{ maxWidth: '480px', margin: '0 auto', fontSize: '14.5px', color: 'var(--text-3)' }}>
                  Go back to the **Strategic Portfolio Matrix** tab and click the plus (+) icon on the cards to load up to 3 concepts side-by-side.
                </p>
                <button
                  onClick={() => setActiveTab('matrix')}
                  style={{
                    marginTop: '20px', background: 'var(--accent)', color: 'var(--bg-1)',
                    border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13.5px',
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Return to Portfolio Grid
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifySelf: 'flex-end', marginBottom: '16px' }}>
                  <button
                    onClick={() => setSelectedCompare([])}
                    style={{
                      background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)',
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Trash size={13} />
                    <span>Clear Comparison ({selectedCompare.length})</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%', borderCollapse: 'collapse', background: 'var(--bg-2)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)', minWidth: '800px'
                  }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '16px', borderBottom: '2px solid var(--border)', textAlign: 'left', width: '220px', color: 'var(--text-3)', fontSize: '13px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Metric</th>
                        {comparisonItems.map(item => (
                          <th key={item.id} style={{ padding: '16px', borderBottom: '2px solid var(--border)', textAlign: 'left', width: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div>
                                <h4 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text)' }}>{item.name}</h4>
                                <span style={{ fontSize: '10.5px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{item.abbreviation || 'CONCEPT'}</span>
                              </div>
                              <button
                                onClick={() => toggleCompare(item.id)}
                                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                              >
                                <X size={15} />
                              </button>
                            </div>
                          </th>
                        ))}
                        {/* Fill remaining slots to maintain layout shape if < 3 */}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => (
                          <th key={`empty-${idx}`} style={{ padding: '16px', borderBottom: '2px solid var(--border)', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
                              <span>Empty Comparative Slot</span>
                              <span style={{ fontSize: '11px', textDecoration: 'underline', cursor: 'pointer', color: 'var(--accent)', marginTop: '4px' }} onClick={() => setActiveTab('matrix')}>Add Concept</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 1. strategicImpact */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Strategic Impact</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase',
                              background: item.strategy.strategicImpact === 'disruptive' ? 'rgba(239, 68, 68, 0.08)' : item.strategy.strategicImpact === 'core' ? 'rgba(212, 175, 55, 0.08)' : 'rgba(138, 134, 125, 0.08)',
                              color: item.strategy.strategicImpact === 'disruptive' ? 'var(--danger)' : item.strategy.strategicImpact === 'core' ? 'var(--accent)' : 'var(--text-3)',
                              border: `1px solid ${item.strategy.strategicImpact === 'disruptive' ? 'rgba(239, 68, 68, 0.2)' : item.strategy.strategicImpact === 'core' ? 'var(--accent-border)' : 'rgba(138, 134, 125, 0.2)'}`
                            }}>
                              {item.strategy.strategicImpact}
                            </span>
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 2. maturity */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Maturity Status</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px' }}>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase',
                              background: item.strategy.maturity === 'emerging' ? 'rgba(46, 139, 87, 0.08)' : item.strategy.maturity === 'growing' ? 'rgba(63, 166, 107, 0.08)' : 'rgba(212, 175, 55, 0.08)',
                              color: item.strategy.maturity === 'emerging' ? 'var(--emerging)' : item.strategy.maturity === 'growing' ? 'var(--growing)' : 'var(--accent)',
                              border: `1px solid ${item.strategy.maturity === 'emerging' ? 'rgba(46,139,87,0.2)' : item.strategy.maturity === 'growing' ? 'rgba(63,166,107,0.2)' : 'var(--accent-border)'}`
                            }}>
                              {item.strategy.maturity}
                            </span>
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 3. complexity */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Implementation Difficulty</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500 }}>
                            {item.strategy.complexity}
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 4. readiness */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Enterprise Readiness</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500 }}>
                            {item.strategy.readiness}
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 5. cost */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Resource & API Cost</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <DollarSign size={14} style={{ color: 'var(--accent)' }} />
                              <span>{item.strategy.cost}</span>
                            </div>
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 6. timeToValue */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Time to Value</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500 }}>
                            {item.strategy.timeToValue}
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* Maturity Score */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Maturity Score</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                            {item.strategy.maturityScore}/100
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* Governance Risk Level */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>GRC Risk Level</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700 }}>
                            <span style={{
                              padding: '3px 8px', borderRadius: '4px',
                              background: item.strategy.governanceRelevance.riskLevel === 'CRITICAL' || item.strategy.governanceRelevance.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.1)' : 'rgba(212,175,55,0.1)',
                              color: item.strategy.governanceRelevance.riskLevel === 'CRITICAL' || item.strategy.governanceRelevance.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--accent)',
                              border: `1px solid ${item.strategy.governanceRelevance.riskLevel === 'CRITICAL' || item.strategy.governanceRelevance.riskLevel === 'HIGH' ? 'rgba(239,68,68,0.2)' : 'rgba(212,175,55,0.2)'}`
                            }}>
                              {item.strategy.governanceRelevance.riskLevel}
                            </span>
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* GRC Compliance Impact */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Compliance Impact</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                            {item.strategy.governanceRelevance.complianceImpact}
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 7. risks */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>Strategic Security Risks</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                              <ShieldAlert size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                              <span>{item.strategy.risks}</span>
                            </div>
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>

                      {/* 8. recommendation */}
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-2)', fontSize: '13.5px' }}>CTO Action Item</td>
                        {comparisonItems.map(item => (
                          <td key={item.id} style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text)', fontWeight: 500, lineHeight: 1.5 }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                              <Zap size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                              <span>{item.strategy.recommendation}</span>
                            </div>
                          </td>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - comparisonItems.length) }).map((_, idx) => <td key={`empty-td-${idx}`} style={{ background: 'rgba(0,0,0,0.02)' }} />)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SIGNALS TAB ==================== */}
        {activeTab === 'signals' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Weekly Research & Industry Signals</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '14px' }}>Chronological updates of real developments with official source citations.</p>
            </div>
            
            {!initialEntries || initialEntries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <span style={{ fontSize: '32px' }}>📬</span>
                <p style={{ color: 'var(--text-3)', marginTop: '12px', fontSize: '14px' }}>No weekly signals populated yet. The database pipeline will stream entries shortly.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {initialEntries.map(entry => {
                  const matchingConcept = concepts.find(c => c.id === entry.concept_id)
                  
                  return (
                    <div key={entry.id} style={{
                      background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                      padding: '24px', transition: 'border-color 0.2s'
                    }} className="signal-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '9px', fontWeight: 700, padding: '2px 8px',
                            background: 'var(--accent-dim)', color: 'var(--accent)',
                            border: '1px solid var(--accent-border)', borderRadius: '4px',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {entry.entry_type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                            Week of {new Date(entry.week_of).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        {matchingConcept && (
                          <Link href={`/concepts/${matchingConcept.slug}`} style={{ textDecoration: 'none' }}>
                            <span className={`pill pill-${matchingConcept.status}`} style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
                              {matchingConcept.name}
                            </span>
                          </Link>
                        )}
                      </div>
                      
                      <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '16px' }}>
                        {entry.summary}
                      </p>

                      {/* Display Concept Sources as citations */}
                      {matchingConcept && matchingConcept.sources && matchingConcept.sources.length > 0 && (
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>Citations & References:</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {matchingConcept.sources.map(src => (
                              <a key={src.id} href={src.url} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px'
                              }}>
                                <span>🔗</span>
                                <span style={{ textDecoration: 'underline' }}>{src.title || src.url}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. ROADMAP TAB ==================== */}
        {activeTab === 'roadmap' && (
          <div>
            {wizardStep === 1 ? (
              <div style={{
                maxWidth: '640px', margin: '0 auto', background: 'var(--bg-2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '36px'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <Sparkles size={36} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>AI Strategy Roadmap Generator</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-3)' }}>Input your constraints to compile a custom phased adoption plan.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Q1: Industry */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>1. Industry Vertical</label>
                    <select
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      style={{
                        width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
                        color: 'var(--text)', padding: '10px 14px', borderRadius: '8px', outline: 'none'
                      }}
                    >
                      <option value="saas">Software as a Service (SaaS)</option>
                      <option value="fintech">FinTech / Automated Trading</option>
                      <option value="healthcare">Healthcare & Life Sciences</option>
                      <option value="ecommerce">E-Commerce & Logistics</option>
                      <option value="edtech">EdTech & Adaptive Learning</option>
                    </select>
                  </div>

                  {/* Q2: Capability */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>2. AI Capabilities & Readiness</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                      {[
                        { id: 'crawl', label: 'Crawl Stage', desc: 'No ML talent, basic LLM wrappers.' },
                        { id: 'walk', label: 'Walk Stage', desc: 'Active developers using APIs/VectorDBs.' },
                        { id: 'run', label: 'Run Stage', desc: 'Fine-tuning models and custom agents.' }
                      ].map(option => (
                        <div
                          key={option.id}
                          onClick={() => setReadiness(option.id)}
                          style={{
                            background: readiness === option.id ? 'var(--accent-dim)' : 'var(--bg-3)',
                            border: `1px solid ${readiness === option.id ? 'var(--accent-border)' : 'var(--border)'}`,
                            borderRadius: '8px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: readiness === option.id ? 'var(--accent)' : 'var(--text)' }}>{option.label}</span>
                            {readiness === option.id && <Check size={14} style={{ color: 'var(--accent)' }} />}
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.4 }}>{option.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Q3: Primary Strategic Goal */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>3. Core Strategic Objective</label>
                    <select
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      style={{
                        width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
                        color: 'var(--text)', padding: '10px 14px', borderRadius: '8px', outline: 'none'
                      }}
                    >
                      <option value="velocity">Accelerate Developer/Engineering Velocity</option>
                      <option value="operations">Automate Corporate Operations & Workflows</option>
                      <option value="customer">Create Cognitive Self-Service Customer Support</option>
                      <option value="search">Build Consolidated Cross-Database Enterprise Search</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleGenerateRoadmap}
                    style={{
                      width: '100%', background: 'var(--accent)', color: 'var(--bg-1)',
                      border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14.5px',
                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px', marginTop: '12px'
                    }}
                  >
                    <span>Generate Actionable Roadmap</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                {/* Back button */}
                <button
                  onClick={() => setWizardStep(1)}
                  style={{
                    background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)',
                    padding: '8px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px'
                  }}
                >
                  <RefreshCw size={14} />
                  <span>Configure New Strategy</span>
                </button>

                {/* Roadmap Content */}
                <div style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '32px', marginBottom: '40px'
                }}>
                  {/* Ribbon header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--accent-border)' }}>
                        {generatedRoadmap.industry} Roadmap
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px', color: 'var(--text)' }}>
                        Target: {generatedRoadmap.goalText}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Timeline Horizon</span>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>12 Months</div>
                    </div>
                  </div>

                  {/* Strategic Justification Alert */}
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.04)', borderLeft: '4px solid var(--accent)',
                    padding: '16px', borderRadius: '4px', marginBottom: '32px', fontSize: '14px',
                    color: 'var(--text-2)', lineHeight: 1.6
                  }}>
                    <strong style={{ color: 'var(--text)' }}>CTO Alignment Rationale:</strong> {generatedRoadmap.justification}
                  </div>

                  {/* Phased Lineage Flow */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', position: 'relative' }}>
                    {/* Vertical connecting line */}
                    <div style={{
                      position: 'absolute', left: '16px', top: '10px', bottom: '10px',
                      width: '2px', background: 'var(--border)', zIndex: 0
                    }} />

                    {generatedRoadmap.phases.map((phase: any, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}>
                        {/* Number Node */}
                        <div style={{
                          width: '34px', height: '34px', borderRadius: '50%', background: 'var(--bg-3)',
                          border: '2px solid var(--accent)', color: 'var(--text)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                          fontSize: '14px', flexShrink: 0
                        }}>
                          {index + 1}
                        </div>

                        {/* Phase Content */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>{phase.title}</h4>
                          <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '16px', lineHeight: 1.5 }}>{phase.objective}</p>

                          {/* Concepts tags in Phase */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                            {phase.concepts.map((concept: any) => (
                              <div
                                key={concept.id}
                                style={{
                                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                                  borderRadius: '8px', padding: '12px', width: 'calc(50% - 6px)',
                                  minWidth: '240px', display: 'flex', flexDirection: 'column',
                                  justifyContent: 'space-between', cursor: 'pointer'
                                }}
                                onClick={() => setExpandedConcept(concept)}
                              >
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{concept.name}</span>
                                    <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '4px', background: 'var(--bg-4)', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{concept.abbreviation || 'API'}</span>
                                  </div>
                                  <p style={{ fontSize: '11.5px', color: 'var(--text-2)', lineHeight: 1.4 }}>{concept.tldr}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                                  <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Complexity: <strong style={{ color: 'var(--text)' }}>{concept.strategy.complexity}</strong></span>
                                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <span>Details</span>
                                    <ChevronRight size={10} />
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Phase CTA Alert */}
                          <div style={{
                            background: 'var(--bg-3)', border: '1px solid var(--border)',
                            padding: '12px 16px', borderRadius: '6px', fontSize: '12.5px',
                            color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '8px'
                          }}>
                            <Check size={14} style={{ color: 'var(--success)' }} />
                            <span>{phase.cta}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ==================== SPECS OVERLAY MODAL ==================== */}
      <AnimatePresence>
        {expandedConcept && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                width: '100%', maxWidth: '640px', background: 'var(--bg-2)',
                border: '1px solid var(--accent-border)', borderRadius: 'var(--radius)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px', background: 'var(--bg-3)',
                borderBottom: '1px solid var(--border)', display: 'flex',
                justifyContent: 'space-between', alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px',
                      background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)',
                      fontFamily: 'var(--font-mono)'
                    }}>{expandedConcept.abbreviation || 'AI Concept'}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Maturity: {expandedConcept.strategy.maturity}</span>
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-heading)' }}>
                    {expandedConcept.name}
                  </h3>
                </div>
                <button
                  onClick={() => setExpandedConcept(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
                {/* TLDR */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: '6px' }}>Summary Definition</h4>
                  <p style={{ fontSize: '14.5px', color: 'var(--text)', lineHeight: 1.55 }}>{expandedConcept.tldr}</p>
                </div>

                {/* Strategic Metrics Grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px', padding: '16px', background: 'var(--bg-3)',
                  border: '1px solid var(--border)', borderRadius: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Strategic Impact</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', textTransform: 'capitalize' }}>{expandedConcept.strategy.strategicImpact}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Implementation Difficulty</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{expandedConcept.strategy.complexity}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Enterprise Readiness</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{expandedConcept.strategy.readiness}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Resource Overhead</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{expandedConcept.strategy.cost}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Time to Value</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{expandedConcept.strategy.timeToValue}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Expected ROI Horizon</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{expandedConcept.strategy.roiHorizon}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>Maturity Assessment</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>{expandedConcept.strategy.maturityScore}/100</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>GRC Risk Level</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: expandedConcept.strategy.governanceRelevance.riskLevel === 'CRITICAL' || expandedConcept.strategy.governanceRelevance.riskLevel === 'HIGH' ? 'var(--danger)' : 'var(--accent)' }}>
                      {expandedConcept.strategy.governanceRelevance.riskLevel}
                    </div>
                  </div>
                </div>

                {/* GRC Implications */}
                <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.12)', borderRadius: '6px', padding: '14px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--danger)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={12} />
                    <span>Governance & Compliance Hook</span>
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.4, marginBottom: '8px' }}>
                    <strong>Impact:</strong> {expandedConcept.strategy.governanceRelevance.complianceImpact}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.4, margin: 0 }}>
                    <strong>Guideline:</strong> {expandedConcept.strategy.governanceRelevance.oversightGuideline}
                  </p>
                </div>

                {/* Risks */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--danger)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={13} />
                    <span>Security & Operational Risks</span>
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-2)', lineHeight: 1.5 }}>{expandedConcept.strategy.risks}</p>
                </div>

                {/* Actionable recommendations */}
                <div style={{
                  padding: '16px', background: 'rgba(212, 175, 55, 0.04)',
                  borderLeft: '4px solid var(--accent)', borderRadius: '4px'
                }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: '6px' }}>CTO Strategic Recommendation</h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 500, lineHeight: 1.5 }}>{expandedConcept.strategy.recommendation}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px', background: 'var(--bg-3)',
                borderTop: '1px solid var(--border)', display: 'flex',
                justifyContent: 'flex-end', gap: '10px'
              }}>
                <button
                  onClick={() => {
                    toggleCompare(expandedConcept.id)
                    setExpandedConcept(null)
                  }}
                  style={{
                    background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)',
                    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  {selectedCompare.includes(expandedConcept.id) ? <X size={14} /> : <Plus size={14} />}
                  <span>{selectedCompare.includes(expandedConcept.id) ? 'Remove Compare' : 'Add to Compare'}</span>
                </button>
                <Link href={`/concepts/${expandedConcept.slug}`} onClick={() => setExpandedConcept(null)}>
                  <button style={{
                    background: 'var(--accent)', color: 'var(--bg-1)', border: 'none',
                    padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <BookOpen size={14} />
                    <span>Deep Technical Specs</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .bulletin-card:hover {
          border-color: var(--accent-border) !important;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.03);
        }
        @media (max-width: 768px) {
          .matrix-wrapper {
            margin-right: -24px;
            margin-left: -24px;
            padding-right: 24px;
            padding-left: 24px;
          }
        }
      `}</style>

    </div>
  )
}

/* ==================== SUB-COMPONENTS ==================== */

interface MatrixCellProps {
  cell: {
    y: string
    x: string
    label: string
    color: string
    borderColor: string
    badge: string
  }
  items: StrategicConcept[]
  onSelect: (item: StrategicConcept) => void
  onCompare: (id: string) => void
  selectedCompare: string[]
}

function MatrixCell({ cell, items, onSelect, onCompare, selectedCompare }: MatrixCellProps) {
  return (
    <div style={{
      background: cell.color, border: `1px solid ${cell.borderColor}`,
      borderRadius: '8px', padding: '16px', minHeight: '160px',
      display: 'flex', flexDirection: 'column', gap: '10px'
    }}>
      {/* Cell Heading Badge */}
      <div style={{ display: 'flex', justifySelf: 'flex-start', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{
          fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)', color: 'var(--text-2)'
        }}>
          {cell.badge}
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Concepts inside cell */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)', borderRadius: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontStyle: 'italic' }}>No technologies</span>
          </div>
        ) : (
          items.map(item => {
            const isComparing = selectedCompare.includes(item.id)
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: '6px', padding: '8px 10px', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s',
                }}
                className="matrix-concept-card"
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      onClick={() => onSelect(item)}
                      style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                    {item.abbreviation || 'Concept'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                  {/* Plus/Check for Comparison */}
                  <button
                    onClick={() => onCompare(item.id)}
                    style={{
                      background: isComparing ? 'var(--accent-dim)' : 'none',
                      border: `1px solid ${isComparing ? 'var(--accent-border)' : 'var(--border)'}`,
                      color: isComparing ? 'var(--accent)' : 'var(--text-3)',
                      width: '20px', height: '20px', borderRadius: '4px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0
                    }}
                    title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    {isComparing ? <Check size={11} /> : <Plus size={11} />}
                  </button>

                  {/* Specs sheet click */}
                  <button
                    onClick={() => onSelect(item)}
                    style={{
                      background: 'none', border: '1px solid var(--border)',
                      color: 'var(--text-3)', width: '20px', height: '20px',
                      borderRadius: '4px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', padding: 0
                    }}
                    title="View executive specs"
                  >
                    <BookOpen size={11} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <style>{`
        .matrix-concept-card:hover {
          border-color: var(--accent-border) !important;
          background: var(--bg-3) !important;
        }
      `}</style>
    </div>
  )
}
