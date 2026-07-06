import { useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  TrendingDown, 
  Archive,
  LucideIcon 
} from 'lucide-react';

export type LifecycleStatus = 'emerging' | 'growing' | 'stable' | 'declining' | 'historical';
export type LearningPriority = 'learn_now' | 'know_basics' | 'nice_to_know' | 'historical';

export interface StatusMetrics {
  firstAppeared?: string | number;
  githubStars?: number;
  paperMentions?: number;
  communityVolume?: number; // scale 0-100 or raw mentions
}

export interface StatusConfigEntry {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

export const statusConfig: Record<LifecycleStatus, StatusConfigEntry> = {
  emerging: {
    color: '#10B981', // Emerald green
    bgColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    icon: Sparkles,
    label: 'Emerging',
    description: 'Early-stage breakthrough concept gaining initial traction.'
  },
  growing: {
    color: '#D9A85C', // Signal Gold
    bgColor: 'rgba(217, 168, 92, 0.08)',
    borderColor: 'rgba(217, 168, 92, 0.2)',
    icon: TrendingUp,
    label: 'Growing',
    description: 'Rapidly expanding adoption and research community.'
  },
  stable: {
    color: '#8B7CF6', // Contrast Violet
    bgColor: 'rgba(139, 124, 246, 0.08)',
    borderColor: 'rgba(139, 124, 246, 0.2)',
    icon: CheckCircle2,
    label: 'Stable',
    description: 'Established industry standard with robust foundations.'
  },
  declining: {
    color: '#EF4444', // Warning Red
    bgColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    icon: TrendingDown,
    label: 'Declining',
    description: 'Decreasing relevance as newer paradigms supersede it.'
  },
  historical: {
    color: '#9CA3AF', // Muted Gray
    bgColor: 'rgba(156, 163, 175, 0.08)',
    borderColor: 'rgba(156, 163, 175, 0.2)',
    icon: Archive,
    label: 'Historical',
    description: 'Legacy concept that paved the way for modern methods.'
  }
};

/**
 * Derives learning priority from status and metrics
 */
export function getLearningPriority(status: LifecycleStatus, metrics: StatusMetrics = {}): LearningPriority {
  const stars = metrics.githubStars || 0;
  const papers = metrics.paperMentions || 0;

  if (status === 'historical') return 'historical';
  if (status === 'declining') return 'nice_to_know';
  if (status === 'stable') return 'know_basics';
  
  // Emerging or Growing
  if (status === 'growing' || stars > 5000 || papers > 100) {
    return 'learn_now';
  }
  
  return 'know_basics';
}

/**
 * Generates predictions for the next 3-6 months
 */
export function getPrediction(status: LifecycleStatus, metrics: StatusMetrics = {}): string {
  const stars = metrics.githubStars || 0;
  const papers = metrics.paperMentions || 0;
  const volume = metrics.communityVolume || 0;
  
  switch (status) {
    case 'emerging':
      if (stars > 1000 || papers > 25 || volume > 60) {
        return "High velocity metrics. Likely to transition to 'Growing' status in the next 3 months.";
      }
      return "Incubating. Steady baseline research indicates a slow but positive trajectory.";
    case 'growing':
      if (stars > 8000 || papers > 200) {
        return "Critical mass achieved. Poised to lock in as a 'Stable' industry standard soon.";
      }
      return "Expanding footprint. Expected to see 40-60% growth in production deployments.";
    case 'stable':
      if (volume < 15 && papers < 10) {
        return "Plateau reached. Keep tabs on emerging alternatives that may begin cannibalizing market share.";
      }
      return "Solid foundation. Will remain dominant standard for the foreseeable future.";
    case 'declining':
      return "Deprecating. Newer architectures are replacing this. Transitioning to 'Historical' within 6 months.";
    case 'historical':
      return "Historical paradigm. High educational value, but not recommended for new production projects.";
    default:
      return "Consistent baseline metrics. Maintain current integration model.";
  }
}

/**
 * Hook to automatically calculate lifecycle status and details from metrics
 */
export function useConceptStatus(metrics: StatusMetrics) {
  const calculatedStatus = useMemo<LifecycleStatus>(() => {
    const { firstAppeared, githubStars = 0, paperMentions = 0, communityVolume = 50 } = metrics;
    
    // Parse year
    let yearsOld = 0;
    const currentYear = new Date().getFullYear(); // 2026
    if (firstAppeared) {
      const yearNum = typeof firstAppeared === 'number' ? firstAppeared : parseInt(firstAppeared, 10);
      if (!isNaN(yearNum)) {
        yearsOld = Math.max(0, currentYear - yearNum);
      }
    }

    // Historical Logic: old appearance with minimal active interest
    if (yearsOld >= 4 && githubStars < 400 && paperMentions < 15) {
      return 'historical';
    }

    // Declining Logic: older concept, low active discussion despite past size
    if (yearsOld >= 2 && communityVolume < 15 && (githubStars > 500 || paperMentions > 20)) {
      return 'declining';
    }

    // Stable Logic: high volume and stars/papers
    if (githubStars >= 8000 || paperMentions >= 250) {
      return 'stable';
    }

    // Growing Logic: moderate/high stars, papers, or community volume
    if (githubStars >= 1500 || paperMentions >= 50 || communityVolume >= 70) {
      return 'growing';
    }

    // Default: Emerging (recent or low-key but active interest)
    return 'emerging';
  }, [metrics]);

  const priority = useMemo(() => getLearningPriority(calculatedStatus, metrics), [calculatedStatus, metrics]);
  const prediction = useMemo(() => getPrediction(calculatedStatus, metrics), [calculatedStatus, metrics]);
  const config = statusConfig[calculatedStatus];

  return {
    status: calculatedStatus,
    config,
    priority,
    prediction
  };
}
