'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, FolderOpen, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { Concept } from '@/types';
import { statusConfig, LifecycleStatus } from '@/hooks/useConceptStatus';

// Custom hook to manage open/close state of Command Palette via Ctrl+K / Cmd+K
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return { isOpen, toggle, open, close, setIsOpen };
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: Concept[];
}

interface SearchItem {
  type: 'concept' | 'category' | 'page';
  id: string;
  name: string;
  url: string;
  description?: string;
  status?: string; // only for type = 'concept'
}

const PAGES = [
  { name: 'Home Dashboard', url: '/', description: 'Trace conceptual lineage sandbox and key statistics' },
  { name: 'Concepts Library', url: '/concepts', description: 'Explore full definitions, etymology, and citations' },
  { name: 'Evolution Force Graph', url: '/graph', description: '3D interactive network of concept dependencies' },
  { name: 'Weekly Evolution Digest', url: '/digest', description: 'Recent state modifications, releases, and papers' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose, 
  concepts = [] 
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Compute search results grouped and flattened
  const filteredConcepts = useMemo(() => {
    if (!query) return concepts.slice(0, 5); // default recommendations
    const cleanQuery = query.toLowerCase().trim();
    return concepts.filter(c => 
      c.name.toLowerCase().includes(cleanQuery) || 
      c.abbreviation?.toLowerCase().includes(cleanQuery) ||
      c.tldr.toLowerCase().includes(cleanQuery)
    );
  }, [query, concepts]);

  const filteredCategories = useMemo(() => {
    if (!query) return [];
    const cleanQuery = query.toLowerCase().trim();
    const allCategories = Array.from(new Set(concepts.flatMap(c => c.categories || [])));
    return allCategories
      .filter(cat => cat.toLowerCase().includes(cleanQuery))
      .slice(0, 3);
  }, [query, concepts]);

  const filteredPages = useMemo(() => {
    if (!query) return PAGES;
    const cleanQuery = query.toLowerCase().trim();
    return PAGES.filter(p => p.name.toLowerCase().includes(cleanQuery));
  }, [query]);

  // Flattened array for simple keyboard index navigation
  const flattenedItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [];

    // Add Concepts
    filteredConcepts.forEach((c: Concept) => {
      items.push({
        type: 'concept',
        id: `c-${c.id}`,
        name: c.name + (c.abbreviation ? ` (${c.abbreviation})` : ''),
        url: `/concepts/${c.slug}`,
        description: c.tldr,
        status: c.status
      });
    });

    // Add Categories
    filteredCategories.forEach((cat: string) => {
      items.push({
        type: 'category',
        id: `cat-${cat}`,
        name: `Category: ${cat}`,
        url: `/concepts?category=${encodeURIComponent(cat)}`,
        description: `Filter evolutionary concepts associated with ${cat}`
      });
    });

    // Add Pages
    filteredPages.forEach((p: typeof PAGES[0]) => {
      items.push({
        type: 'page',
        id: `p-${p.url}`,
        name: p.name,
        url: p.url,
        description: p.description
      });
    });

    return items;
  }, [filteredConcepts, filteredCategories, filteredPages]);

  // Reset selected index if query or results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle item selection/navigation
  const handleSelect = useCallback((item: SearchItem) => {
    onClose();
    router.push(item.url);
  }, [router, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, flattenedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flattenedItems.length) % Math.max(1, flattenedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flattenedItems[selectedIndex]) {
        handleSelect(flattenedItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flattenedItems, selectedIndex, handleSelect]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
          
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink-navy/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-ink-navy/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[60vh]"
          >
            {/* Search Input Box */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search concepts, categories, or pages... (Esc to close)"
                className="w-full bg-transparent border-0 text-paper-cream placeholder-neutral-500 focus:outline-none focus:ring-0 text-sm font-sans"
              />
              <span className="text-[10px] font-mono font-semibold text-neutral-400 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded shrink-0">
                ⌘K
              </span>
            </div>

            {/* Results Scrollbox */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {flattenedItems.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 text-neutral-500" />
                  </div>
                  <h4 className="text-sm font-semibold text-paper-cream mb-1">No results matching query</h4>
                  <p className="text-xs text-neutral-400 max-w-[280px]">
                    Try looking up core terms like "RAG", "Agentic Coding", or "Vibe Coding".
                  </p>
                </div>
              ) : (
                // Grouped items listing
                <div className="space-y-4">
                  {/* Flat loop rendering to maintain indices, headers added conditionally */}
                  {(() => {
                    let lastType: string | null = null;
                    return flattenedItems.map((item: SearchItem, idx: number) => {
                      const showHeader = item.type !== lastType;
                      lastType = item.type;

                      const isSelected = idx === selectedIndex;
                      
                      // Lifecycle status color indicators
                      const statusColor = item.status ? (statusConfig[item.status as LifecycleStatus]?.color || null) : null;

                      return (
                        <div key={item.id} className="space-y-1">
                          {showHeader && (
                            <div className="px-3 pt-2 pb-1 text-[9px] font-bold font-mono tracking-widest text-signal-gold uppercase">
                              {item.type === 'concept' ? (query ? 'Matching Concepts' : 'Recommended Concepts') : item.type === 'category' ? 'Categories' : 'App Pages'}
                            </div>
                          )}
                          
                          <button
                            type="button"
                            data-active={isSelected}
                            onClick={() => handleSelect(item)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all duration-150 ${
                              isSelected 
                                ? 'bg-white/[0.06] border border-white/10 pl-3.5' 
                                : 'bg-transparent border border-transparent pl-2.5 hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {item.type === 'concept' && statusColor && (
                                <span 
                                  className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                                  style={{ backgroundColor: statusColor }}
                                />
                              )}
                              {item.type === 'category' && (
                                <FolderOpen className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              )}
                              {item.type === 'page' && (
                                <Sparkles className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              )}
                              
                              <div className="min-w-0">
                                <span className={`text-xs font-serif block truncate font-medium ${isSelected ? 'text-signal-gold' : 'text-paper-cream'}`}>
                                  {item.name}
                                </span>
                                {item.description && (
                                  <span className="text-[10px] text-neutral-400 font-sans block truncate max-w-[420px]">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Key enter hint on active selection */}
                            {isSelected && (
                              <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5 shrink-0">
                                <span>Select</span>
                                <CornerDownLeft className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Bottom Info bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-t border-white/10 text-[10px] text-neutral-400 font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigation</span>
                <span>↵ Enter Select</span>
              </div>
              <div className="flex items-center gap-1">
                <span>CredgeAiVerse Search</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
