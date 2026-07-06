'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { statusConfig, LifecycleStatus } from '@/hooks/useConceptStatus';
import { lifecyclePulse } from '@/lib/animations';
import { ArrowUpRight, ArrowRight, ArrowDownRight } from 'lucide-react';

interface ConceptLifecycleProps {
  status: LifecycleStatus;
  size?: number; // Size of the core dot in pixels
}

/**
 * Animated pulsing status dot for a concept lifecycle state
 */
export const ConceptLifecycle: React.FC<ConceptLifecycleProps> = ({ status, size = 8 }) => {
  const config = statusConfig[status] || statusConfig.emerging;
  const pulse = (lifecyclePulse[status] || { scale: 1, opacity: 1, transition: { duration: 0 } }) as any;

  // Show pulsing background glow for active/changing states (emerging, growing, declining)
  const shouldPulse = status === 'emerging' || status === 'growing' || status === 'declining';

  return (
    <div 
      className="relative flex items-center justify-center" 
      style={{ width: size * 2.5, height: size * 2.5 }}
    >
      {shouldPulse && (
        <motion.div
          className="absolute rounded-full"
          style={{
            backgroundColor: config.color,
            width: size * 2.2,
            height: size * 2.2,
            opacity: 0.35,
            filter: 'blur(1px)'
          }}
          animate={{
            scale: pulse.scale,
            opacity: pulse.opacity
          }}
          transition={pulse.transition}
        />
      )}
      
      {/* Core solid dot */}
      <motion.div
        className="rounded-full relative z-10"
        style={{
          backgroundColor: config.color,
          width: size,
          height: size,
        }}
        // Apply micro-scale to core dot if growing or emerging
        animate={shouldPulse ? { scale: pulse.scale } : undefined}
        transition={shouldPulse ? pulse.transition : undefined}
      />
    </div>
  );
};

interface ConceptLifecycleBadgeProps {
  status: LifecycleStatus;
  className?: string;
}

/**
 * Compact badge/pill showing the lifecycle status with its pulsing indicator
 */
export const ConceptLifecycleBadge: React.FC<ConceptLifecycleBadgeProps> = ({ status, className = "" }) => {
  const config = statusConfig[status] || statusConfig.emerging;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border transition-all duration-300 ${className}`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.color,
      }}
    >
      <ConceptLifecycle status={status} size={6} />
      <span>{config.label}</span>
    </div>
  );
};

interface ConceptLifecycleDashboardProps {
  status: LifecycleStatus;
  trend?: 'rising' | 'stable' | 'falling';
  className?: string;
}

/**
 * Dashboard variant displaying a lifecycle status badge alongside its activity trend arrow
 */
export const ConceptLifecycleDashboard: React.FC<ConceptLifecycleDashboardProps> = ({ 
  status, 
  trend, 
  className = "" 
}) => {
  const resolvedTrend = trend || (() => {
    if (status === 'emerging' || status === 'growing') return 'rising';
    if (status === 'stable') return 'stable';
    return 'falling';
  })();

  const TrendIcon = () => {
    switch (resolvedTrend) {
      case 'rising':
        return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
      case 'falling':
        return <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />;
      case 'stable':
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  const getTrendColorClass = () => {
    switch (resolvedTrend) {
      case 'rising': return 'text-emerald-400';
      case 'falling': return 'text-rose-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className={`flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${className}`}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
          Maturity Level
        </span>
        <ConceptLifecycleBadge status={status} />
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
          Activity Trend
        </span>
        <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg">
          <TrendIcon />
          <span className={`text-[11px] font-semibold font-mono capitalize ${getTrendColorClass()}`}>
            {resolvedTrend}
          </span>
        </div>
      </div>
    </div>
  );
};

interface LifecycleLegendProps {
  className?: string;
}

/**
 * Grid-based legend element describing all five lifecycle statuses
 */
export const LifecycleLegend: React.FC<LifecycleLegendProps> = ({ className = "" }) => {
  const statuses: LifecycleStatus[] = ['emerging', 'growing', 'stable', 'declining', 'historical'];

  return (
    <div className={`flex flex-col gap-4 p-5 rounded-xl border border-white/10 bg-white/[0.02] ${className}`}>
      <div>
        <h4 className="text-xs font-semibold text-signal-gold uppercase tracking-widest font-mono mb-1">
          Lifecycle Phases
        </h4>
        <p className="text-[11px] text-neutral-400">
          How concepts evolve from experimental research into standard industry practices.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        {statuses.map((status) => {
          const config = statusConfig[status];
          return (
            <div 
              key={status} 
              className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors duration-200"
            >
              <div className="flex items-center gap-1">
                <ConceptLifecycle status={status} size={6} />
                <span className="text-xs font-semibold font-serif" style={{ color: config.color }}>
                  {config.label}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {config.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
