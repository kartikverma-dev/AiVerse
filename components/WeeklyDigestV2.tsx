'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DigestEntry } from '@/types';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { ConceptLifecycleBadge } from './ConceptLifecycle';
import { AnimatedStat } from './AnimatedStat';
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  TrendingUp, 
  Activity,
  PlusCircle
} from 'lucide-react';

interface WeeklyDigestV2Props {
  entries: DigestEntry[];
  className?: string;
}

/**
 * Status change parsing helper
 */
interface ParsedChange {
  name: string;
  oldStatus: 'emerging' | 'growing' | 'stable' | 'declining' | 'historical';
  newStatus: 'emerging' | 'growing' | 'stable' | 'declining' | 'historical';
}

function parseStatusDetails(summary: string): ParsedChange {
  const clean = summary.toLowerCase();
  
  if (clean.includes('rag')) {
    return { name: 'RAG', oldStatus: 'growing', newStatus: 'stable' };
  }
  if (clean.includes('reasoning') || clean.includes('lrms')) {
    return { name: 'LRMs', oldStatus: 'emerging', newStatus: 'growing' };
  }
  if (clean.includes('prompt')) {
    return { name: 'Prompt Engineering', oldStatus: 'stable', newStatus: 'historical' };
  }
  if (clean.includes('vibe')) {
    return { name: 'Vibe Coding', oldStatus: 'growing', newStatus: 'stable' };
  }

  // Fallbacks
  let oldStatus: any = 'growing';
  let newStatus: any = 'stable';

  if (clean.includes('stable')) { newStatus = 'stable'; oldStatus = 'growing'; }
  else if (clean.includes('growing')) { newStatus = 'growing'; oldStatus = 'emerging'; }
  else if (clean.includes('historical')) { newStatus = 'historical'; oldStatus = 'declining'; }
  else if (clean.includes('declining')) { newStatus = 'declining'; oldStatus = 'stable'; }
  else if (clean.includes('emerging')) { newStatus = 'emerging'; oldStatus = 'growing'; }

  return { name: 'Concept Upgrade', oldStatus, newStatus };
}

export const WeeklyDigestV2: React.FC<WeeklyDigestV2Props> = ({ entries = [], className = "" }) => {
  
  // Calculate statistics from the actual entries list (Auto-generated from state changes)
  const stats = useMemo(() => {
    let newConcepts = 0;
    let statusChanges = 0;
    let papers = 0;
    let releases = 0;

    entries.forEach(e => {
      switch (e.entry_type) {
        case 'new_concept':
          newConcepts++;
          break;
        case 'status_change':
          statusChanges++;
          break;
        case 'notable_paper':
          papers++;
          break;
        case 'framework_release':
          releases++;
          break;
      }
    });

    return { newConcepts, statusChanges, papers, releases };
  }, [entries]);

  if (entries.length === 0) {
    return <WeeklyDigestEmpty />;
  }

  // Get impact level based on entry type
  const getImpactBadge = (type: string) => {
    switch (type) {
      case 'new_concept':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded border border-rose-500/20 bg-rose-500/5 text-rose-400">HIGH IMPACT</span>;
      case 'status_change':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded border border-rose-500/20 bg-rose-500/5 text-rose-400">HIGH IMPACT</span>;
      case 'notable_paper':
        return <span className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded border border-signal-gold/20 bg-signal-gold/5 text-signal-gold">MEDIUM IMPACT</span>;
      case 'framework_release':
      default:
        return <span className="px-2 py-0.5 text-[9px] font-mono font-semibold rounded border border-white/10 bg-white/5 text-neutral-400">LOW IMPACT</span>;
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'new_concept':
        return <PlusCircle className="w-4 h-4 text-emerald-400" />;
      case 'status_change':
        return <Activity className="w-4 h-4 text-rose-400" />;
      case 'notable_paper':
        return <BookOpen className="w-4 h-4 text-signal-gold" />;
      case 'framework_release':
      default:
        return <Cpu className="w-4 h-4 text-contrast-violet" />;
    }
  };

  const getEntryLabel = (type: string) => {
    switch (type) {
      case 'new_concept': return 'New Concept Cataloged';
      case 'status_change': return 'State Maturity Migration';
      case 'notable_paper': return 'Key Academic Release';
      case 'framework_release': return 'Framework Deployment';
      default: return 'Ecosystem Shift';
    }
  };

  return (
    <div className={`w-full flex flex-col gap-8 ${className}`}>
      
      {/* Dynamic Statistics summary strip using count-up indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mb-1">New Concepts</span>
          <div className="text-2xl font-serif text-paper-cream font-semibold">
            +<AnimatedStat value={stats.newConcepts} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mb-1">Status Shifts</span>
          <div className="text-2xl font-serif text-paper-cream font-semibold">
            <AnimatedStat value={stats.statusChanges} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mb-1">Key Research Papers</span>
          <div className="text-2xl font-serif text-paper-cream font-semibold">
            <AnimatedStat value={stats.papers} />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mb-1">Major Releases</span>
          <div className="text-2xl font-serif text-paper-cream font-semibold">
            <AnimatedStat value={stats.releases} />
          </div>
        </div>

      </div>

      {/* Timeline Section */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative pl-7 md:pl-10 flex flex-col gap-8"
      >
        
        {/* Gold spine timeline guideline */}
        <div 
          className="absolute left-[7px] md:left-[9px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-signal-gold via-contrast-violet to-white/5 rounded-full"
        />

        {entries.map((entry, idx) => {
          const parsed = entry.entry_type === 'status_change' ? parseStatusDetails(entry.summary) : null;
          
          return (
            <motion.div 
              key={entry.id || idx}
              variants={fadeInUp}
              className="relative group"
            >
              
              {/* Violet marker bullet */}
              <div 
                className="absolute -left-[27px] md:-left-[35px] top-[7px] w-3 h-3 rounded-full border-2 border-contrast-violet bg-ink-navy group-hover:scale-125 transition-transform duration-200 z-10"
              />

              {/* Entry Card */}
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.02] transition-all duration-300">
                
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2">
                    {getEntryIcon(entry.entry_type)}
                    <span className="text-xs font-mono font-semibold text-paper-cream">
                      {getEntryLabel(entry.entry_type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getImpactBadge(entry.entry_type)}
                    <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{entry.week_of}</span>
                    </div>
                  </div>
                </div>

                {/* Animated status change display (old status -> new status with arrow) */}
                {entry.entry_type === 'status_change' && parsed ? (
                  <div className="mb-3.5 p-3 rounded-lg border border-white/5 bg-white/[0.01] flex flex-wrap items-center gap-3">
                    <span className="text-xs font-serif font-semibold text-paper-cream">{parsed.name}</span>
                    
                    <div className="flex items-center gap-2">
                      <ConceptLifecycleBadge status={parsed.oldStatus} />
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                      </motion.div>
                      <ConceptLifecycleBadge status={parsed.newStatus} />
                    </div>
                  </div>
                ) : null}

                {/* Summary Text */}
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {entry.summary}
                </p>

                {entry.concept && (
                  <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-mono">Linked Concept: {entry.concept.name}</span>
                    <a 
                      href={`/concepts/${entry.concept.slug}`}
                      className="text-[10px] text-signal-gold font-mono flex items-center gap-1 hover:underline"
                    >
                      Read full definition <span>→</span>
                    </a>
                  </div>
                )}

              </div>
            </motion.div>
          );
        })}

      </motion.div>

    </div>
  );
};

/**
 * WeeklyDigestEmpty state placeholder
 */
export const WeeklyDigestEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-white/10 bg-white/[0.02] w-full max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
        <Sparkles className="w-5 h-5 text-neutral-500" />
      </div>
      <h4 className="text-base font-semibold font-serif text-paper-cream mb-2">No weekly digests logged</h4>
      <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
        The database doesn't have digest changes registered for the current period. Once concept graph updates are committed, they will appear here.
      </p>
    </div>
  );
};
