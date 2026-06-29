import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AiVerse — Track the Evolution of AI Ideas',
  description: 'A living knowledge graph for the AI ecosystem. Track how terms are born, evolve, and whether they are worth your attention today.',
  keywords: ['AI', 'machine learning', 'knowledge graph', 'AI terminology', 'LLM', 'artificial intelligence'],
  openGraph: {
    title: 'AiVerse — Track the Evolution of AI Ideas',
    description: 'Don\'t chase headlines. Track the evolution of ideas.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
