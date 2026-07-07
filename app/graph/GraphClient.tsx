'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Link from 'next/link'
import { parseYear } from '@/lib/yearParser'

interface Node {
  id: string; name: string; status: string; difficulty: string
  categories: string[]; slug?: string; x?: number; y?: number; z?: number; fx?: number | null; fy?: number | null
  first_appeared?: string
}
interface Link { source: string | Node; target: string | Node; relationship_type: string }

const STATUS_COLOR: Record<string, string> = {
  emerging: '#2E8B57', growing: '#3FA66B',
  stable: '#D4AF37', declining: '#8A867D', historical: '#5c5953'
}

// Perform 3D force layout simulation synchronously
const run3DForceSimulation = (nodes3d: any[], links3d: any[]) => {
  nodes3d.forEach((n) => {
    let needsInit = false;
    if (n.x === undefined || isNaN(n.x) || n.x === null) { n.x = 0; needsInit = true; }
    if (n.y === undefined || isNaN(n.y) || n.y === null) { n.y = 0; needsInit = true; }
    if (n.z === undefined || isNaN(n.z) || n.z === null) { n.z = 0; needsInit = true; }

    if (needsInit) {
      const theta = Math.acos(Math.random() * 2 - 1)
      const phi = Math.random() * Math.PI * 2
      const r = 60 + Math.random() * 60
      n.x = r * Math.sin(theta) * Math.cos(phi)
      n.y = r * Math.sin(theta) * Math.sin(phi)
      n.z = r * Math.cos(theta)
    }
    n.vx = 0
    n.vy = 0
    n.vz = 0
  })

  const ticks = 240
  const repulsion = 500
  const attraction = 0.04
  const centerStrength = 0.03
  const restLength = 90
  const damping = 0.82

  for (let t = 0; t < ticks; t++) {
    // Repulsion between all pairs
    for (let i = 0; i < nodes3d.length; i++) {
      const a = nodes3d[i]
      for (let j = i + 1; j < nodes3d.length; j++) {
        const b = nodes3d[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dz = a.z - b.z
        const distSq = dx * dx + dy * dy + dz * dz + 0.1
        const dist = Math.sqrt(distSq)
        if (dist < 500) {
          const force = repulsion / distSq
          const fX = (dx / dist) * force
          const fY = (dy / dist) * force
          const fZ = (dz / dist) * force
          a.vx += fX
          a.vy += fY
          a.vz += fZ
          b.vx -= fX
          b.vy -= fY
          b.vz -= fZ
        }
      }
    }

    // Attraction along links
    links3d.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target
      const source = nodes3d.find(n => n.id === srcId)
      const target = nodes3d.find(n => n.id === tgtId)
      if (source && target) {
        const dx = target.x - source.x
        const dy = target.y - source.y
        const dz = target.z - source.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1
        const force = (dist - restLength) * attraction
        const fX = (dx / dist) * force
        const fY = (dy / dist) * force
        const fZ = (dz / dist) * force
        source.vx += fX
        source.vy += fY
        source.vz += fZ
        target.vx -= fX
        target.vy -= fY
        target.vz -= fZ
      }
    })

    // Gravity to center
    nodes3d.forEach(n => {
      n.vx -= n.x * centerStrength
      n.vy -= n.y * centerStrength
      n.vz -= n.z * centerStrength
    })

    // Update positions
    nodes3d.forEach(n => {
      n.x += n.vx
      n.y += n.vy
      n.z += n.vz
      n.vx *= damping
      n.vy *= damping
      n.vz *= damping
    })
  }
}

export default function GraphClient({ nodes, links }: { nodes: Node[]; links: Link[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cameraPosRef = useRef<any>(null)
  const controlsTargetRef = useRef<any>(null)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [selected, setSelected] = useState<Node | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showControls, setShowControls] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [isPlaying, setIsPlaying] = useState(false)

  const categories = ['All', ...Array.from(new Set(nodes.flatMap(n => n.categories)))]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedYear(prev => {
          if (prev >= 2026) return 2015
          return prev + 1
        })
      }, 1200)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying])

  // Calculate filtered nodes & links at render time
  const filteredNodes = nodes.filter(n => {
    if (filterStatus !== 'all' && n.status !== filterStatus) return false
    if (filterCategory !== 'All' && !n.categories.includes(filterCategory)) return false
    if (parseYear(n.first_appeared) > selectedYear) return false
    return true
  })
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredLinks = links.filter(l => {
    const src = typeof l.source === 'object' ? l.source.id : l.source
    const tgt = typeof l.target === 'object' ? l.target.id : l.target
    return filteredNodeIds.has(src) && filteredNodeIds.has(tgt)
  })

  // 2D force-directed simulation (D3)
  useEffect(() => {
    if (viewMode !== '2d' || !svgRef.current || filteredNodes.length === 0) return

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
  }, [viewMode, filteredNodes, filteredLinks])

  // 3D force-directed simulation (WebGL via standard Three.js)
  useEffect(() => {
    if (viewMode !== '3d' || !canvasRef.current || filteredNodes.length === 0) return

    // 1. Run 3D layout simulation to obtain positions
    const simulationNodes = filteredNodes.map(n => ({
      ...n,
      x: n.x, y: n.y, z: n.z
    }))
    run3DForceSimulation(simulationNodes, filteredLinks)

    // Write computed positions back so our React state can see them initially
    filteredNodes.forEach(fn => {
      const sn = simulationNodes.find(n => n.id === fn.id)
      if (sn) {
        fn.x = sn.x
        fn.y = sn.y
        fn.z = sn.z
      }
    })

    let active = true

    // 2. Setup Three.js
    Promise.all([
      import('three'),
      // @ts-ignore
      import('three/examples/jsm/controls/OrbitControls')
    ]).then(([THREE, { OrbitControls }]) => {
      if (!active || !canvasRef.current) return

      const canvas = canvasRef.current
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      const scene = new THREE.Scene()
      
      // Grab standard background color
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0B0B0C'
      scene.background = new THREE.Color(bgColor)

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
      if (cameraPosRef.current) {
        camera.position.copy(cameraPosRef.current)
      } else {
        camera.position.set(0, 0, 240)
      }

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.rotateSpeed = 0.7
      controls.zoomSpeed = 0.8
      controls.maxDistance = 500
      controls.minDistance = 40
      if (controlsTargetRef.current) {
        controls.target.copy(controlsTargetRef.current)
      }

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambient)

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
      dirLight1.position.set(120, 200, 100)
      scene.add(dirLight1)

      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
      dirLight2.position.set(-120, -200, -100)
      scene.add(dirLight2)

      // Draw nodes
      const nodeGroup = new THREE.Group()
      scene.add(nodeGroup)

      const sphereGeo = new THREE.SphereGeometry(6, 16, 16)
      const meshes: any[] = []

      simulationNodes.forEach(node => {
        const colorVal = STATUS_COLOR[node.status] || '#8A867D'
        const mat = new THREE.MeshPhongMaterial({
          color: new THREE.Color(colorVal),
          emissive: new THREE.Color(colorVal),
          emissiveIntensity: 0.12,
          specular: new THREE.Color(0xffffff),
          shininess: 30,
          transparent: true,
          opacity: 0.88
        })
        const mesh = new THREE.Mesh(sphereGeo, mat)
        mesh.position.set(node.x || 0, node.y || 0, node.z || 0)
        mesh.userData = { id: node.id, node }
        nodeGroup.add(mesh)
        meshes.push(mesh)
      })

      // Draw links
      const linkGroup = new THREE.Group()
      scene.add(linkGroup)

      filteredLinks.forEach(link => {
        const srcId = typeof link.source === 'object' ? link.source.id : link.source
        const tgtId = typeof link.target === 'object' ? link.target.id : link.target
        const source = simulationNodes.find(n => n.id === srcId)
        const target = simulationNodes.find(n => n.id === tgtId)

        if (source && target) {
          const points = [
            new THREE.Vector3(source.x || 0, source.y || 0, source.z || 0),
            new THREE.Vector3(target.x || 0, target.y || 0, target.z || 0)
          ]
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
          const lineMat = new THREE.LineBasicMaterial({
            color: new THREE.Color('#D4AF37'),
            opacity: 0.22,
            transparent: true
          })
          const line = new THREE.Line(lineGeo, lineMat)
          linkGroup.add(line)
        }
      })

      // Raycasting for node selection
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      const onCanvasClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(meshes)

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as any
          const clickedNode = clickedMesh.userData.node
          setSelected(clickedNode)
        }
      }

      renderer.domElement.addEventListener('click', onCanvasClick)

      // Resize observer
      const onResize = () => {
        if (!canvas) return
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // Animation render loop
      let animationFrameId: number
      const tempV = new THREE.Vector3()

      const animate = () => {
        if (!active) return
        animationFrameId = requestAnimationFrame(animate)

        controls.update()

        // Slow auto-rotation
        nodeGroup.rotation.y += 0.0015
        linkGroup.rotation.y += 0.0015

        // Sync node positions to HTML overlay elements
        simulationNodes.forEach(node => {
          // Project the 3D position to the 2D label layer, accounting for Y auto-rotation
          tempV.set(node.x || 0, node.y || 0, node.z || 0)
          tempV.applyAxisAngle(new THREE.Vector3(0, 1, 0), nodeGroup.rotation.y)
          tempV.project(camera)

          const screenX = (tempV.x * 0.5 + 0.5) * canvas.clientWidth
          const screenY = (-tempV.y * 0.5 + 0.5) * canvas.clientHeight

          const el = document.getElementById(`label-3d-${node.id}`)
          if (el) {
            el.style.transform = `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) translate(-50%, -50%)`

            if (tempV.z > 1) {
              el.style.opacity = '0'
              el.style.pointerEvents = 'none'
            } else {
              el.style.opacity = '1'
              el.style.pointerEvents = 'auto'
            }
          }
        })

        renderer.render(scene, camera)
      }

      animate()

      // Cleanup function
      return () => {
        active = false
        cancelAnimationFrame(animationFrameId)
        
        // Save camera and controls state
        cameraPosRef.current = camera.position.clone()
        controlsTargetRef.current = controls.target.clone()

        if (renderer.domElement) {
          renderer.domElement.removeEventListener('click', onCanvasClick)
        }
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        sphereGeo.dispose()
        meshes.forEach(m => {
          if (m.geometry) m.geometry.dispose()
          if (Array.isArray(m.material)) {
            m.material.forEach((mat: any) => mat.dispose())
          } else {
            m.material.dispose()
          }
        })
      }
    })

    return () => {
      active = false
    }
  }, [viewMode, filteredNodes, filteredLinks])

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
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>View Mode</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          <button onClick={() => setViewMode('2d')} style={{
            flex: 1, padding: '6px 0', borderRadius: 'var(--radius)', fontSize: '12px',
            textAlign: 'center', cursor: 'pointer', border: '1px solid ' + (viewMode === '2d' ? 'var(--accent)' : 'var(--border)'),
            background: viewMode === '2d' ? 'var(--accent-dim)' : 'transparent',
            color: viewMode === '2d' ? 'var(--accent)' : 'var(--text-2)',
            fontWeight: 600,
          }}>2D Graph</button>
          <button onClick={() => setViewMode('3d')} style={{
            flex: 1, padding: '6px 0', borderRadius: 'var(--radius)', fontSize: '12px',
            textAlign: 'center', cursor: 'pointer', border: '1px solid ' + (viewMode === '3d' ? 'var(--accent)' : 'var(--border)'),
            background: viewMode === '3d' ? 'var(--accent-dim)' : 'transparent',
            color: viewMode === '3d' ? 'var(--accent)' : 'var(--text-2)',
            fontWeight: 600,
          }}>3D WebGL</button>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Timeline</div>
        <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? 'var(--accent-dim)' : 'var(--bg-2)',
                border: '1px solid ' + (isPlaying ? 'var(--accent-border)' : 'var(--border)'),
                color: isPlaying ? 'var(--accent)' : 'var(--text-2)',
                borderRadius: '6px', padding: '4px 8px', fontSize: '10px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em'
              }}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <span style={{
              background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)',
              borderRadius: '4px', padding: '2px 6px', fontSize: '11px', fontWeight: 700,
              fontFamily: 'var(--font-mono)'
            }}>
              {selectedYear}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>2015</span>
            <input 
              type="range"
              min="2015"
              max="2026"
              value={selectedYear}
              onChange={e => {
                setSelectedYear(parseInt(e.target.value, 10))
                setIsPlaying(false)
              }}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: 'var(--border)',
                outline: 'none',
                cursor: 'pointer',
                accentColor: 'var(--accent)'
              }}
            />
            <span style={{ fontSize: '9px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>2026</span>
          </div>
        </div>

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
        position: 'absolute', bottom: '20px', right: '20px', zIndex: 10,
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
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px' }}>
          {viewMode === '2d' ? 'Drag to rearrange · Scroll to zoom' : 'Left click + drag to rotate · Right click + drag to pan · Scroll to zoom'}
        </div>
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

      {/* Render 2D SVG or 3D Canvas + Overlay */}
      {viewMode === '2d' ? (
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          {/* HTML Overlay Labels for WebGL Nodes */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
            {filteredNodes.map(n => (
              <div
                key={n.id}
                id={`label-3d-${n.id}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  color: n.id === selected?.id ? 'var(--accent)' : 'var(--text-2)',
                  background: n.id === selected?.id ? 'var(--bg-3)' : 'var(--nav-bg)',
                  border: '1px solid ' + (n.id === selected?.id ? 'var(--accent)' : 'var(--border)'),
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '9px',
                  fontFamily: 'var(--font-mono), monospace',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
                  transition: 'opacity 0.15s ease, color 0.15s, background-color 0.15s, border-color 0.15s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(n)
                }}
              >
                {n.name}
              </div>
            ))}
          </div>
        </div>
      )}

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
