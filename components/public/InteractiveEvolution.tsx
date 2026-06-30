'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Concept } from '@/types'

const CHAINS = [
  {
    id: 'prompting',
    title: '✍️ Prompting & Context',
    slugs: ['prompt-engineering', 'chain-of-thought-prompting', 'context-engineering'],
  },
  {
    id: 'agents',
    title: '🤖 Autonomous Agents',
    slugs: ['vibe-coding', 'agentic-coding', 'loop-engineering'],
  },
  {
    id: 'retrieval',
    title: '🔌 RAG & Connectivity',
    slugs: ['vector-database', 'retrieval-augmented-generation', 'model-context-protocol'],
  }
]

const statusEmoji: Record<string, string> = {
  emerging: '🌱',
  growing: '📈',
  stable: '✅',
  declining: '📉',
  historical: '📦',
}

export default function InteractiveEvolution({ concepts }: { concepts: Concept[] }) {
  const [activeChainId, setActiveChainId] = useState('prompting')
  const [selectedSlug, setSelectedSlug] = useState<string | null>('prompt-engineering')

  const activeChain = CHAINS.find(c => c.id === activeChainId) || CHAINS[0]
  
  // Find concepts for the active chain
  const chainConcepts = activeChain.slugs
    .map(slug => concepts.find(c => c.slug === slug))
    .filter((c): c is Concept => !!c)

  // Ensure we select a valid concept when the chain changes
  const activeConcept = concepts.find(c => c.slug === selectedSlug) || chainConcepts[0]

  const handleChainChange = (id: string) => {
    setActiveChainId(id)
    const targetChain = CHAINS.find(c => c.id === id)
    if (targetChain && targetChain.slugs.length > 0) {
      setSelectedSlug(targetChain.slugs[0])
    }
  }

  return (
    <div className="evolution-interactive-container">
      {/* Chain Tabs */}
      <div className="chain-tabs">
        {CHAINS.map(c => (
          <button
            key={c.id}
            onClick={() => handleChainChange(c.id)}
            className={`chain-tab-btn ${activeChainId === c.id ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            {activeChainId === c.id && (
              <motion.div
                layoutId="activeTabGlow"
                className="active-tab-glow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 2 }}>{c.title}</span>
          </button>
        ))}
      </div>

      <div className="evolution-split-layout">
        {/* Visual Lineage Flow */}
        <div className="lineage-flow-panel">
          <div className="flow-nodes-wrapper">
            <AnimatePresence mode="popLayout">
              {chainConcepts.map((concept, index) => {
                const isSelected = activeConcept?.slug === concept.slug
                return (
                  <motion.div
                    key={concept.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="flow-step-container"
                  >
                    <div
                      onClick={() => setSelectedSlug(concept.slug)}
                      className={`flow-node-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="node-status-indicator" style={{ background: `var(--${concept.status})` }} />
                      <span className="node-name">{concept.name}</span>
                      <span className="node-year">{concept.first_appeared || 'N/A'}</span>
                    </div>
                    {index < chainConcepts.length - 1 && (
                      <div className="flow-connector">
                        <div className="connector-line" />
                        <div className="connector-arrow">↓</div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Concept Preview Panel */}
        <div className="concept-preview-panel">
          <AnimatePresence mode="wait">
            {activeConcept ? (
              <motion.div
                key={activeConcept.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="preview-card-body"
              >
                <div className="preview-card-header">
                  <div className="header-meta">
                    <span className={`pill pill-${activeConcept.status}`}>
                      {statusEmoji[activeConcept.status]} {activeConcept.status}
                    </span>
                    <span className={`pill pill-${activeConcept.difficulty}`}>
                      {activeConcept.difficulty}
                    </span>
                  </div>
                  <h3 className="preview-title">
                    {activeConcept.name}
                    {activeConcept.abbreviation && (
                      <span className="preview-abbr"> ({activeConcept.abbreviation})</span>
                    )}
                  </h3>
                </div>

                <p className="preview-tldr">{activeConcept.tldr}</p>

                <div className="preview-definitions">
                  <div className="def-section">
                    <h4 className="def-title">Beginner Analogy</h4>
                    <p className="def-text">{activeConcept.definition_beginner}</p>
                  </div>
                  <div className="def-section">
                    <h4 className="def-title">Technical Deep Dive</h4>
                    <p className="def-text">{activeConcept.definition_technical}</p>
                  </div>
                </div>

                <div className="preview-footer">
                  <Link href={`/concepts/${activeConcept.slug}`} className="view-full-btn">
                    View Full Details, Citations & Trends →
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="empty-preview"
              >
                <p>Select a concept from the flow to view its details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .evolution-interactive-container {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px;
          margin-top: 40px;
          width: 100%;
          max-width: 900px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .chain-tabs {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .chain-tab-btn {
          padding: 8px 18px;
          border-radius: 20px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-2);
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: all 0.25s var(--easing);
          overflow: hidden;
        }
        .chain-tab-btn:hover {
          border-color: var(--accent);
          color: var(--text);
        }
        .chain-tab-btn.active {
          color: var(--accent);
          border-color: var(--accent);
        }
        .active-tab-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--accent-dim);
          border-radius: 20px;
          z-index: 1;
        }
        .evolution-split-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .evolution-split-layout {
            grid-template-columns: 1fr;
          }
        }
        .lineage-flow-panel {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px 0;
        }
        .flow-nodes-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .flow-step-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .flow-node-card {
          width: 100%;
          background: var(--bg-3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          transition: all 0.25s var(--easing);
        }
        .flow-node-card:hover {
          border-color: var(--border-strong);
          transform: translateY(-2px);
          background: var(--bg-4);
        }
        .flow-node-card.selected {
          border-color: var(--accent);
          background: var(--bg-4);
          box-shadow: 0 4px 20px var(--accent-dim);
        }
        .node-status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .node-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .node-year {
          font-size: 11px;
          color: var(--text-3);
          font-weight: 500;
          font-family: var(--font-mono);
        }
        .flow-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 32px;
          justify-content: center;
          margin: 4px 0;
        }
        .connector-line {
          width: 2px;
          height: 16px;
          background: var(--border);
        }
        .connector-arrow {
          font-size: 12px;
          color: var(--text-3);
          line-height: 1;
          font-family: var(--font-mono);
        }
        .concept-preview-panel {
          background: var(--bg-3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px;
          min-height: 380px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .preview-card-body {
          display: flex;
          flex-direction: column;
          height: 100%;
          flex: 1;
        }
        .preview-card-header {
          border-bottom: 1px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .header-meta {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          font-family: var(--font-mono);
        }
        .preview-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          font-family: var(--font-heading);
          line-height: 1.2;
        }
        .preview-abbr {
          font-weight: 400;
          color: var(--text-3);
          font-size: 18px;
          font-family: var(--font-mono);
        }
        .preview-tldr {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-2);
          margin-bottom: 24px;
        }
        .preview-definitions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
          margin-bottom: 24px;
        }
        .def-section {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 16px;
        }
        .def-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 6px;
          font-family: var(--font-mono);
        }
        .def-text {
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-2);
        }
        .preview-footer {
          margin-top: auto;
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }
        .view-full-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 12px;
          background: var(--accent);
          color: var(--bg-1);
          text-decoration: none;
          font-weight: 600;
          font-size: 13.5px;
          border-radius: var(--radius);
          transition: background 0.25s var(--easing);
        }
        .view-full-btn:hover {
          background: var(--accent-soft);
        }
        .empty-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-3);
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
