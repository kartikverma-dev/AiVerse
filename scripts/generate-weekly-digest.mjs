import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read env variables from .env.local if present
try {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach(line => {
      const parts = line.split('=')
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const val = parts.slice(1).join('=').trim()
        process.env[key] = val
      }
    })
  }
} catch (e) {
  console.log('No .env.local file found or failed to load:', e.message)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment!')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function autoGenerateWeeklyDigests() {
  console.log('🔍 Fetching all concepts and existing digest entries...')
  const [{ data: concepts, error: cErr }, { data: existingDigests, error: dErr }] = await Promise.all([
    db.from('concepts').select('id, name, slug, tldr, status, difficulty, first_appeared, created_at'),
    db.from('digest_entries').select('concept_id')
  ])

  if (cErr || dErr) {
    console.error('Error fetching data:', cErr || dErr)
    return
  }

  const existingConceptIds = new Set((existingDigests || []).map(d => d.concept_id))
  const unseededConcepts = (concepts || []).filter(c => !existingConceptIds.has(c.id))

  console.log(`Found ${concepts.length} total concepts. ${unseededConcepts.length} concepts need digest entries.`)

  if (unseededConcepts.length === 0) {
    console.log('✨ All concepts already have weekly digest entries!')
    return
  }

  // Generate digest records for unseeded concepts
  const newDigestRecords = unseededConcepts.map((c, idx) => {
    // Group into current recent weeks
    const weeks = ['2026-07-20', '2026-07-13', '2026-07-06', '2026-06-29']
    const week_of = weeks[idx % weeks.length]

    const types = ['new_concept', 'status_change', 'framework_release', 'notable_paper']
    const entry_type = c.status === 'emerging' ? 'new_concept' : types[idx % types.length]

    const summary = `${c.name} (${c.slug}) featured in CredgeAiVerse digest: ${c.tldr}`

    return {
      week_of,
      entry_type,
      concept_id: c.id,
      summary
    }
  })

  console.log(`Inserting ${newDigestRecords.length} auto-generated digest records...`)
  const { error: insertErr } = await db.from('digest_entries').insert(newDigestRecords)

  if (insertErr) {
    console.error('Error inserting digest entries:', insertErr)
  } else {
    console.log(`🎉 Successfully generated and inserted ${newDigestRecords.length} weekly digest entries!`)
  }
}

autoGenerateWeeklyDigests().catch(err => console.error(err))
