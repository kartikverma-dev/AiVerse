'use client'
import dynamic from 'next/dynamic'

const CrystalCore = dynamic(() => import('./CrystalCore'), {
  ssr: false,
  loading: () => null,
})

export default function CrystalCoreClient({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return <CrystalCore scrollProgress={scrollProgress} />
}
