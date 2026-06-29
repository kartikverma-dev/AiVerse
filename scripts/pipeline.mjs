#!/usr/bin/env node
/**
 * AIKnow Weekly Pipeline
 * Runs via GitHub Actions every Monday
 * - Fetches RSS from AI company blogs
 * - Queries Semantic Scholar for paper mentions
 * - Recalculates concept statuses via NVIDIA NIM
 * - Generates weekly digest
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const nim = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

const RSS_FEEDS = [
  { name: 'Anthropic', url: 'https://www.anthropic.com/rss.xml' },
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/' },
]

async function fetchRSS(feed) {
  try {
    const res = await fetch(feed.url, { signal: AbortSignal.timeout(10000) })
    const text = await res.text()
    // Simple title extraction from RSS XML
    const titles = [...text.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g)]
      .slice(1, 6)
      .map(m => m[1] || m[2])
    console.log(`  ${feed.name}: ${titles.length} recent posts`)
    return titles
  } catch (e) {
    console.log(`  ${feed.name}: failed (${e.message})`)
    return []
  }
}

async function fetchPaperMentions(conceptName) {
  try {
    const query = encodeURIComponent(conceptName)
    const res = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&limit=5&fields=title,year,citationCount`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()
    return data.data?.length || 0
  } catch {
    return 0
  }
}

async function recalculateStatus(concept, paperMentions) {
  try {
    const prompt = `AI concept: "${concept.name}"
Current status: ${concept.status}
Paper mentions found this week: ${paperMentions}
First appeared: ${concept.first_appeared || 'unknown'}

Based on this evidence, should the status change? Respond with ONLY JSON:
{"new_status": "emerging|growing|stable|declining|historical", "changed": true|false, "reasoning": "one sentence"}`

    const response = await nim.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.1,
    })

    const content = response.choices[0]?.message?.content || '{}'
    return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
  } catch {
    return { changed: false }
  }
}

async function main() {
  console.log('🚀 AIKnow Weekly Pipeline starting…\n')
  const weekOf = new Date().toISOString().split('T')[0]
  const digestEntries = []

  // Step 1: RSS ingestion
  console.log('📡 Step 1: RSS ingestion')
  for (const feed of RSS_FEEDS) {
    await fetchRSS(feed)
  }

  // Step 2: Fetch all concepts
  console.log('\n📊 Step 2: Loading concepts from database')
  const { data: concepts, error } = await db
    .from('concepts')
    .select('id, name, status, first_appeared')
    .eq('approved', true)

  if (error) { console.error('DB error:', error); process.exit(1) }
  console.log(`  Found ${concepts.length} approved concepts`)

  // Step 3: Paper mentions + status recalculation
  console.log('\n📄 Step 3: Semantic Scholar + status recalculation')
  const statusChanges = []

  for (const concept of concepts.slice(0, 10)) { // Rate limit: process first 10
    process.stdout.write(`  ${concept.name}… `)
    const paperMentions = await fetchPaperMentions(concept.name)

    // Store trend snapshot
    await db.from('trend_snapshots').upsert({
      concept_id: concept.id,
      week_of: weekOf,
      paper_mentions: paperMentions,
    }, { onConflict: 'concept_id,week_of' })

    // Ask NIM if status should change
    if (paperMentions > 0) {
      const result = await recalculateStatus(concept, paperMentions)
      if (result.changed && result.new_status !== concept.status) {
        statusChanges.push({ concept, oldStatus: concept.status, newStatus: result.new_status, reasoning: result.reasoning })
        await db.from('concepts').update({ status: result.new_status, updated_at: new Date().toISOString() }).eq('id', concept.id)
        console.log(`CHANGED: ${concept.status} → ${result.new_status}`)
      } else {
        console.log(`ok (${paperMentions} papers)`)
      }
    } else {
      console.log('no new papers')
    }

    await new Promise(r => setTimeout(r, 500)) // Rate limit
  }

  // Step 4: Build digest
  console.log('\n📬 Step 4: Generating weekly digest')

  for (const change of statusChanges) {
    digestEntries.push({
      week_of: weekOf,
      entry_type: 'status_change',
      concept_id: change.concept.id,
      summary: `${change.concept.name} status updated: ${change.oldStatus} → ${change.newStatus}. ${change.reasoning || ''}`,
    })
  }

  if (digestEntries.length > 0) {
    await db.from('digest_entries').insert(digestEntries)
    console.log(`  Inserted ${digestEntries.length} digest entries`)
  } else {
    console.log('  No status changes this week')
  }

  console.log('\n✅ Pipeline complete!')
  console.log(`  Status changes: ${statusChanges.length}`)
  console.log(`  Digest entries: ${digestEntries.length}`)
}

main().catch(e => { console.error('Pipeline failed:', e); process.exit(1) })
