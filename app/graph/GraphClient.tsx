'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Link from 'next/link'

interface Node {
  id: string; name: string; status: string; difficulty: string
  categories: string[]; slug?: string; x?: number; y?: number; fx?: number | null; fy?: number | null
}
interface Link { source: string | Node; target: string | Node; relationship_type: string }

const STATUS_COLOR: Record<string, string> = {
  emerging: 'var(--emerging)', growing: 'var(--growing)',
  stable: 'var(--stable)', declining: 'var(--declining)', historical: 'var(--historical)'
}

export default function GraphClient({ nodes, links }: { nodes: Node[]; links: Link[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selected, setSelected] = useState<Node | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showControls, setShowControls] = useState(false)
  const [showLegend, setShowLegend] = useState(false)

  const categories = ['All', ...Array.from(new Set(nodes.flatMap(n => n.categories)))]

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const filteredNodes = nodes.filter(n => {
      if (filterStatus !== 'all' && n.status !== filterStatus) return false
      if (filterCategory !== 'All' && !n.categories.includes(filterCategory)) return false
      return true
    })
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredLinks = links.filter(l => {
      const src = typeof l.source === 'object' ? l.source.id : l.source
      const tgt = typeof l.target === 'object' ? l.target.id : l.target
      return filteredNodeIds.has(src) && filteredNodeIds.has(tgt)
    })

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const w = svgRef.current.clientWidth
    const h = svgRef.current.clientHeight

    const g = svg.append('g')

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', e => g.attr('transform', e.transform.toString()))
    )

    // Arrow markers
    const defs = svg.append('defs')
    Object.entries(STATUS_COLOR).forEach(([status, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${status}`)
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 18).attr('refY', 0)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', color).attr('opacity', 0.6)
    })

    const simulation = d3.forceSimulation(filteredNodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(filteredLinks).id((d: d3.SimulationNodeDatum) => (d as Node).id).distance(100).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(36))

    const link = g.append('g').selectAll('line')
      .data(filteredLinks).enter().append('line')
      .attr('stroke', 'var(--border-strong)').attr('stroke-width', 1.5)
      .attr('marker-end', d => {
        const src = typeof d.source === 'object' ? (d.source as Node).status : 'stable'
        return `url(#arrow-${src})`
      })

    const node = g.append('g').selectAll('g')
      .data(filteredNodes).enter().append('g')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, Node>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          })
      )
      .on('click', (_, d) => setSelected(d))

    node.append('circle')
      .attr('r', 14)
      .attr('fill', d => STATUS_COLOR[d.status] || 'var(--text-3)')
      .attr('fill-opacity', 0.12)
      .attr('stroke', d => STATUS_COLOR[d.status] || 'var(--text-3)')
      .attr('stroke-width', 1.5)

    node.append('text')
      .attr('dy', 26).attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-2)').attr('font-size', '9px')
      .attr('font-family', 'var(--font-mono), monospace')
      .attr('font-weight', 500)
      .text(d => d.name.length > 20 ? d.name.slice(0, 18) + '…' : d.name)

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x || 0)
        .attr('y1', d => (d.source as Node).y || 0)
        .attr('x2', d => (d.target as Node).x || 0)
        .attr('y2', d => (d.target as Node).y || 0)
      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`)
    })

    return () => { simulation.stop() }
  }, [nodes, links, filterStatus, filterCategory])

  const statuses = ['all', 'emerging', 'growing', 'stable', 'declining', 'historical']

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--bg)' }}>
      {/* Mobile Top/Bottom action bar */}
      <div className="graph-mobile-bar" style={{ display: 'none' }}>
        <button 
          className={`graph-mobile-btn ${showControls ? 'active' : ''}`} 
          onClick={() => { setShowControls(!showControls); setShowLegend(false); }}
        >
          Filters ⚙️
        </button>
        <button 
          className={`graph-mobile-btn ${showLegend ? 'active' : ''}`} 
          onClick={() => { setShowLegend(!showLegend); setShowControls(false); }}
        >
          Legend ℹ️
        </button>
      </div>

      {/* Controls */}
      <div className={`graph-filters-panel ${showControls ? 'mobile-visible' : ''}`} style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 10,
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '16px', minWidth: '200px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filter by status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); if (window.innerWidth <= 768) setShowControls(false); }} style={{
              padding: '5px 10px', borderRadius: 'var(--radius)', fontSize: '12px',
              textAlign: 'left', cursor: 'pointer', border: 'none',
              background: filterStatus === s ? 'var(--accent-dim)' : 'transparent',
              color: filterStatus === s ? 'var(--accent)' : 'var(--text-2)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {s !== 'all' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLOR[s], display: 'inline-block', flexShrink: 0 }}></span>}
              {s === 'all' ? 'All statuses' : s}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {categories.map(c => (
            <button key={c} onClick={() => { setFilterCategory(c); if (window.innerWidth <= 768) setShowControls(false); }} style={{
              padding: '5px 10px', borderRadius: 'var(--radius)', fontSize: '12px',
              textAlign: 'left', cursor: 'pointer', border: 'none',
              background: filterCategory === c ? 'var(--accent-dim)' : 'transparent',
              color: filterCategory === c ? 'var(--accent)' : 'var(--text-2)',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={`graph-legend-panel ${showLegend ? 'mobile-visible' : ''}`} style={{
        position: 'absolute', bottom: '20px', left: '20px', zIndex: 10,
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '12px 16px',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status legend</div>
        {Object.entries(STATUS_COLOR).map(([s, c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, display: 'inline-block' }}></span>
            <span style={{ fontSize: '12px', color: 'var(--text-2)', textTransform: 'capitalize' }}>{s}</span>
          </div>
        ))}
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px' }}>Drag to rearrange · Scroll to zoom</div>
      </div>

      {/* Selected node panel */}
      {selected && (
        <div className="graph-selected-panel" style={{
          position: 'absolute', top: '20px', right: '20px', zIndex: 10,
          background: 'var(--bg-2)', border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius)', padding: '20px', width: '280px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16.5px', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>{selected.name}</div>
              <span className={`pill pill-${selected.status}`} style={{ fontFamily: 'var(--font-mono)' }}>{selected.status}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{
              background: 'none', border: 'none', color: 'var(--text-3)',
              cursor: 'pointer', fontSize: '18px', lineHeight: 1,
            }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
            <span className={`pill pill-${selected.difficulty}`}>{selected.difficulty}</span>
            {selected.categories?.map(c => (
              <span key={c} style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-3)', padding: '2px 7px', borderRadius: '4px', border: '1px solid var(--border)' }}>{c}</span>
            ))}
          </div>
          {selected.slug && (
            <Link href={`/concepts/${selected.slug}`} style={{
              display: 'block', textAlign: 'center', padding: '10px',
              background: 'var(--accent)', color: 'var(--bg-1)', borderRadius: 'var(--radius)',
              fontSize: '13.5px', fontWeight: 600, transition: 'background-color 0.2s',
            }} className="graph-view-btn">View concept →</Link>
          )}
        </div>
      )}

      {nodes.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🕸️</div>
            <p>No concepts to graph yet.</p>
            <Link href="/admin/add" style={{ color: 'var(--accent)', marginTop: '8px', display: 'block' }}>Add concepts →</Link>
          </div>
        </div>
      )}

      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />

      <style>{`
        @media (max-width: 768px) {
          .graph-filters-panel {
            display: none;
            position: fixed !important;
            top: auto !important;
            bottom: 76px !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            max-height: 50vh !important;
            overflow-y: auto !important;
            z-index: 40 !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
          }
          .graph-legend-panel {
            display: none;
            position: fixed !important;
            top: auto !important;
            bottom: 76px !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            z-index: 40 !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
          }
          .graph-selected-panel {
            position: fixed !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            border-radius: 20px 20px 0 0 !important;
            z-index: 50 !important;
            box-shadow: 0 -8px 24px rgba(0,0,0,0.25) !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
          }
          .graph-filters-panel.mobile-visible, .graph-legend-panel.mobile-visible {
            display: block !important;
          }
          .graph-mobile-bar {
            display: flex !important;
            position: fixed !important;
            bottom: 16px !important;
            left: 16px !important;
            right: 16px !important;
            gap: 8px !important;
            zIndex: 41 !important;
          }
          .graph-mobile-btn {
            flex: 1 !important;
            padding: 10px !important;
            background: var(--bg-2) !important;
            border: 1px solid var(--border-strong) !important;
            border-radius: 20px !important;
            color: var(--text-2) !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            text-align: center !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
          }
          .graph-mobile-btn.active {
            background: var(--accent) !important;
            color: var(--bg-1) !important;
            border-color: var(--accent) !important;
          }
        }
      `}</style>
    </div>
  )
}
