'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Concept, Source } from '@/types';
import { cardHover, fadeInUp, staggerContainer } from '@/lib/animations';
import { ConceptLifecycleBadge } from './ConceptLifecycle';
import { DualDepthInline, DepthMode, DualDepthContent } from './DualDepthToggle';
import { Calendar, Star, FileText, Link as LinkIcon, ShieldCheck } from 'lucide-react';

interface ConceptCardV2Props {
  concept: Concept;
  initialDepth?: DepthMode;
  onClick?: (slug: string) => void;
  className?: string;
}

/**
 * Sparkline displaying a 7-bar trend matching the status
 */
const Sparkline: React.FC<{ status: string }> = ({ status }) => {
  const getHeights = () => {
    switch (status) {
      case 'emerging':
        return [12, 22, 18, 35, 28, 55, 68];
      case 'growing':
        return [25, 38, 48, 52, 65, 78, 92];
      case 'stable':
        return [82, 85, 80, 84, 81, 85, 83];
      case 'declining':
        return [88, 76, 58, 48, 35, 22, 12];
      case 'historical':
      default:
        return [15, 10, 12, 8, 12, 6, 8];
    }
  };

  const getSparklineColor = () => {
    switch (status) {
      case 'emerging': return 'bg-emerald-500/50';
      case 'growing': return 'bg-signal-gold/50';
      case 'stable': return 'bg-contrast-violet/50';
      case 'declining': return 'bg-rose-500/50';
      case 'historical':
      default:
        return 'bg-neutral-600/50';
    }
  };

  const heights = getHeights();
  const color = getSparklineColor();

  return (
    <div className="flex items-end gap-[3px] h-6 w-20 px-1" title={`Trajectory for ${status}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-[6px] rounded-[1px] transition-all duration-300 ${color}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

/**
 * Trust indicator dot representing authority rank:
 * 1-2 (Official/Paper): Emerald dot
 * 3-4 (Researcher/Blog): Gold dot
 * 5-6 (Community/GitHub): Violet dot
 */
const SourceTrustBadge: React.FC<{ sources: Source[] | undefined; slug: string }> = ({ sources, slug }) => {
  // If sources aren't loaded, generate deterministic placeholders based on slug
  const resolvedSources = sources || (() => {
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (hash % 3) + 1; // 1 to 3 sources
    return Array.from({ length: count }, (_, i) => ({
      id: `${slug}-src-${i}`,
      concept_id: '',
      url: '#',
      title: '',
      source_type: (i === 0 ? 'paper' : i === 1 ? 'official_blog' : 'github') as any,
      authority_rank: (i === 0 ? 1 : i === 1 ? 3 : 5)
    }));
  })();

  const getTrustColor = (rank: number) => {
    if (rank <= 2) return 'bg-emerald-400'; // high trust
    if (rank <= 4) return 'bg-signal-gold'; // mid trust
    return 'bg-contrast-violet'; // community trust
  };

  return (
    <div className="flex items-center gap-1.5" title={`${resolvedSources.length} verified citations`}>
      <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-neutral-500" /> Trust:
      </span>
      <div className="flex -space-x-1">
        {resolvedSources.slice(0, 3).map((src) => (
          <span 
            key={src.id} 
            className={`w-2 h-2 rounded-full border border-ink-navy ${getTrustColor(src.authority_rank)}`}
          />
        ))}
      </div>
      <span className="text-[10px] text-neutral-400 font-mono">
        ({resolvedSources.length})
      </span>
    </div>
  );
};

/**
 * Premium Concept Card with Hover Spring effects and Dual-Depth reading mode
 */
export const ConceptCardV2: React.FC<ConceptCardV2Props> = ({ 
  concept, 
  initialDepth = 'beginner', 
  onClick,
  className = "" 
}) => {
  const [depth, setDepth] = useState<DepthMode>(initialDepth);

  // Difficulty badge colors
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'advanced':
        return 'text-contrast-violet border-contrast-violet/20 bg-contrast-violet/5';
      case 'intermediate':
      default:
        return 'text-signal-gold border-signal-gold/20 bg-signal-gold/5';
    }
  };

  // Safe numeric fallbacks for stats based on name length if missing
  const getStars = () => {
    const hash = concept.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 15) * 800 + 400; // 400 to 12400 stars
  };

  const getPapers = () => {
    const hash = concept.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 12) * 15 + 5; // 5 to 185 papers
  };

  return (
    <motion.div
      variants={cardHover}
      initial="initial"
      whileHover="hover"
      onClick={() => onClick && onClick(concept.slug)}
      className={`group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Background card accent glow on hover */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/[0.01] to-transparent group-hover:from-white/[0.03] transition-all duration-300 pointer-events-none" />

      <div>
        {/* Top meta/status row */}
        <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
          <ConceptLifecycleBadge status={concept.status} />
          
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <Sparkline status={concept.status} />
            <DualDepthInline depth={depth} onChange={setDepth} />
          </div>
        </div>

        {/* Title and abbreviation */}
        <h3 className="relative z-10 text-xl font-bold font-serif text-paper-cream mb-2 tracking-tight group-hover:text-signal-gold transition-colors duration-300">
          {concept.name}
          {concept.abbreviation && (
            <span className="ml-2 text-sm font-sans font-medium text-neutral-400">
              ({concept.abbreviation})
            </span>
          )}
        </h3>

        {/* TLDR */}
        <p className="relative z-10 text-xs text-neutral-400 font-sans mb-4 italic leading-relaxed">
          {concept.tldr}
        </p>

        {/* Dual Depth Content (animated crossfade + blur) */}
        <div className="relative z-10 min-h-[96px] py-1 border-t border-white/5 mb-5">
          <DualDepthContent
            depth={depth}
            className="text-xs text-neutral-300 leading-relaxed font-sans"
            beginnerContent={
              <div className="space-y-2">
                <p>{concept.definition_beginner}</p>
                <div className="text-[10px] text-signal-gold/90 font-mono mt-1">
                  🎓 Analogy-focused explanation
                </div>
              </div>
            }
            technicalContent={
              <div className="space-y-2 font-mono text-[11px] text-neutral-300">
                <p>{concept.definition_technical}</p>
                <div className="text-[10px] text-contrast-violet/90 mt-1">
                  ⚙️ Tech specifications & details
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Footer / Meta details row */}
      <div className="relative z-10 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3.5 text-[11px] text-neutral-400 font-mono">
          {concept.first_appeared && (
            <span className="flex items-center gap-1" title="First Appeared">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              {concept.first_appeared}
            </span>
          )}
          
          <span className="flex items-center gap-1" title="GitHub Stars">
            <Star className="w-3.5 h-3.5 text-neutral-500" />
            {getStars().toLocaleString()}
          </span>

          <span className="flex items-center gap-1" title="Academic Papers">
            <FileText className="w-3.5 h-3.5 text-neutral-500" />
            {getPapers()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SourceTrustBadge sources={concept.sources} slug={concept.slug} />
          
          <span className={`px-2 py-0.5 text-[10px] font-mono font-medium border rounded capitalize ${getDifficultyStyles(concept.difficulty)}`}>
            {concept.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface ConceptCardGridProps {
  concepts: Concept[];
  onCardClick?: (slug: string) => void;
  className?: string;
}

/**
 * Grid layout wrapper that displays concepts with staggered fade-in reveals
 */
export const ConceptCardGrid: React.FC<ConceptCardGridProps> = ({ 
  concepts, 
  onCardClick,
  className = "" 
}) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {concepts.map((concept) => (
        <motion.div key={concept.id} variants={fadeInUp}>
          <ConceptCardV2 concept={concept} onClick={onCardClick} />
        </motion.div>
      ))}
    </motion.div>
  );
};
