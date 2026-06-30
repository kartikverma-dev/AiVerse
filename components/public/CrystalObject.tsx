'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// A faceted icosahedron "crystal" with displaced vertices for an organic,
// non-uniform gem look — rotates slowly, responds to scroll progress (0-1)
// passed in as a prop, and reacts gently to pointer position for parallax.

function Crystal({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const { viewport, pointer } = useThree()

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.4, 1)
    const pos = geo.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const noise = 0.12 * Math.sin(v.x * 4) * Math.cos(v.y * 3) + 0.08 * Math.sin(v.z * 5)
      v.addScaledVector(v.clone().normalize(), noise)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current || !innerRef.current) return
    const t = state.clock.getElapsedTime()
    const sp = scrollProgress.current

    // Base continuous rotation
    meshRef.current.rotation.y += delta * 0.18
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.15

    // Scroll-driven extra spin + scale pulse
    meshRef.current.rotation.y += sp * 0.012
    meshRef.current.rotation.z = sp * 1.4
    const scale = 1 + sp * 0.35
    meshRef.current.scale.setScalar(scale)

    // Subtle pointer parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, pointer.x * 0.25, 0.04)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, pointer.y * 0.15, 0.04)

    innerRef.current.rotation.y -= delta * 0.3
    innerRef.current.rotation.x += delta * 0.12
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#6366f1"
          metalness={0.15}
          roughness={0.08}
          transmission={0.85}
          thickness={1.6}
          ior={1.45}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.6}
          attenuationColor="#818cf8"
          attenuationDistance={1.2}
        />
      </mesh>
      {/* inner glowing core for depth */}
      <mesh ref={innerRef} scale={0.45}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null)
  const count = 180
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#818cf8" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function Scene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={2.2} color="#a5b4fc" />
      <pointLight position={[-4, -2, -3]} intensity={1.4} color="#6366f1" />
      <pointLight position={[0, 4, -4]} intensity={1} color="#38bdf8" />
      <Crystal scrollProgress={scrollProgress} />
      <Particles />
    </>
  )
}

export default function CrystalObject({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.8]}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  )
}
