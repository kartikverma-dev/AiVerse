import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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
  console.log(e)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function run() {
  const { data, error } = await db.from('concepts').select('*')
  if (error) {
    console.error('Error fetching:', error)
  } else {
    console.log('Total concepts:', data.length)
    const invalidConcepts = data.filter(c => !c.slug || !c.name || !c.status || !c.difficulty)
    console.log('Concepts missing key fields:', invalidConcepts.map(c => ({ id: c.id, name: c.name, slug: c.slug, status: c.status, difficulty: c.difficulty })))
  }
}
run()
