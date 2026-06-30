'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

// Three.js/WebGL must never attempt to render on the server.
// dynamic(..., { ssr: false }) guarantees identical (empty) server/client
// first paint, then mounts the canvas client-side only — same pattern
// that fixed the earlier hydration mismatch, applied proactively here.
const CrystalObject = dynamic(() => import('./CrystalObject'), { ssr: false })

export default function CrystalHero() {
  const scrollProgress = useRef(0)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when section top is at viewport top, 1 when fully scrolled past
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      scrollProgress.current = progress
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {mounted && <CrystalObject scrollProgress={scrollProgress} />}
    </div>
  )
}
