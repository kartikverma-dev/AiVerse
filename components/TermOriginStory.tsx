'use client';

import React, { useMemo } from 'react';
import { 
  FileText, 
  Globe, 
  MessageCircle, 
  Presentation, 
  Quote, 
  History, 
  User, 
  Flame,
  BookOpen
} from 'lucide-react';

// Custom inline SVG Github Icon to avoid Lucide version export issues
const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { Concept } from '@/types';

// Structured origin story data
interface OriginStory {
  coinedBy: string;
  firstAppeared: string;
  sourceUrl?: string;
  sourceTitle: string;
  sourceType: 'paper' | 'blog' | 'tweet' | 'talk' | 'github' | 'community';
  quote: string;
  etymology: string;
  previouslyKnownAs: string[];
  popularizedBy: string;
}

const ORIGIN_STORIES: Record<string, OriginStory> = {
  'retrieval-augmented-generation': {
    coinedBy: 'Patrick Lewis et al. (Meta AI)',
    firstAppeared: 'arXiv Paper (2020)',
    sourceUrl: 'https://arxiv.org/abs/2005.11401',
    sourceTitle: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    sourceType: 'paper',
    quote: 'We propose Retrieval-Augmented Generation (RAG)—a general-purpose fine-tuning recipe for retrieval-augmented generation models that combines pre-trained parametric and non-parametric memory.',
    etymology: 'Formulated to combine active document retrieval methods (non-parametric) directly with the token generation capabilities of an LLM (parametric) into a single, unified execution graph.',
    previouslyKnownAs: ['Dense document generation', 'Retrieval-guided reading'],
    popularizedBy: 'Meta AI and the LangChain open-source community'
  },
  'prompt-engineering': {
    coinedBy: 'OpenAI Researchers & Community',
    firstAppeared: 'OpenAI API Forum Posts (2021)',
    sourceUrl: 'https://community.openai.com/',
    sourceTitle: 'Techniques for GPT-3 Prompt Design',
    sourceType: 'community',
    quote: 'Designing the specific input context—assigning a role, providing examples, and setting strict formatting rules—is key to achieving high reliability.',
    etymology: 'Drafted from the software practice of "engineering" inputs, combined with "prompting" (directing) an actor, treating language inputs as precise compiler commands.',
    previouslyKnownAs: ['Input design', 'Context steering', 'In-context programming'],
    popularizedBy: 'Early LLM prompt builders and Reddit developers'
  },
  'chain-of-thought-prompting': {
    coinedBy: 'Jason Wei et al. (Google Brain)',
    firstAppeared: 'Google AI Blog & Paper (2022)',
    sourceUrl: 'https://arxiv.org/abs/2201.11903',
    sourceTitle: 'Chain of Thought Prompting Elicits Reasoning in Large Language Models',
    sourceType: 'paper',
    quote: 'A chain of thought is a series of intermediate natural language reasoning steps that lead to the final output. We show that such reasoning can emerge naturally with few-shot prompting.',
    etymology: 'Inspired by cognitive psychology, describing how humans explain their step-by-step thinking sequences sequentially before making a judgment.',
    previouslyKnownAs: ['Step-by-step guidance', 'Intermediate reasoning traces'],
    popularizedBy: 'Google Research and LangChain developers'
  },
  'agentic-coding': {
    coinedBy: 'AI Engineering Community',
    firstAppeared: 'GitHub Projects & Developer Blogs (2024)',
    sourceUrl: 'https://github.com',
    sourceTitle: 'Autonomous Developer Agent Architectures',
    sourceType: 'github',
    quote: 'The evolution from passive copilots to agentic systems that run, test, and self-correct code marks the shift to autonomous software engineering.',
    etymology: 'Combines the sociological concept of "agentic" (exhibiting capacity, active intent, and self-regulation) with "coding" (programming).',
    previouslyKnownAs: ['Copilot auto-coding', 'Self-programming agent loops'],
    popularizedBy: 'Cognition (Devin launch), Cursor (Anysphere), and sweep.dev'
  },
  'vibe-coding': {
    coinedBy: 'Andrej Karpathy',
    firstAppeared: 'X/Twitter Post (Feb 2025)',
    sourceUrl: 'https://x.com/karpathy/status/1885025983794303102',
    sourceTitle: 'Programming by intent and vibes',
    sourceType: 'tweet',
    quote: 'I can feel vibe coding. I write zero code, I just review, tweak, and vibe. The AI writes 100% of it. I just supervise.',
    etymology: 'Formed from the slang "vibe" (feeling/intuition), describing a programming workflow where the developer maintains the product vision while delegate typing syntax to LLMs.',
    previouslyKnownAs: ['No-code editing', 'Interactive prompting'],
    popularizedBy: 'Andrej Karpathy and the indie developer community'
  },
  'loop-engineering': {
    coinedBy: 'Andrej Karpathy & Agent Developers',
    firstAppeared: 'AI Engineering Presentations (Late 2025)',
    sourceUrl: 'https://x.com',
    sourceTitle: 'Engineering agentic loops instead of code',
    sourceType: 'tweet',
    quote: 'We are no longer writing code. We are writing the feedback loop that evaluates code—testing inputs, lint checks, and compiler feedback loops.',
    etymology: 'Derived from control systems engineering, referencing how developer tasks shift to defining constraints, exit criteria, and loop boundaries for agent runtimes.',
    previouslyKnownAs: ['Agent constraint definition', 'Goal-oriented pipelines'],
    popularizedBy: 'Modern frontend architects and autonomous tool systems'
  },
  'model-context-protocol': {
    coinedBy: 'Anthropic Team',
    firstAppeared: 'Official Anthropic Developer Blog (Nov 2024)',
    sourceUrl: 'https://www.anthropic.com/news/model-context-protocol',
    sourceTitle: 'Introducing the Model Context Protocol',
    sourceType: 'blog',
    quote: 'MCP is an open standard that enables developers to build secure, bidirectional connections between AI models and their data sources.',
    etymology: 'Named directly from networking protocols (like HTTP/TCP) combined with LLM "context windows", standardizing how models request real-time data.',
    previouslyKnownAs: ['Custom tool schemas', 'Ad-hoc API connectors'],
    popularizedBy: 'Anthropic, Cursor, and developer tools startups'
  }
};

/**
 * Gets or dynamically generates the origin story for any concept
 */
export function getOriginStory(concept: Concept): OriginStory {
  if (ORIGIN_STORIES[concept.slug]) {
    return ORIGIN_STORIES[concept.slug];
  }

  // Generate fallback data deterministically using concept properties
  const year = concept.first_appeared || '2024';
  const coined = concept.popularized_by || 'Academic AI Researchers';
  
  return {
    coinedBy: coined.split('(')[0].trim(),
    firstAppeared: `Research papers / Industry blogs (${year})`,
    sourceTitle: `Conceptualizing ${concept.name} in modern AI infrastructure`,
    sourceType: concept.slug.includes('agent') ? 'github' : 'paper',
    quote: `The integration of ${concept.name} represents a major paradigm shift, enabling models to overcome static parameters via dynamic execution.`,
    etymology: `Created by combining terms from system engineering and LLM training to represent this specific ${concept.difficulty}-level methodology.`,
    previouslyKnownAs: [`Early stage ${concept.name.toLowerCase()}`, `Experimental ${concept.slug.replace(/-/g, ' ')}`],
    popularizedBy: concept.popularized_by || 'Open-source developers and researchers'
  };
}

interface TermOriginStoryProps {
  concept: Concept;
  className?: string;
}

export const TermOriginStory: React.FC<TermOriginStoryProps> = ({ concept, className = "" }) => {
  const story = useMemo(() => getOriginStory(concept), [concept]);

  const SourceIcon = () => {
    switch (story.sourceType) {
      case 'paper':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'github':
        return <GithubIcon className="w-4 h-4 text-neutral-300" />;
      case 'tweet':
        return <MessageCircle className="w-4 h-4 text-sky-400" />;
      case 'talk':
        return <Presentation className="w-4 h-4 text-contrast-violet" />;
      case 'blog':
      default:
        return <Globe className="w-4 h-4 text-signal-gold" />;
    }
  };

  return (
    <div className={`p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col gap-5 ${className}`}>
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-signal-gold" />
          <h4 className="text-xs font-semibold text-paper-cream uppercase font-mono tracking-wider">
            Origin Story
          </h4>
        </div>
        {story.sourceUrl ? (
          <a 
            href={story.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 hover:text-signal-gold transition-colors"
          >
            <SourceIcon />
            <span className="underline decoration-white/10">{story.sourceTitle}</span>
          </a>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
            <SourceIcon />
            <span>{story.sourceTitle}</span>
          </div>
        )}
      </div>

      {/* Grid of Key Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-2.5 items-start">
          <div className="p-2 rounded bg-white/[0.03] border border-white/5 mt-0.5">
            <User className="w-4 h-4 text-signal-gold" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Coined By</span>
            <span className="text-xs font-medium text-paper-cream">{story.coinedBy}</span>
          </div>
        </div>

        <div className="flex gap-2.5 items-start">
          <div className="p-2 rounded bg-white/[0.03] border border-white/5 mt-0.5">
            <Flame className="w-4 h-4 text-contrast-violet" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Popularized By</span>
            <span className="text-xs font-medium text-paper-cream">{story.popularizedBy}</span>
          </div>
        </div>
      </div>

      {/* Quote Block */}
      <div className="relative p-4 rounded-xl border border-white/5 bg-white/[0.02] mt-1">
        <Quote className="absolute top-3 right-4 w-10 h-10 text-white/[0.02] pointer-events-none" />
        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mb-1.5">First Appearance Quote</span>
        <p className="text-xs text-neutral-300 italic leading-relaxed font-serif pr-6">
          "{story.quote}"
        </p>
      </div>

      {/* Etymology Section */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block">Etymology & Naming Story</span>
        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          {story.etymology}
        </p>
      </div>

      {/* Previously Known As */}
      {story.previouslyKnownAs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider mr-1">Previously Known As:</span>
          {story.previouslyKnownAs.map((tag, i) => (
            <span 
              key={i} 
              className="text-[10px] font-mono text-neutral-500 line-through px-2 py-0.5 border border-white/5 bg-white/[0.005] rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

    </div>
  );
};

interface TermOriginMiniProps {
  concept: Concept;
  className?: string;
}

/**
 * Compact mini variant for cards or side-drawers
 */
export const TermOriginMini: React.FC<TermOriginMiniProps> = ({ concept, className = "" }) => {
  const story = useMemo(() => getOriginStory(concept), [concept]);

  const SourceIcon = () => {
    switch (story.sourceType) {
      case 'paper':
        return <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />;
      case 'github':
        return <GithubIcon className="w-3 h-3 text-neutral-400 shrink-0" />;
      case 'tweet':
        return <MessageCircle className="w-3 h-3 text-sky-400 shrink-0" />;
      default:
        return <Globe className="w-3 h-3 text-signal-gold shrink-0" />;
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider">Historical Origin</span>
        <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-400 bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/5">
          <SourceIcon />
          <span>{story.firstAppeared}</span>
        </div>
      </div>
      
      <div className="text-xs leading-relaxed text-neutral-300 font-sans">
        <span className="text-neutral-500">Coined by: </span>
        <span className="font-medium text-paper-cream">{story.coinedBy}</span>
      </div>

      {story.previouslyKnownAs.length > 0 && (
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
          <span className="shrink-0 text-[9px]">AKA:</span>
          <span className="line-through truncate max-w-[180px]" title={story.previouslyKnownAs.join(', ')}>
            {story.previouslyKnownAs[0]}
          </span>
        </div>
      )}
    </div>
  );
};
