'use client'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

// Generates a deterministic radial particle field so server and client
// output match exactly (no Math.random() in render — seeded instead).
function seededParticles(count: number) {
  let seed = 42
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.5
    const dist = 30 + rand() * 220
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 2 + rand() * 5,
      delay: rand() * 0.4,
      hue: rand() > 0.5 ? '#818cf8' : '#a78bfa',
    }
  })
}

const PARTICLES = seededParticles(60)



function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    const duration = 1200
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target])

  return <span>{val}{suffix}</span>
}

export default function ParticleBurst({ totalCount = 31 }: { totalCount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  const stats = [
    { value: totalCount, suffix: '+', label: 'Concepts mapped' },
    { value: 5, suffix: '', label: 'Status levels' },
    { value: 100, suffix: '%', label: 'Cited sources' },
  ]

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const burstProgress = useSpring(useTransform(scrollYProgress, [0.15, 0.55], [0, 1]), {
    stiffness: 80, damping: 22,
  })
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const textY = useTransform(scrollYProgress, [0.3, 0.5], [24, 0])
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.4])
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="particle-burst-section" style={{
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {/* Radial glow backdrop that scales with scroll */}
      <motion.div
        style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, var(--hero-orb-1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          scale: bgScale,
          opacity: bgOpacity,
        }}
      />

      {/* Particle burst */}
      <div style={{ position: 'absolute', width: 0, height: 0 }}>
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: p.size, height: p.size,
              borderRadius: '50%',
              background: p.hue,
              x: useTransform(burstProgress, [0, 1], [0, p.x]),
              y: useTransform(burstProgress, [0, 1], [0, p.y]),
              opacity: useTransform(burstProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.4]),
              boxShadow: `0 0 8px ${p.hue}`,
            }}
          />
        ))}
      </div>

      {/* Stats content */}
      <motion.div
        style={{ position: 'relative', zIndex: 2, textAlign: 'center', opacity: textOpacity, y: textY }}
      >
        <div style={{
          fontSize: '11px', fontWeight: 600, color: 'var(--accent-2)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px',
        }}>
          The numbers behind the map
        </div>
        <div style={{ display: 'flex', gap: 'clamp(32px, 6vw, 80px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{
                fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800,
                fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em',
              }} className="gradient-text">
                <CountUp target={s.value} suffix={s.suffix} active={inView} />
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 500, marginTop: '6px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .particle-burst-section { min-height: 120vh; }
        @media (max-width: 768px) {
          .particle-burst-section { min-height: 60vh !important; padding: 80px 24px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .particle-burst-section { min-height: auto !important; padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  )
}
