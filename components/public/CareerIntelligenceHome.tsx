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
  Building, 
  Briefcase, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  FileText,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingRight
} from 'lucide-react'
import type { Concept } from '@/types'

interface DigestItem {
  id?: string
  week_of: string
  entry_type: string
  summary: string
  concept?: { slug: string; name: string; status: string }
}

interface Props {
  latestConcepts: Concept[]
  recentDigestItems: DigestItem[]
  statusCounts: Record<string, number>
  statusColor: Record<string, string>
  statusEmoji: Record<string, string>
}

// Custom structure for personalized roadmaps
interface RoadmapStep {
  name: string
  slug: string
  time: string
  importance: 'Essential' | 'Recommended' | 'Bonus'
  reason: string
}

interface RoleRoadmap {
  title: string
  description: string
  careerFocus: string
  steps: RoadmapStep[]
}

const roleRoadmaps: Record<string, RoleRoadmap> = {
  'ai-engineer': {
    title: 'AI Engineering Specialist (RAG & APIs)',
    description: 'Focuses on integrating commercial models, building advanced retrieval, and operationalizing prompts.',
    careerFocus: 'Full-stack AI developer, RAG specialist, system integrator.',
    steps: [
      { name: 'RAG', slug: 'rag', time: '12 hours', importance: 'Essential', reason: 'Industry baseline expectations. Master hybrid indexing and dense retrievers.' },
      { name: 'Structured Outputs', slug: 'structured-outputs', time: '4 hours', importance: 'Essential', reason: 'Guarantees valid JSON returns for frontend/DB controllers.' },
      { name: 'Prompt Caching', slug: 'prompt-caching', time: '3 hours', importance: 'Recommended', reason: 'Massive cost-efficiency builder. Highly asked in architecture designs.' },
      { name: 'RAG 2.0', slug: 'rag-2-0', time: '15 hours', importance: 'Bonus', reason: 'Prepares you for multimodal PDF ingestion pipelines.' }
    ]
  },
  'agent-architect': {
    title: 'Agentic Systems Architect',
    description: 'Focuses on building autonomous, self-correcting agent loops and multi-agent coordination engines.',
    careerFocus: 'Agent builder, Workflow engineer, autonomous software developer.',
    steps: [
      { name: 'Loop Engineering', slug: 'loop-engineering', time: '18 hours', importance: 'Essential', reason: 'Learn stateful retries, verification layers, and automated code testing loops.' },
      { name: 'Model Context Protocol', slug: 'model-context-protocol', time: '8 hours', importance: 'Essential', reason: 'The standard protocol for linking agents to desktop apps and databases.' },
      { name: 'Large Reasoning Models', slug: 'large-reasoning-models', time: '12 hours', importance: 'Recommended', reason: 'Structure prompts to exploit System 2 o1/R1 reasoning loops.' },
      { name: 'Agentic Commerce', slug: 'agentic-commerce', time: '16 hours', importance: 'Bonus', reason: 'Prepare for agents handling real money, wallets, and negotiations.' }
    ]
  },
  'ml-scientist': {
    title: 'Core ML Research Scientist',
    description: 'Focuses on model training, fine-tuning, alignment algorithms, and custom architecture designs.',
    careerFocus: 'LLM training scientist, fine-tuning engineer, AI alignment researcher.',
    steps: [
      { name: 'Large Reasoning Models', slug: 'large-reasoning-models', time: '20 hours', importance: 'Essential', reason: 'Understand reinforcement learning scaling laws and tree search at test-time.' },
      { name: 'BitNet', slug: 'bitnet', time: '16 hours', importance: 'Recommended', reason: 'Analyze 1-bit quantization math and weight multipliers.' },
      { name: 'Constitutional AI', slug: 'constitutional-ai', time: '12 hours', importance: 'Recommended', reason: 'Master rule-based alignment to replace thousands of human RLHF annotators.' },
      { name: 'State Space Models', slug: 'state-space-models', time: '18 hours', importance: 'Bonus', reason: 'Study non-transformer architectures (Mamba) for linear-time long sequences.' }
    ]
  },
  'ai-pm': {
    title: 'Technical AI Product Manager',
    description: 'Focuses on choosing the right model size, cost optimization, and auditing AI capabilities against user value.',
    careerFocus: 'Product owner, business analyst, AI consultant.',
    steps: [
      { name: 'Small Language Models', slug: 'small-language-models', time: '6 hours', importance: 'Essential', reason: 'Understand when to run sub-10B local edge models to zero out API bills.' },
      { name: 'Generative Engine Optimization', slug: 'generative-engine-optimization', time: '8 hours', importance: 'Recommended', reason: 'Understand how AI engines summarize web content to drive organic traffic.' },
      { name: 'Guardrails', slug: 'guardrails', time: '5 hours', importance: 'Recommended', reason: 'Mitigate company brand risks, toxic outputs, and jailbreak attempts.' }
    ]
  }
}

export default function CareerIntelligenceHome({
  latestConcepts,
  recentDigestItems,
  statusCounts,
  statusColor,
  statusEmoji
}: Props) {
  const [activeTab, setActiveTab] = useState<'radar' | 'roadmap' | 'tech' | 'research' | 'career' | 'future'>('radar')
  const [selectedRole, setSelectedRole] = useState<string>('ai-engineer')

  // Tab definitions
  const tabs = [
    { id: 'radar', label: '🔍 AI Skill Radar', desc: 'Trending value scores' },
    { id: 'roadmap', label: '📚 Personalized Roadmap', desc: 'Custom study path' },
    { id: 'tech', label: '🧠 AI Tech Radar', desc: 'Maturity transitions' },
    { id: 'research', label: '📰 AI Research Feed', desc: 'Ecosystem spike logs' },
    { id: 'career', label: '🚀 Career Intel', desc: 'Skills employers want' },
    { id: 'future', label: '📈 Future Skills Score', desc: '5-year projections' }
  ]

  // Mock score card previews for Skill Radar Preview tab
  const radarPreview = [
    {
      name: 'Model Context Protocol (MCP)',
      slug: 'model-context-protocol',
      trend: 97,
      adoption: 'Medium',
      demand: 'High',
      relevance: 9.6,
      time: '6–10 hours',
      prerequisites: 'TypeScript, APIs'
    },
    {
      name: 'Large Reasoning Models (LRMs)',
      slug: 'large-reasoning-models',
      trend: 98,
      adoption: 'High',
      demand: 'Very High',
      relevance: 9.9,
      time: '10–14 hours',
      prerequisites: 'Prompt Design, APIs'
    },
    {
      name: 'Agentic Coding',
      slug: 'agentic-coding',
      trend: 96,
      adoption: 'High',
      demand: 'Very High',
      relevance: 9.7,
      time: '16–24 hours',
      prerequisites: 'Python, LLM Agents'
    }
  ]

  // Mock Career statistics showing what skills employers are recruiting for
  const careerStats = [
    { skill: 'Agentic Loop orchestration (LangGraph, AutoGen)', weight: 'Critical Demand', salaryMultiplier: '+24%', interviews: 'Multi-agent supervisor design patterns' },
    { skill: 'Structured parsing & validation (Pydantic, JSON Schema)', weight: 'Essential Baseline', salaryMultiplier: '+12%', interviews: 'Guarantees of state machines adherence' },
    { skill: 'Prompt caching & cost design', weight: 'High Demand', salaryMultiplier: '+15%', interviews: 'Billing reduction calculations & context boundaries' },
    { skill: 'Hybrid RAG & Vector Index tuning', weight: 'High Demand', salaryMultiplier: '+18%', interviews: 'HNSW configuration & recall vs precision tradeoffs' }
  ]

  // Future Skills score calculations (5 Year bets)
  const futureSkills = [
    { skill: 'State Space Models (SSMs/Mamba)', score: '9.4/10', outlook: 'Hyper-Growth', risk: 'Medium', desc: 'Transformer alternatives for linear context complexity.' },
    { skill: 'Generative Engine Optimization (GEO)', score: '8.8/10', outlook: 'Steady Rise', risk: 'High', desc: 'Replacing traditional SEO as scraper agents drive summaries.' },
    { skill: 'Mixture of Depths (MoD)', score: '9.1/10', outlook: 'Hyper-Growth', risk: 'Low', desc: 'Dynamic bypass of layers to maximize compute efficiency.' },
    { skill: 'BitNet (1-Bit LLMs)', score: '9.3/10', outlook: 'Steady Rise', risk: 'Medium', desc: 'Running inference without float multiplication on CPU edge.' }
  ]

  const totalConceptsCount = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1

  return (
    <section style={{
      maxWidth: '1180px', margin: '0 auto', padding: '90px 24px 100px',
      borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1,
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div style={{
          display: 'inline-block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--accent)', background: 'var(--accent-dim)',
          padding: '5px 12px', borderRadius: '20px', marginBottom: '14px',
          fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-border)',
        }}>
          Decision Engine
        </div>
        <h2 style={{
          fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700,
          fontFamily: 'var(--font-heading)', letterSpacing: '-0.025em', color: 'var(--text)',
          marginBottom: '12px'
        }}>
          AI Career Decision Engine
        </h2>
        <p style={{ color: 'var(--text-2)', fontSize: '15px', maxWidth: '540px', margin: '0 auto' }}>
          Evaluate the AI landscape using structured signals. Make evidence-backed decisions on what skills to master next.
        </p>
      </div>

      {/* Grid Layout: Tabs sidebar + Active Tab details */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="career-grid-layout">
        
        {/* Left Side: Tabs Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="career-tabs-sidebar">
          {tabs.map(tab => {
            const isTabActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: isTabActive ? 'var(--bg-3)' : 'var(--bg-2)',
                  border: `1px solid ${isTabActive ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', padding: '16px 20px', textAlign: 'left',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px',
                  transition: 'all 0.25s'
                }}
                className={`tab-btn-sidebar ${isTabActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: isTabActive ? 'var(--accent)' : 'var(--text)' }}>
                  {tab.label}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>
                  {tab.desc}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right Side: Tab Details Panel */}
        <div style={{ 
          background: 'var(--bg-2)', border: '1px solid var(--border)', 
          borderRadius: 'var(--radius)', padding: '32px', minHeight: '420px',
          display: 'flex', flexDirection: 'column'
        }} className="career-details-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              
              {/* ==================== TAB 1: SKILL RADAR ==================== */}
              {activeTab === 'radar' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '6px' }}>
                        🔍 AI Skill Radar
                      </h3>
                      <p style={{ color: 'var(--text-2)', fontSize: '13.5px', margin: 0 }}>
                        High-growth skills computed with dynamic Strategic Career Value ratings.
                      </p>
                    </div>
                    <Link href="/radar">
                      <button style={{
                        background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)',
                        padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }} className="explore-radar-btn">
                        <span>Full Skill Radar</span>
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    {radarPreview.map((item, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '15.5px' }}>{item.name}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', background: 'rgba(212, 175, 55, 0.08)', color: 'var(--accent)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px', fontFamily: 'var(--font-mono)' }}>
                            Trend: {item.trend}/100
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', fontSize: '11.5px' }}>
                          <div><span style={{ color: 'var(--text-3)' }}>🏢 Adoption:</span> <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{item.adoption}</span></div>
                          <div><span style={{ color: 'var(--text-3)' }}>💼 Job Demand:</span> <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{item.demand}</span></div>
                          <div><span style={{ color: 'var(--text-3)' }}>🔮 Relevance:</span> <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{item.relevance}/10</span></div>
                          <div><span style={{ color: 'var(--text-3)' }}>⏱ Est. Time:</span> <span style={{ fontWeight: 600, color: 'var(--text-2)' }}>{item.time}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== TAB 2: ROADMAPS ==================== */}
              {activeTab === 'roadmap' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '6px' }}>
                      📚 What Should I Study?
                    </h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '13.5px', margin: 0 }}>
                      Select your target role to build an evidence-based roadmap of AI technologies to learn.
                    </p>
                  </div>

                  {/* Role Selection Tabs inside panel */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    {[
                      { id: 'ai-engineer', label: 'AI Engineer' },
                      { id: 'agent-architect', label: 'Agent Architect' },
                      { id: 'ml-scientist', label: 'ML Researcher' },
                      { id: 'ai-pm', label: 'AI PM' }
                    ].map(role => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        style={{
                          background: selectedRole === role.id ? 'var(--accent-dim)' : 'transparent',
                          border: `1px solid ${selectedRole === role.id ? 'var(--accent-border)' : 'transparent'}`,
                          color: selectedRole === role.id ? 'var(--accent)' : 'var(--text-2)',
                          padding: '6px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>

                  {/* Roadmap details rendering */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                        {roleRoadmaps[selectedRole].title}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                        {roleRoadmaps[selectedRole].description}
                      </p>
                      <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                        Focus: <span style={{ color: 'var(--text-2)' }}>{roleRoadmaps[selectedRole].careerFocus}</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {roleRoadmaps[selectedRole].steps.map((step, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', gap: '12px', background: 'var(--bg-3)', 
                          border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px' 
                        }}>
                          <div style={{ 
                            width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-4)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '11px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' 
                          }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                              <Link href={`/concepts/${step.slug}`}>
                                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '13.5px', cursor: 'pointer', textDecoration: 'underline' }}>
                                  {step.name}
                                </span>
                              </Link>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <span style={{ fontSize: '10px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{step.time}</span>
                                <span style={{
                                  fontSize: '8px', fontWeight: 800, padding: '1px 5px',
                                  background: step.importance === 'Essential' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(212, 175, 55, 0.08)',
                                  color: step.importance === 'Essential' ? 'var(--danger)' : 'var(--accent)',
                                  border: `1px solid ${step.importance === 'Essential' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212, 175, 55, 0.15)'}`,
                                  borderRadius: '4px', fontFamily: 'var(--font-mono)'
                                }}>{step.importance}</span>
                              </div>
                            </div>
                            <p style={{ fontSize: '12.5px', color: 'var(--text-2)', margin: 0, lineHeight: 1.45 }}>
                              {step.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 3: TECH RADAR ==================== */}
              {activeTab === 'tech' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '6px' }}>
                        🧠 AI Technology Radar
                      </h3>
                      <p style={{ color: 'var(--text-2)', fontSize: '13.5px', margin: 0 }}>
                        Current distribution of technology maturity based on research metrics and star counts.
                      </p>
                    </div>
                    <Link href="/concepts">
                      <button style={{
                        background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)',
                        padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }} className="explore-radar-btn">
                        <span>Library Directory</span>
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '12px' }}>
                    {[
                      { status: 'stable', label: 'Stable', desc: 'Mainstream, low integration risk.' },
                      { status: 'growing', label: 'Growing', desc: 'High adoption velocity, robust tools.' },
                      { status: 'emerging', label: 'Emerging', desc: 'Breakthrough ideas, research phase.' },
                      { status: 'declining', label: 'Declining', desc: 'Superseded by newer architectures.' }
                    ].map(s => {
                      const count = statusCounts[s.status] || 0
                      const pct = Math.round((count / totalConceptsCount) * 100)
                      return (
                        <div key={s.status} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '14.5px' }}>{s.label}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: statusColor[s.status], fontFamily: 'var(--font-mono)' }}>
                              {pct}% ({count})
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0, lineHeight: 1.45 }}>{s.desc}</p>
                          
                          {/* Small relative percentage bar */}
                          <div style={{ height: '4px', background: 'var(--bg-4)', borderRadius: '2px', overflow: 'hidden', marginTop: '10px' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: statusColor[s.status] }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ==================== TAB 4: RESEARCH FEED ==================== */}
              {activeTab === 'research' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '6px' }}>
                        📰 AI Research Feed
                      </h3>
                      <p style={{ color: 'var(--text-2)', fontSize: '13.5px', margin: 0 }}>
                        Curated chronological shifts in the AI landscape. Sourced from recent academic journals and tool releases.
                      </p>
                    </div>
                    <Link href="/digest">
                      <button style={{
                        background: 'none', border: '1px solid var(--border)', color: 'var(--text-2)',
                        padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }} className="explore-radar-btn">
                        <span>Weekly Logs</span>
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }} className="home-activity-timeline">
                    {recentDigestItems.slice(0, 3).map((item, idx) => (
                      <div key={item.id || idx} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px' }} />
                          {idx < 2 && <div style={{ width: '1px', flex: 1, background: 'var(--border)', minHeight: '30px', margin: '4px 0' }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '10.5px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{item.week_of}</span>
                            <span style={{
                              fontSize: '8px', textTransform: 'uppercase', background: 'var(--bg-3)', border: '1px solid var(--border)',
                              color: 'var(--text-2)', padding: '0px 4px', borderRadius: '2px', fontWeight: 600, fontFamily: 'var(--font-mono)'
                            }}>{item.entry_type.replace('_', ' ')}</span>
                          </div>
                          <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-2)', margin: 0 }}>
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== TAB 5: CAREER INTEL ==================== */}
              {activeTab === 'career' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '6px' }}>
                      🚀 Career Intelligence
                    </h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '13.5px', margin: 0 }}>
                      Recruitment demand weightings and premium pay skills wanted in modern AI teams.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {careerStats.map((item, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '13.5px', display: 'block', marginBottom: '2px' }}>{item.skill}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Interview hook: {item.interviews}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', background: 'rgba(63, 166, 107, 0.08)', color: '#3FA66B', border: '1px solid rgba(63, 166, 107, 0.2)', borderRadius: '4px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                            {item.weight}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                            {item.salaryMultiplier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ==================== TAB 6: FUTURE SKILLS ==================== */}
              {activeTab === 'future' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text)', marginBottom: '6px' }}>
                      📈 Future Skills Score
                    </h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '13.5px', margin: 0 }}>
                      Five-year outlook projection and risk analysis of ignoring next-generation architectures.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '10px' }}>
                    {futureSkills.map((item, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.skill}>
                            {item.skill}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                            {item.score}
                          </span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: 'var(--text-2)', margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '4px', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border)', paddingTop: '6px' }}>
                          <div><span style={{ color: 'var(--text-3)' }}>Outlook:</span> <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{item.outlook}</span></div>
                          <div><span style={{ color: 'var(--text-3)' }}>Risk:</span> <span style={{ color: item.risk === 'High' ? 'var(--danger)' : 'var(--text-2)', fontWeight: 600 }}>{item.risk}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <style>{`
        .tab-btn-sidebar:hover {
          border-color: var(--accent-border) !important;
          background: var(--bg-3) !important;
        }
        .tab-btn-sidebar.active {
          box-shadow: 0 4px 14px rgba(212, 175, 55, 0.04);
        }
        @media (max-width: 800px) {
          .career-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .career-tabs-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
            scrollbar-width: none !important;
          }
          .career-tabs-sidebar::-webkit-scrollbar {
            display: none !important;
          }
          .tab-btn-sidebar {
            min-width: 180px !important;
            flex-shrink: 0 !important;
            padding: 10px 14px !important;
          }
          .career-details-panel {
            padding: 20px !important;
          }
        }
      `}</style>
    </section>
  )
}
