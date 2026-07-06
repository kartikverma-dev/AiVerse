'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Concept } from '@/types';
import { statusConfig } from '@/hooks/useConceptStatus';
import { Check, X, ShieldAlert, Award, Compass, Heart } from 'lucide-react';

interface ConceptComparisonProps {
  conceptA: Concept;
  conceptB: Concept;
  className?: string;
}

// Dedicated comparison details library for core concepts
interface DetailEntry {
  pros: string[];
  cons: string[];
  bestFor: string[];
}

const CONCEPT_DETAILS: Record<string, DetailEntry> = {
  'retrieval-augmented-generation': {
    pros: ['Accesses external databases for live information', 'Drastically reduces LLM hallucination', 'Easily updated without retraining'],
    cons: ['Introduces retrieval latency', 'Requires complex vector indexing infrastructure', 'Query success depends on search retrieval accuracy'],
    bestFor: ['Enterprise search systems', 'Customer service chatbots', 'Dynamic knowledge databases']
  },
  'prompt-engineering': {
    pros: ['No programming skills required', 'Instant evaluation and testing', 'Compatible with all out-of-the-box foundation models'],
    cons: ['Highly sensitive to model updates', 'Limited capability for complex reasoning tasks', 'High manual overhead for testing/tuning'],
    bestFor: ['Simple text transformations', 'Chatbot persona alignment', 'Quick validation spikes']
  },
  'chain-of-thought-prompting': {
    pros: ['Improves reasoning on logical/mathematical tasks', 'Offers debuggable step-by-step traces', 'Zero-shot triggers are easy to implement'],
    cons: ['Increases input/output token usage', 'Can result in circular reasoning errors', 'Slightly higher generation latency'],
    bestFor: ['Complex math/logic solvers', 'System planning flows', 'Multi-step decision logic']
  },
  'agentic-coding': {
    pros: ['Automates complete programming cycles', 'Self-heals and corrects compilation errors', 'Drastically speeds up boilerplate generation'],
    cons: ['High API cost from repetitive runs', 'Risk of infinite execution loops', 'Demands isolated runtimes (sandboxes)'],
    bestFor: ['Autonomous code generation', 'Self-correcting build systems', 'Automated bug-fixing tools']
  },
  'vibe-coding': {
    pros: ['Ultra-fast rapid prototyping', 'Highly conversational flow', 'Extremely low barrier to entry'],
    cons: ['Accumulates immediate technical debt', 'Hard to refactor or locate deep logic bugs', 'Creates dependency on AI correctness'],
    bestFor: ['Hackathon projects', 'Indie-hacker MVPs', 'Small-scale web utilities']
  },
  'loop-engineering': {
    pros: ['Shifts developer focus to high-level goals', 'High predictability through constraint limits', 'Iterates systematically based on automated tests'],
    cons: ['Complex config of loop conditions', 'Highly dependent on high-quality test specs', 'Requires advanced agentic toolkits'],
    bestFor: ['Industrial autonomous development', 'SLA-driven system building', 'Agent pipeline management']
  },
  'large-reasoning-models': {
    pros: ['Built-in System-2 thinking capabilities', 'Autonomous planning and self-correction', 'High logic consistency on deep coding tasks'],
    cons: ['Considerable delay before first token output', 'Extreme API resource/cost overhead', 'Difficult to steer via traditional prompting'],
    bestFor: ['Advanced research assistants', 'Mathematical proofs', 'Security audits & code synthesis']
  }
};

/**
 * Fallback generator for concepts not in our explicit dictionary
 */
function getConceptComparisonDetails(concept: Concept): DetailEntry {
  if (CONCEPT_DETAILS[concept.slug]) {
    return CONCEPT_DETAILS[concept.slug];
  }
  
  // Deterministic fallbacks using concept metadata
  const hash = concept.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const categories = concept.categories.length > 0 ? concept.categories : ['General AI'];
  
  const pros = [
    `Streamlines workflows related to ${categories[0]}`,
    `Leverages modern ${concept.difficulty}-level AI paradigms`,
    `Backed by ${concept.status} lifecycle support mechanisms`
  ];
  
  const cons = [
    `Requires understanding of ${concept.difficulty} techniques`,
    `Tied to performance constraints in ${categories[0]}`,
    hash % 2 === 0 
      ? 'Requires strict integration guidelines' 
      : 'API structures are subject to frequent shifts'
  ];
  
  const bestFor = [
    `${categories[0]} tasks`,
    `${concept.difficulty} developers`,
    `Projects demanding ${concept.status} paradigms`
  ];
  
  return { pros, cons, bestFor };
}

/**
 * Animated Side-by-Side Metric Bar Component
 */
const MetricBar: React.FC<{
  label: string;
  valA: number;
  valB: number;
  colorA: string;
  colorB: string;
}> = ({ label, valA, valB, colorA, colorB }) => {
  return (
    <div className="flex flex-col gap-2 py-3.5 border-b border-white/5">
      <div className="flex justify-between text-xs font-mono text-neutral-400">
        <span className="font-semibold" style={{ color: colorA }}>{valA}%</span>
        <span className="font-medium uppercase tracking-wider text-paper-cream">{label}</span>
        <span className="font-semibold" style={{ color: colorB }}>{valB}%</span>
      </div>
      <div className="grid grid-cols-2 gap-4 h-2">
        {/* Left concept bar (Right-aligned fill) */}
        <div className="bg-white/[0.03] rounded-full overflow-hidden flex justify-end">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colorA }}
            initial={{ width: 0 }}
            animate={{ width: `${valA}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.15 }}
          />
        </div>
        {/* Right concept bar (Left-aligned fill) */}
        <div className="bg-white/[0.03] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colorB }}
            initial={{ width: 0 }}
            animate={{ width: `${valB}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.15 }}
          />
        </div>
      </div>
    </div>
  );
};

export const ConceptComparison: React.FC<ConceptComparisonProps> = ({ 
  conceptA, 
  conceptB, 
  className = "" 
}) => {
  const detailsA = useMemo(() => getConceptComparisonDetails(conceptA), [conceptA]);
  const detailsB = useMemo(() => getConceptComparisonDetails(conceptB), [conceptB]);

  const configA = statusConfig[conceptA.status];
  const configB = statusConfig[conceptB.status];

  // Derive metrics deterministically
  const metricsA = useMemo(() => {
    const statusMap = { emerging: 35, growing: 65, stable: 90, declining: 45, historical: 20 };
    const maturityMap = { emerging: 25, growing: 55, stable: 95, declining: 75, historical: 99 };
    const hash = conceptA.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      adoption: statusMap[conceptA.status] || 50,
      maturity: maturityMap[conceptA.status] || 50,
      community: Math.min(100, Math.floor((hash % 10) * 8 + 25))
    };
  }, [conceptA]);

  const metricsB = useMemo(() => {
    const statusMap = { emerging: 35, growing: 65, stable: 90, declining: 45, historical: 20 };
    const maturityMap = { emerging: 25, growing: 55, stable: 95, declining: 75, historical: 99 };
    const hash = conceptB.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      adoption: statusMap[conceptB.status] || 50,
      maturity: maturityMap[conceptB.status] || 50,
      community: Math.min(100, Math.floor((hash % 10) * 8 + 25))
    };
  }, [conceptB]);

  // Verdict computation
  const verdictText = useMemo(() => {
    const yearA = parseInt(conceptA.first_appeared || '2025', 10);
    const yearB = parseInt(conceptB.first_appeared || '2025', 10);

    if (conceptA.status === 'historical' && conceptB.status !== 'historical') {
      return `${conceptA.name} is a legacy concept (coined in ${conceptA.first_appeared || 'unknown'}) that paved the way for modern paradigms. For new projects, the established and active ${conceptB.name} is the superior architectural choice.`;
    }
    if (conceptB.status === 'historical' && conceptA.status !== 'historical') {
      return `${conceptB.name} represents a foundational, older milestone. Modern software designs should deploy the active, high-priority ${conceptA.name} to maximize durability and integration support.`;
    }

    if (conceptA.status === 'stable' && conceptB.status === 'emerging') {
      return `${conceptA.name} is the standard benchmark with maximum stability and low integration risk, while ${conceptB.name} is a high-upside experimental breakthrough. Opt for ${conceptA.name} for core apps, but test ${conceptB.name} in pilot environments.`;
    }
    if (conceptB.status === 'stable' && conceptA.status === 'emerging') {
      return `${conceptB.name} serves as the secure, stable standard for production. ${conceptA.name} (first appearing in ${conceptA.first_appeared || '2025-2026'}) is a promising frontier paradigm that is worth learning but still carries high initial execution complexity.`;
    }

    if (yearA < yearB) {
      return `${conceptA.name} (coined in ${conceptA.first_appeared || 'unknown'}) is chronologically senior to ${conceptB.name} (${conceptB.first_appeared || 'unknown'}). While ${conceptA.name} is mature and deeply tested, ${conceptB.name} represents a newer iteration that adapts to recent developments.`;
    }
    if (yearB < yearA) {
      return `${conceptB.name} is the chronologically senior concept. ${conceptA.name} is a newer evolution designed to expand on or solve the bottlenecks observed in the legacy ${conceptB.name} paradigm.`;
    }

    return `Both ${conceptA.name} and ${conceptB.name} represent similar eras of AI evolution. The choice depends entirely on team familiarity: deploy ${conceptA.name} for projects focused on ${conceptA.categories.join(', ')}, and choose ${conceptB.name} for ${conceptB.categories.join(', ')}.`;
  }, [conceptA, conceptB]);

  return (
    <div className={`flex flex-col gap-6 w-full ${className}`}>
      
      {/* Side-by-Side Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Concept A Card */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">PARADIGM A</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono border" style={{ color: configA.color, borderColor: configA.borderColor, backgroundColor: configA.bgColor }}>
              {configA.label}
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-paper-cream mb-1">{conceptA.name}</h3>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">{conceptA.tldr}</p>
        </div>

        {/* Concept B Card */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">PARADIGM B</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono border" style={{ color: configB.color, borderColor: configB.borderColor, backgroundColor: configB.bgColor }}>
              {configB.label}
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-paper-cream mb-1">{conceptB.name}</h3>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">{conceptB.tldr}</p>
        </div>
      </div>

      {/* Comparative Animated Metric Bars */}
      <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
        <h4 className="text-xs font-semibold text-signal-gold uppercase tracking-widest font-mono text-center mb-4">
          Comparative Strength Metrics
        </h4>
        <div className="flex flex-col">
          <MetricBar 
            label="Production Adoption" 
            valA={metricsA.adoption} 
            valB={metricsB.adoption} 
            colorA={configA.color} 
            colorB={configB.color} 
          />
          <MetricBar 
            label="Theoretical Maturity" 
            valA={metricsA.maturity} 
            valB={metricsB.maturity} 
            colorA={configA.color} 
            colorB={configB.color} 
          />
          <MetricBar 
            label="Community Activity" 
            valA={metricsA.community} 
            valB={metricsB.community} 
            colorA={configA.color} 
            colorB={configB.color} 
          />
        </div>
      </div>

      {/* Pros & Cons Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Concept A Pros/Cons */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01]">
          <div className="flex items-center gap-1.5 mb-3.5 pb-2 border-b border-white/5">
            <Award className="w-4 h-4 text-signal-gold" />
            <h4 className="text-xs font-semibold text-paper-cream font-mono uppercase tracking-wider">{conceptA.name} Profile</h4>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider mb-2">Key Advantages</h5>
              <ul className="space-y-2">
                {detailsA.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 leading-normal">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-[10px] text-rose-400 uppercase font-mono tracking-wider mb-2">Trade-offs & Constraints</h5>
              <ul className="space-y-2">
                {detailsA.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 leading-normal">
                    <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider mb-2">Optimal Use Cases</h5>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {detailsA.bestFor.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-mono border border-white/10 rounded-full bg-white/[0.02] text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Concept B Pros/Cons */}
        <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01]">
          <div className="flex items-center gap-1.5 mb-3.5 pb-2 border-b border-white/5">
            <Award className="w-4 h-4 text-contrast-violet" />
            <h4 className="text-xs font-semibold text-paper-cream font-mono uppercase tracking-wider">{conceptB.name} Profile</h4>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider mb-2">Key Advantages</h5>
              <ul className="space-y-2">
                {detailsB.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 leading-normal">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-[10px] text-rose-400 uppercase font-mono tracking-wider mb-2">Trade-offs & Constraints</h5>
              <ul className="space-y-2">
                {detailsB.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 leading-normal">
                    <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider mb-2">Optimal Use Cases</h5>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {detailsB.bestFor.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-mono border border-white/10 rounded-full bg-white/[0.02] text-neutral-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Verdict Footer */}
      <div className="p-4 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.01] to-white/[0.03] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-signal-gold shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-mono text-signal-gold uppercase font-semibold tracking-wider">Evolutionary Verdict</span>
          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {verdictText}
          </p>
        </div>
      </div>

    </div>
  );
};

interface MiniConceptComparisonProps {
  currentConcept: Concept;
  relatedConcepts: Concept[];
  onSelectConcept: (slug: string) => void;
  className?: string;
}

/**
 * Mini comparison drawer or sidebar list item
 */
export const MiniConceptComparison: React.FC<MiniConceptComparisonProps> = ({
  currentConcept,
  relatedConcepts,
  onSelectConcept,
  className = ""
}) => {
  return (
    <div className={`p-4 rounded-xl border border-white/10 bg-white/[0.02] ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-signal-gold" />
        <h4 className="text-xs font-semibold text-paper-cream uppercase font-mono tracking-wider">
          Compare Paradigms
        </h4>
      </div>
      
      {relatedConcepts.length === 0 ? (
        <p className="text-xs text-neutral-500 italic">No alternative paradigms registered for comparison.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {relatedConcepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => onSelectConcept(concept.slug)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-left hover:border-white/10 transition-all duration-200 group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-paper-cream group-hover:text-signal-gold transition-colors font-serif">
                  vs {concept.name}
                </span>
                <span className="text-[9px] text-neutral-500 font-mono">
                  {concept.first_appeared || 'unknown'} · {concept.status}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono border border-white/10 bg-white/[0.02] px-2 py-0.5 rounded group-hover:border-signal-gold/30 transition-colors">
                Battle ⚡
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
