'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CrystalCoreProps {
  scrollProgress?: number
  color?: string
  accentColor?: string
}

function WobbleGeometry({ scrollProgress = 0, color = '#818cf8', accentColor = '#6366f1' }: CrystalCoreProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.LineSegments>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { viewport, mouse } = useThree()

  // Base icosahedron geometry, subdivided for organic wobble
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.4, 4), [])
  const wireGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.55, 1), [])

  const basePositions = useMemo(() => {
    const pos = geometry.attributes.position
    const arr = new Float32Array(pos.count * 3)
    arr.set(pos.array as Float32Array)
    return arr
  }, [geometry])

  const noise3D = useMemo(() => {
    // lightweight deterministic pseudo-noise (no external lib needed)
    return (x: number, y: number, z: number, t: number) => {
      return (
        Math.sin(x * 2.1 + t) * Math.cos(y * 1.7 + t * 0.8) * 0.5 +
        Math.sin(y * 2.6 - t * 0.6) * Math.cos(z * 1.9 + t) * 0.3 +
        Math.sin(z * 3.1 + t * 0.4) * 0.2
      )
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Organic wobble via vertex displacement along normals
    if (meshRef.current) {
      const pos = meshRef.current.geometry.attributes.position
      const normal = meshRef.current.geometry.attributes.normal
      for (let i = 0; i < pos.count; i++) {
        const ix = i * 3
        const nx = normal.array[ix]
        const ny = normal.array[ix + 1]
        const nz = normal.array[ix + 2]
        const bx = basePositions[ix]
        const by = basePositions[ix + 1]
        const bz = basePositions[ix + 2]
        const n = noise3D(bx, by, bz, t * 0.35)
        const displacement = 1 + n * 0.09
        pos.array[ix] = bx * displacement
        pos.array[ix + 1] = by * displacement
        pos.array[ix + 2] = bz * displacement
      }
      pos.needsUpdate = true
      meshRef.current.geometry.computeVertexNormals()
    }

    // Slow continuous rotation + scroll-linked spin + mouse parallax
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.18 + scrollProgress * Math.PI * 0.6
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15 + scrollProgress * 0.3
      groupRef.current.rotation.z = scrollProgress * 0.15

      // gentle mouse parallax
      const targetX = mouse.x * 0.25
      const targetY = mouse.y * 0.15
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.04
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.04

      // scroll-linked scale (subtle grow as you scroll into hero)
      const targetScale = 1 + scrollProgress * 0.18
      groupRef.current.scale.setScalar(
        groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.06
      )
    }

    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.1
      wireRef.current.rotation.x = t * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.15}
          roughness={0.12}
          transmission={0.92}
          thickness={1.6}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.6}
          attenuationColor={accentColor}
          attenuationDistance={1.2}
        />
      </mesh>
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[wireGeometry]} />
        <lineBasicMaterial color={accentColor} transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

function SceneLights({ accentColor = '#6366f1' }: { accentColor?: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -2, -3]} intensity={1.4} color={accentColor} />
      <pointLight position={[0, -4, 2]} intensity={0.9} color="#38bdf8" />
      <directionalLight position={[2, 4, 3]} intensity={0.6} />
    </>
  )
}

function ParticleField({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 2.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.025
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#a5b4fc" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

export default function CrystalCore({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneLights />
      <ParticleField />
      <WobbleGeometry scrollProgress={scrollProgress} color="#818cf8" accentColor="#6366f1" />
    </Canvas>
  )
}
